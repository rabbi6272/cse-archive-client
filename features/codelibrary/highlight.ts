import hljs from "highlight.js";

// Server-side syntax highlighting: the browser gets coloured HTML and never loads highlight.js.
// hljs knows "C++" and "C#" as aliases of cpp and csharp.
export function highlight(code: string, language: string): string {
  const lang = language.toLowerCase();
  if (hljs.getLanguage(lang)) return hljs.highlight(code, { language: lang }).value;
  // Unknown language: escape only. hljs.highlight with "plaintext" does exactly that.
  return hljs.highlight(code, { language: "plaintext" }).value;
}
