import { useState, useRef, useCallback, useEffect } from "react";
import type { OnMount } from "@monaco-editor/react";
import {
  CodeEditor,
  OutputConsole,
  RunControls,
  PlaygroundSidebar,
} from "@/components/playground";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/context/ToastContext";
import {
  getSnippets,
  saveSnippet,
  updateSnippet,
  deleteSnippet,
  type PlaygroundLanguage,
  type CodeSnippet,
} from "@/services/playground";

// ── Pyodide types (loaded via CDN) ─────────────────────
interface PyodideInstance {
  runPythonAsync: (code: string) => Promise<unknown>;
  loadPackage: (pkg: string | string[]) => Promise<void>;
}
declare global {
  interface Window {
    loadPyodide: (cfg?: { indexURL?: string }) => Promise<PyodideInstance>;
  }
}

// ── Starter templates ──────────────────────────────────
const TEMPLATES: Record<PlaygroundLanguage, string> = {
  javascript: `// JavaScript Playground
console.log("Hello, World!");

const add = (a, b) => a + b;
console.log("2 + 3 =", add(2, 3));

const nums = [5, 3, 8, 1, 9, 2];
console.log("Sorted:", [...nums].sort((a, b) => a - b));`,

  typescript: `// TypeScript Playground
interface User {
  name: string;
  age: number;
}

const greet = (user: User): string =>
  \`Hello, \${user.name}! You are \${user.age} years old.\`;

console.log(greet({ name: "Alice", age: 30 }));

const double = <T extends number>(arr: T[]): T[] =>
  arr.map(n => (n * 2) as T);

console.log(double([1, 2, 3, 4, 5]));`,

  python: `# Python Playground (powered by Pyodide)
print("Hello, World!")

def fibonacci(n):
    a, b = 0, 1
    for _ in range(n):
        print(a, end=" ")
        a, b = b, a + b
    print()

fibonacci(10)

squares = [x**2 for x in range(1, 6)]
print("Squares:", squares)`,

  sql: `-- SQL Playground (in-memory SQLite via sql.js)
CREATE TABLE users (
  id    INTEGER PRIMARY KEY,
  name  TEXT NOT NULL,
  role  TEXT DEFAULT 'user'
);

INSERT INTO users VALUES (1, 'Alice', 'admin');
INSERT INTO users VALUES (2, 'Bob',   'user');
INSERT INTO users VALUES (3, 'Carol', 'user');

SELECT * FROM users;
SELECT name FROM users WHERE role = 'admin';
SELECT COUNT(*) AS total FROM users;`,
};

// ── Module-level singletons (persist across re-renders) ─
let pyodideInstance: PyodideInstance | null = null;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
let sqlJsModule: any | null = null;

