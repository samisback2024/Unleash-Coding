import Editor, { type OnMount } from "@monaco-editor/react";
import type { PlaygroundLanguage } from "@/services/playground";

interface Props {
  language: PlaygroundLanguage;
  value: string;
  onChange: (val: string) => void;
  onMount?: OnMount;
}

const monacoLang: Record<PlaygroundLanguage, string> = {
  javascript: "javascript",
  typescript: "typescript",
  python: "python",
  sql: "sql",
};

export function CodeEditor({ language, value, onChange, onMount }: Props) {
  return (
    <Editor
      height="100%"
      language={monacoLang[language]}
      value={value}
      theme="vs-dark"
      onChange={(v) => onChange(v ?? "")}
      onMount={onMount}
      options={{
        fontSize: 14,
        minimap: { enabled: false },
        scrollBeyondLastLine: false,
        wordWrap: "on",
        automaticLayout: true,
        padding: { top: 12 },
        lineNumbers: "on",
        renderLineHighlight: "all",
        fontFamily: "'Fira Code', 'Cascadia Code', 'JetBrains Mono', monospace",
        fontLigatures: true,
        tabSize: 2,
      }}
    />
  );
}
