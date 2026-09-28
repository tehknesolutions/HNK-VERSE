import type { Cell, Edge, Path } from './model.ts';

export type ValidationIssue = {
  code: string;
  message: string;
  path?: string;
};

export type ValidationResult = {
  status: 'PASS' | 'FAIL';
  issues: ValidationIssue[];
};

export function validatePath(cells: Cell[], edges: Edge[], path: Path): ValidationResult {
  const issues: ValidationIssue[] = [];
  const cellIds = new Set(cells.map((cell) => cell.id));
  const edgeMap = new Map(edges.map((edge) => [edge.id, edge]));

  if (!cellIds.has(path.start)) {
    issues.push({ code: 'PATH_START_NOT_FOUND', message: 'Path start cell does not exist.', path: 'start' });
  }

  if (!cellIds.has(path.end)) {
    issues.push({ code: 'PATH_END_NOT_FOUND', message: 'Path end cell does not exist.', path: 'end' });
  }

  if (path.nodes.length === 0) {
    issues.push({ code: 'PATH_EMPTY', message: 'Path must contain at least one node.', path: 'nodes' });
  }

  if (path.nodes.length !== path.edges.length + 1) {
    issues.push({
      code: 'PATH_ARITY_MISMATCH',
      message: 'A path must contain exactly one more node than edge.',
      path: 'nodes',
    });
  }

  if (path.nodes[0] !== path.start) {
    issues.push({ code: 'PATH_START_MISMATCH', message: 'First path node must equal start.', path: 'nodes[0]' });
  }

  if (path.nodes[path.nodes.length - 1] !== path.end) {
    issues.push({ code: 'PATH_END_MISMATCH', message: 'Last path node must equal end.', path: 'nodes' });
  }

  for (const [index, nodeId] of path.nodes.entries()) {
    if (!cellIds.has(nodeId)) {
      issues.push({ code: 'PATH_NODE_NOT_FOUND', message: `Path node ${nodeId} does not exist.`, path: `nodes[${index}]` });
    }
  }

  for (const [index, edgeId] of path.edges.entries()) {
    const edge = edgeMap.get(edgeId);
    if (!edge) {
      issues.push({ code: 'PATH_EDGE_NOT_FOUND', message: `Path edge ${edgeId} does not exist.`, path: `edges[${index}]` });
      continue;
    }

    const from = path.nodes[index];
    const to = path.nodes[index + 1];
    const connectsForward = edge.source === from && edge.target === to;
    const connectsReverse = !edge.directed && edge.source === to && edge.target === from;

    if (!connectsForward && !connectsReverse) {
      issues.push({
        code: 'EDGE_PATH_DISCONNECT',
        message: `Edge ${edgeId} does not connect path nodes ${from} → ${to}.`,
        path: `edges[${index}]`,
      });
    }
  }

  return {
    status: issues.length === 0 ? 'PASS' : 'FAIL',
    issues,
  };
}