export default function PlaygroundPage() {
  const { user } = useAuth();
  const { success, error: toastError } = useToast();

  const [language, setLanguage] = useState<PlaygroundLanguage>("javascript");
  const [code, setCode] = useState(TEMPLATES.javascript);
  const [output, setOutput] = useState<
    {
      type: "log" | "error" | "warn" | "info" | "system" | "table";
      text: string;
    }[]
  >([]);
  const [isRunning, setIsRunning] = useState(false);
  const [snippets, setSnippets] = useState<CodeSnippet[]>([]);
  const [activeSnippetId, setActiveSnippetId] = useState<string | null>(null);
  const [snippetTitle, setSnippetTitle] = useState("Untitled");

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const monacoRef = useRef<any>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  // ── Load snippets on mount ──
  useEffect(() => {
    if (!user) return;
    getSnippets(user.id)
      .then(setSnippets)
      .catch(() => {});
  }, [user]);

  // ── Message listener for iframe output ──
  useEffect(() => {
    const handler = (e: MessageEvent) => {
      if (e.data?.source !== "playground-iframe") return;
      setOutput((prev) => [
        ...prev,
        { type: e.data.method ?? "log", text: e.data.text },
      ]);
    };
    window.addEventListener("message", handler);
    return () => window.removeEventListener("message", handler);
  }, []);

  const emit = (type: (typeof output)[0]["type"], text: string) =>
    setOutput((prev) => [...prev, { type, text }]);

  // ── Language change ──
  const handleLanguageChange = (lang: PlaygroundLanguage) => {
    setLanguage(lang);
    setCode(TEMPLATES[lang]);
    setOutput([]);
    setActiveSnippetId(null);
  };

  // ── JS/TS runner via sandboxed iframe ──
  const runJSInIframe = useCallback(async (jsCode: string) => {
    const iframe = iframeRef.current;
    if (!iframe) return;
    const html = `<!DOCTYPE html><html><body><script>
const _send = (method, args) => parent.postMessage({
  source: 'playground-iframe', method,
  text: args.map(a => { try { return typeof a === 'object' ? JSON.stringify(a,null,2) : String(a); } catch(e){ return String(a); }}).join(' ')
}, '*');
console.log = (...a) => _send('log',a);
console.error = (...a) => _send('error',a);
console.warn = (...a) => _send('warn',a);
console.info = (...a) => _send('info',a);
window.onerror = (msg) => _send('error',[msg]);
try { ${jsCode} } catch(e){ _send('error',[e.message]); }
<\/script></body></html>`;
    iframe.srcdoc = html;
  }, []);

  // ── TypeScript: transpile via Monaco worker, then run in iframe ──
  const runTypeScript = useCallback(
    async (tsCode: string) => {
      const monaco = monacoRef.current;
      if (!monaco) {
        emit("warn", "Monaco not ready — running as plain JavaScript");
        await runJSInIframe(tsCode);
        return;
      }
      try {
        emit("system", "Transpiling TypeScript…");
        const uri = monaco.Uri.parse("file:///playground.ts");
        let model = monaco.editor.getModel(uri);
        if (!model)
          model = monaco.editor.createModel(tsCode, "typescript", uri);
        else model.setValue(tsCode);
        const getWorker =
          await monaco.languages.typescript.getTypeScriptWorker();
        const worker = await getWorker(uri);
        const emitOutput = await worker.getEmitOutput(uri.toString());
        const js: string = emitOutput.outputFiles?.[0]?.text ?? tsCode;
        model.dispose();
        await runJSInIframe(js);
      } catch (e) {
        emit(
          "error",
          e instanceof Error ? e.message : "TypeScript compile error",
        );
      }
    },
    [runJSInIframe],
  );

  // ── Python runner via Pyodide ──
  const runPython = useCallback(async (pyCode: string) => {
    try {
      if (!pyodideInstance) {
        emit("system", "Loading Python environment (first load ~50 MB)…");
        if (!window.loadPyodide) {
          await new Promise<void>((res, rej) => {
            const s = document.createElement("script");
            s.src = "https://cdn.jsdelivr.net/pyodide/v0.26.4/full/pyodide.js";
            s.onload = () => res();
            s.onerror = () => rej(new Error("Failed to load Pyodide"));
            document.head.appendChild(s);
          });
        }
        pyodideInstance = await window.loadPyodide({
          indexURL: "https://cdn.jsdelivr.net/pyodide/v0.26.4/full/",
        });
        emit("system", "Python ready.");
      }
      const py = pyodideInstance;
      // Capture stdout
      await py.runPythonAsync(`
import sys, io
_buf = io.StringIO()
sys.stdout = _buf
`);
      let errorMsg: string | null = null;
      try {
        await py.runPythonAsync(pyCode);
      } catch (e) {
        errorMsg = e instanceof Error ? e.message : String(e);
      }
      const captured = String(
        await py.runPythonAsync(`
sys.stdout = sys.__stdout__
_buf.getvalue()
`),
      );
      if (captured.trim()) {
        captured
          .trim()
          .split("\n")
          .forEach((line) => emit("log", line));
      }
      if (errorMsg) emit("error", errorMsg);
    } catch (e) {
      emit("error", e instanceof Error ? e.message : "Python runtime error");
    }
  }, []);

  // ── SQL runner via sql.js ──
  const runSQL = useCallback(async (sqlCode: string) => {
    try {
      if (!sqlJsModule) {
        emit("system", "Loading SQL engine…");
        const initSqlJs = (await import("sql.js")).default;
        sqlJsModule = await initSqlJs({
          locateFile: (f: string) =>
            `https://cdn.jsdelivr.net/npm/sql.js@1.12.0/dist/${f}`,
        });
        emit("system", "SQL ready (fresh in-memory database).");
      }
      const db = new sqlJsModule.Database();
      const statements = sqlCode
        .split(";")
        .map((s) => s.trim())
        .filter(Boolean);
      for (const stmt of statements) {
        try {
          const results = db.exec(stmt + ";");
          if (results.length > 0) {
            const { columns, values } = results[0];
            emit("system", `→ ${stmt.split("\n")[0].substring(0, 60)}…`);
            // header
            emit("table", columns.join(" | "));
            emit("table", columns.map(() => "---").join("-|-"));
            values.forEach((row: (string | number | null | Uint8Array)[]) =>
              emit(
                "table",
                row.map((v) => (v === null ? "NULL" : String(v))).join(" | "),
              ),
            );
            emit(
              "log",
              `(${values.length} row${values.length === 1 ? "" : "s"})`,
            );
          } else {
            emit("system", `✓ ${stmt.split(" ")[0].toUpperCase()} OK`);
          }
        } catch (e) {
          emit("error", e instanceof Error ? e.message : "SQL error");
        }
      }
      db.close();
    } catch (e) {
      emit("error", e instanceof Error ? e.message : "SQL engine error");
    }
  }, []);

  // ── Main run handler ──
  const handleRun = useCallback(async () => {
    setIsRunning(true);
    setOutput([]);
    emit("system", `Running ${language}…`);
    try {
      if (language === "javascript") await runJSInIframe(code);
      else if (language === "typescript") await runTypeScript(code);
      else if (language === "python") await runPython(code);
      else await runSQL(code);
    } finally {
      // JS/TS output arrives via postMessage asynchronously; give it 100ms
      setTimeout(
        () => setIsRunning(false),
        language === "sql" || language === "python" ? 0 : 300,
      );
    }
  }, [language, code, runJSInIframe, runTypeScript, runPython, runSQL]);

  // ── Snippet actions ──
  const handleSave = async () => {
    if (!user) return;
    try {
      if (activeSnippetId) {
        await updateSnippet(activeSnippetId, snippetTitle, code);
        setSnippets((prev) =>
          prev.map((s) =>
            s.id === activeSnippetId ? { ...s, title: snippetTitle, code } : s,
          ),
        );
        success("Snippet updated");
      } else {
        const title = snippetTitle || `${language} snippet`;
        const s = await saveSnippet(user.id, title, language, code);
        setSnippets((prev) => [s, ...prev]);
        setActiveSnippetId(s.id);
        success("Snippet saved");
      }
    } catch {
      toastError("Failed to save snippet");
    }
  };

  const handleSelectSnippet = (s: CodeSnippet) => {
    setLanguage(s.language);
    setCode(s.code);
    setActiveSnippetId(s.id);
    setSnippetTitle(s.title);
    setOutput([]);
  };

  const handleDeleteSnippet = async (id: string) => {
    try {
      await deleteSnippet(id);
      setSnippets((prev) => prev.filter((s) => s.id !== id));
      if (activeSnippetId === id) {
        setActiveSnippetId(null);
        setSnippetTitle("Untitled");
      }
    } catch {
      toastError("Failed to delete snippet");
    }
  };

  const handleNewSnippet = () => {
    setActiveSnippetId(null);
    setSnippetTitle("Untitled");
    setCode(TEMPLATES[language]);
    setOutput([]);
  };

  const handleMount: OnMount = (_editor, monaco) => {
    monacoRef.current = monaco;
    monaco.languages.typescript.typescriptDefaults.setDiagnosticsOptions({
      noSemanticValidation: true,
      noSyntaxValidation: false,
    });
    monaco.languages.typescript.typescriptDefaults.setCompilerOptions({
      target: monaco.languages.typescript.ScriptTarget.ESNext,
      allowNonTsExtensions: true,
    });
  };

  return (
    <div className="flex flex-col h-full bg-[#0f1117]">
      {/* Title bar */}
      <div className="flex items-center gap-3 px-6 py-3 border-b border-[#2a2d3e] shrink-0">
        <h1 className="text-lg font-bold text-[#f1f5f9]">Code Playground</h1>
        <input
          value={snippetTitle}
          onChange={(e) => setSnippetTitle(e.target.value)}
          className="px-2 py-0.5 rounded bg-transparent border border-transparent hover:border-[#2a2d3e] focus:border-[#6c63ff] text-[#94a3b8] text-sm outline-none transition-colors"
          placeholder="Snippet name…"
        />
      </div>

      {/* Body */}
      <div className="flex flex-1 overflow-hidden">
        <PlaygroundSidebar
          snippets={snippets}
          activeId={activeSnippetId}
          onSelect={handleSelectSnippet}
          onDelete={handleDeleteSnippet}
          onNew={handleNewSnippet}
        />

        <div className="flex flex-col flex-1 overflow-hidden">
          <RunControls
            language={language}
            onLanguageChange={handleLanguageChange}
            onRun={handleRun}
            onReset={() => {
              setCode(TEMPLATES[language]);
              setOutput([]);
            }}
            onSave={handleSave}
            isRunning={isRunning}
          />

          <div className="flex flex-1 overflow-hidden">
            {/* Editor */}
            <div className="flex-1 overflow-hidden">
              <CodeEditor
                language={language}
                value={code}
                onChange={setCode}
                onMount={handleMount}
              />
            </div>

            {/* Output — 40% width */}
            <div className="w-[40%] shrink-0">
              <OutputConsole
                lines={output}
                onClear={() => setOutput([])}
                isRunning={isRunning}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Hidden iframe for JS/TS sandbox execution */}
      <iframe
        ref={iframeRef}
        sandbox="allow-scripts"
        title="code-runner"
        style={{ display: "none" }}
      />
    </div>
  );
}
