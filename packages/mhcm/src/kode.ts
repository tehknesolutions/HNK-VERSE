export type KodeTokenKind = 'IDENT' | 'STRING' | 'ARROW' | 'LPAREN' | 'RPAREN' | 'COMMA' | 'EQUALS' | 'SEMICOLON' | 'EOF';

export type KodePosition = { offset: number; line: number; column: number };
export type KodeSpan = { start: number; end: number; startPosition: KodePosition; endPosition: KodePosition };

export type KodeToken = {
  kind: KodeTokenKind;
  lexeme: string;
  position: number;
  span: KodeSpan;
};

export type KodeIdentifier = { name: string; span: KodeSpan };

export type KodeStatement =
  | { kind: 'PathDeclaration'; name: string; nameSpan: KodeSpan; nodes: KodeIdentifier[]; span: KodeSpan }
  | { kind: 'ReverseStatement'; name: string; nameSpan: KodeSpan; source: KodeIdentifier; span: KodeSpan }
  | { kind: 'ComposeStatement'; name: string; nameSpan: KodeSpan; left: KodeIdentifier; right: KodeIdentifier; span: KodeSpan };

export type KodeProgram = { kind: 'Program'; statements: KodeStatement[]; span: KodeSpan };

export class KodeSyntaxError extends Error {
  constructor(message: string, public readonly span: KodeSpan) { super(message); this.name = 'KodeSyntaxError'; }
}

function positionAt(source: string, offset: number): KodePosition {
  let line = 1; let column = 1;
  for (let i = 0; i < offset; i += 1) { if (source[i] === '\\n') { line += 1; column = 1; } else column += 1; }
  return { offset, line, column };
}

function spanOf(source: string, start: number, end: number): KodeSpan {
  return { start, end, startPosition: positionAt(source, start), endPosition: positionAt(source, end) };
}

export function lexKode(source: string): KodeToken[] {
  const tokens: KodeToken[] = [];
  let i = 0;
  while (i < source.length) {
    const ch = source[i];
    if (/\s/.test(ch)) { i += 1; continue; }
    if (source.startsWith('->', i)) {
      tokens.push({ kind: 'ARROW', lexeme: '->', position: i, span: spanOf(source, i, i + 2) }); i += 2; continue;
    }
    const single: Record<string, KodeTokenKind> = { '(': 'LPAREN', ')': 'RPAREN', ',': 'COMMA', '=': 'EQUALS', ';': 'SEMICOLON' };
    if (single[ch]) { tokens.push({ kind: single[ch], lexeme: ch, position: i, span: spanOf(source, i, i + 1) }); i += 1; continue; }
    if (ch === '"') {
      const start = i++;
      let value = '';
      while (i < source.length && source[i] !== '"') value += source[i++];
      if (source[i] !== '"') throw new KodeSyntaxError(`Unterminated string at ${start}`, spanOf(source, start, i));
      i += 1;
      tokens.push({ kind: 'STRING', lexeme: value, position: start, span: spanOf(source, start, i) });
      continue;
    }
    const match = source.slice(i).match(/^[A-Za-z_][A-Za-z0-9_-]*/);
    if (match) {
      const start = i; i += match[0].length;
      tokens.push({ kind: 'IDENT', lexeme: match[0], position: start, span: spanOf(source, start, i) }); continue;
    }
    throw new KodeSyntaxError(`Unexpected character "${ch}" at ${i}`, spanOf(source, i, i + 1));
  }
  tokens.push({ kind: 'EOF', lexeme: '', position: source.length, span: spanOf(source, source.length, source.length) });
  return tokens;
}

class Parser {
  private index = 0;
  constructor(private readonly tokens: KodeToken[], private readonly source: string) {}
  private peek() { return this.tokens[this.index]; }
  private take(kind: KodeTokenKind) {
    const token = this.peek();
    if (token.kind !== kind) throw new KodeSyntaxError(`Expected ${kind} at ${token.position}, got ${token.kind}`, token.span);
    this.index += 1;
    return token;
  }
  private keyword(value: string) {
    const token = this.take('IDENT');
    if (token.lexeme !== value) throw new KodeSyntaxError(`Expected "${value}" at ${token.position}`, token.span);
    return token;
  }
  parse(): KodeProgram {
    const statements: KodeStatement[] = [];
    const start = this.peek().span.start;
    while (this.peek().kind !== 'EOF') {
      const statement = this.statement();
      this.take('SEMICOLON');
      statements.push({ ...statement, span: spanOf(this.source, statement.span.start, this.tokens[this.index - 1].span.end)  });
    }
    return { kind: 'Program', statements, span: spanOf(this.source, start, this.peek().span.end) };
  }
  private statement(): KodeStatement {
    const start = this.peek().span.start;
    const head = this.peek().lexeme;
    if (head === 'path') {
      this.keyword('path'); const nameToken = this.take('IDENT'); const name = nameToken.lexeme; this.take('EQUALS');
      const nodes = [this.take('IDENT')].map((token) => ({ name: token.lexeme, span: token.span }));
      while (this.peek().kind === 'ARROW') { this.take('ARROW'); const token = this.take('IDENT'); nodes.push({ name: token.lexeme, span: token.span }); }
      if (nodes.length < 2) throw new KodeSyntaxError('Path requires at least two nodes.', spanOf(this.source, start, this.peek().span.start));
      return { kind: 'PathDeclaration', name, nameSpan: nameToken.span, nodes, span: spanOf(this.source, start, this.peek().span.start) };
    }
    if (head === 'reverse') {
      this.keyword('reverse'); const nameToken = this.take('IDENT'); const name = nameToken.lexeme; this.take('EQUALS'); const sourceToken = this.take('IDENT'); const source = { name: sourceToken.lexeme, span: sourceToken.span };
      return { kind: 'ReverseStatement', name, nameSpan: nameToken.span, source, span: spanOf(this.source, start, this.peek().span.start) };
    }
    if (head === 'compose') {
      this.keyword('compose'); const nameToken = this.take('IDENT'); const name = nameToken.lexeme; this.take('EQUALS');
      const leftToken = this.take('IDENT'); this.take('COMMA'); const rightToken = this.take('IDENT'); const left = { name: leftToken.lexeme, span: leftToken.span }; const right = { name: rightToken.lexeme, span: rightToken.span };
      return { kind: 'ComposeStatement', name, nameSpan: nameToken.span, left, right, span: spanOf(this.source, start, this.peek().span.start) };
    }
    throw new KodeSyntaxError(`Unknown KODE statement "${head}"`, this.peek().span);
  }
}

export function parseKode(source: string): KodeProgram {
  return new Parser(lexKode(source), source).parse();
}
