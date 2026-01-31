import { slugify } from "./toc";

function escapeHtml(input: string): string {
  return input
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

export function renderMarkdown(markdown: string): string {
  const lines = markdown.split("\n");
  let html = "";
  let inParagraph = false;
  let inCodeBlock = false;

  const closeParagraph = () => {
    if (inParagraph) {
      html += "</p>";
      inParagraph = false;
    }
  };

  for (const line of lines) {
    if (line.startsWith("```")) {
      closeParagraph();
      if (!inCodeBlock) {
        html += "<pre><code>";
        inCodeBlock = true;
      } else {
        html += "</code></pre>";
        inCodeBlock = false;
      }
      continue;
    }

    if (inCodeBlock) {
      html += `${escapeHtml(line)}\n`;
      continue;
    }

    if (!line.trim()) {
      closeParagraph();
      continue;
    }

    const headingMatch = /^(#{2,3})\s+(.*)/.exec(line);
    if (headingMatch) {
      closeParagraph();
      const depth = headingMatch[1].length;
      const title = headingMatch[2].trim();
      const id = slugify(title);
      html += `<h${depth} id="${id}">${escapeHtml(title)}</h${depth}>`;
      continue;
    }

    if (!inParagraph) {
      html += "<p>";
      inParagraph = true;
    } else {
      html += " ";
    }
    html += escapeHtml(line.trim());
  }

  closeParagraph();
  if (inCodeBlock) {
    html += "</code></pre>";
  }

  return html;
}
