const parseScalar = (value: string): unknown => {
  const trimmed = value.trim();
  if (trimmed.startsWith("[") && trimmed.endsWith("]")) {
    const inner = trimmed.slice(1, -1).trim();
    if (!inner) return [];
    return inner.split(",").map((item) => item.trim());
  }
  if (/^-?\d+(\.\d+)?$/.test(trimmed)) {
    return Number(trimmed);
  }
  return trimmed;
};

export function parseSimpleYaml(input: string): Record<string, unknown>[] {
  const lines = input.split("\n");
  const items: Record<string, unknown>[] = [];
  let current: Record<string, unknown> | null = null;

  for (const line of lines) {
    if (!line.trim()) continue;
    if (line.trim().startsWith("#")) continue;

    if (line.trim().startsWith("- ")) {
      const entry = line.trim().slice(2);
      current = {};
      items.push(current);
      if (entry) {
        const [key, ...rest] = entry.split(":");
        if (key && rest.length) {
          current[key.trim()] = parseScalar(rest.join(":").trim());
        }
      }
      continue;
    }

    if (!current) continue;
    const [key, ...rest] = line.trim().split(":");
    if (!key || !rest.length) continue;
    current[key.trim()] = parseScalar(rest.join(":").trim());
  }

  return items;
}

export function parseFrontmatter(input: string): {
  data: Record<string, unknown>;
  content: string;
} {
  if (!input.startsWith("---")) {
    return { data: {}, content: input };
  }

  const end = input.indexOf("\n---", 3);
  if (end === -1) {
    return { data: {}, content: input };
  }

  const raw = input.slice(3, end).trim();
  const content = input.slice(end + 4).trimStart();
  const data: Record<string, unknown> = {};
  const lines = raw.split("\n");
  for (const line of lines) {
    if (!line.trim()) continue;
    const [key, ...rest] = line.trim().split(":");
    if (!key || !rest.length) continue;
    data[key.trim()] = parseScalar(rest.join(":").trim());
  }

  return { data, content };
}
