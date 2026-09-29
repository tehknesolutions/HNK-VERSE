import { lexKode, parseKode } from '../packages/mhcm/src/index.ts';

const source = 'path A = A -> B;\nreverse R = A;';
const tokens = lexKode(source);
const pathToken = tokens.find((token) => token.lexeme === 'path');
if (!pathToken || pathToken.span.start !== 0 || pathToken.span.end !== 4 || pathToken.span.startPosition.line !== 1 || pathToken.span.startPosition.column !== 1 || pathToken.span.endPosition.column !== 5) throw new Error('KODE token span mismatch.');

const program = parseKode(source);
if (program.statements[0].span.start !== 0 || program.statements[0].span.end !== 16 || program.statements[0].span.startPosition.line !== 1 || program.statements[0].span.endPosition.line !== 1) {
  throw new Error(`KODE statement span mismatch: ${JSON.stringify(program.statements[0].span)}`);
}
if (program.statements[1].span.start !== 17 || program.statements[1].span.end !== source.length || program.statements[1].span.startPosition.line !== 2 || program.statements[1].span.startPosition.column !== 1) {
  throw new Error(`KODE reverse statement span mismatch: ${JSON.stringify(program.statements[1].span)}`);
}

console.log('KODE-0.2 source-span suite: PASS');
console.log('PASS token spans');
console.log('PASS statement spans');
console.log('PASS program spans');
console.log('PASS line/column positions');
