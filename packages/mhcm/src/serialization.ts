import type { Path } from './model.ts';

export type CanonicalPath = {
  id: string;
  start: string;
  nodes: string[];
  edges: string[];
  end: string;
  directed: boolean;
  provenance: Path['provenance'];
};

function stableValue(value: unknown): unknown {
  if (Array.isArray(value)) return value.map(stableValue);
  if (value && typeof value === 'object') {
    return Object.fromEntries(
      Object.entries(value as Record<string, unknown>)
        .sort(([a], [b]) => a.localeCompare(b))
        .map(([key, child]) => [key, stableValue(child)]),
    );
  }
  return value;
}

export function canonicalizePath(path: Path): CanonicalPath {
  return stableValue(path) as CanonicalPath;
}

export function serializePath(path: Path): string {
  return JSON.stringify(canonicalizePath(path));
}

export function deserializePath(serialized: string): Path {
  return JSON.parse(serialized) as Path;
}
