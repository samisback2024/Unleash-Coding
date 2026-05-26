// eslint-disable-next-line @typescript-eslint/no-explicit-any
const db = (await import("@/lib/supabase").then((m) => m.supabase)) as any;

export type PlaygroundLanguage = "javascript" | "typescript" | "python" | "sql";

export interface CodeSnippet {
  id: string;
  user_id: string;
  title: string;
  language: PlaygroundLanguage;
  code: string;
  created_at: string;
  updated_at: string;
}

export async function getSnippets(userId: string): Promise<CodeSnippet[]> {
  const { data, error } = await db
    .from("saved_code_snippets")
    .select("*")
    .eq("user_id", userId)
    .order("updated_at", { ascending: false });
  if (error) throw error;
  return data ?? [];
}

export async function saveSnippet(
  userId: string,
  title: string,
  language: PlaygroundLanguage,
  code: string,
): Promise<CodeSnippet> {
  const { data, error } = await db
    .from("saved_code_snippets")
    .insert({ user_id: userId, title, language, code })
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function updateSnippet(
  id: string,
  title: string,
  code: string,
): Promise<void> {
  const { error } = await db
    .from("saved_code_snippets")
    .update({ title, code, updated_at: new Date().toISOString() })
    .eq("id", id);
  if (error) throw error;
}

export async function deleteSnippet(id: string): Promise<void> {
  const { error } = await db.from("saved_code_snippets").delete().eq("id", id);
  if (error) throw error;
}
