import type { KodeProgram, KodeStatement } from './kode.ts';
import { astToIr, pathToAst } from './ast.ts';
import { createProvenance, type Path } from './model.ts';
import { operatorToIr } from './ir.ts';
import type { MhcmProgram } from './program.ts';

export function compileKode(source: string): MhcmProgram {
  const ast = parseAndBuild(source);
  const nodes: MhcmProgram['nodes'] = [];
  const symbols = new Map<string, string>();

  for (const statement of ast.statements) {
    if (statement.kind === 'PathDeclaration') {
      const provenance = createProvenance('HNK-KODE-KODE0', ['KODE-0'], 'EXPERIMENTAL', 'kode-0@0.1.0');
      const path: Path = {
        id: `PATH-${statement.name}`,
        start: statement.nodes[0],
        nodes: statement.nodes,
        edges: statement.nodes.slice(0, -1).map((_, i) => `${statement.nodes[i]}->${statement.nodes[i + 1]}`),
        end: statement.nodes[statement.nodes.length - 1],
        directed: true,
        provenance,
      };
      const ir = astToIr(pathToAst(path));
      nodes.push({ id: statement.name, kind: 'IR', ir });
      symbols.set(statement.name, statement.name);
      continue;
    }

    if (statement.kind === 'ReverseStatement') {
      const input = symbols.get(statement.source);
      if (!input) throw new Error(`Unknown KODE symbol "${statement.source}"`);
      nodes.push({ id: statement.name, kind: 'OPERATOR', operator: 'PATH_REVERSE', inputs: [input] });
      symbols.set(statement.name, statement.name);
      continue;
    }

    const left = symbols.get(statement.left);
    const right = symbols.get(statement.right);
    if (!left || !right) throw new Error(`Unknown KODE symbol in compose "${statement.name}"`);
    nodes.push({ id: statement.name, kind: 'OPERATOR', operator: 'PATH_COMPOSE', inputs: [left, right] });
    symbols.set(statement.name, statement.name);
  }

  return { id: 'KODE-PROGRAM', version: '0.1', nodes, outputs: nodes.length ? [nodes[nodes.length - 1].id] : [] };
}

function parseAndBuild(source: string): KodeProgram {
  return parseKode(source);
}
