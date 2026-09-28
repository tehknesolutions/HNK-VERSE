export type KodeTokenKind = 'IDENT' | 'STRING' | 'ARROW' | 'LPAREN' | 'RPAREN' | 'COMMA' | 'EQUALS' | 'SEMICOLON' | 'EOF';

export type KodeToken = { kind: KodeTokenKind; lexeme: string; position: number };

export type KodeStatement =
  | { kind: 'PathDeclaration'; name: string; nodes: string[] }
  | { kind: 'ReverseStatement'; name: string; source: string }
  | { kind: 'ComposeStatement'; name: string; left: string; right: string };

export type KodeProgram = { kind: 'Program'; statements: KodeStatement[] };

export function lexKode(source: string): KodeToken[] {
  const tokens: KodeToken[] = [];
  let i = 0;
  while (i < source.length) {
    const ch = source[i];
    if (/\s/.test(ch)) { i += 1; continue; }
    if (source.startsWith('->', i)) { tokens.push({ kind: 'ARROW', lexeme: '->', position: i }); i += 2; continue; }
    const single: Record<string, KodeTokenKind> = { '(': 'LPAREN', ')': 'RPAREN', ',': 'COMMA', '=': 'EQUALS', ';': 'SEMICOLON' };
    if (single[ch]) { tokens.push({ kind: single[ch], lexeme: ch, position: i }); i += 1; continue; }
    if (ch === '"') {
      const start = i++;
      let value = '';
      while (i < source.length && source[i] !== '"') value += source[i++];
      if (source[i] !== '"') throw new Error(`Unterminated string at ${start}`);
      i += 1;
      tokens.push({ kind: 'STRING', lexeme: value, position: start });
      continue;
    }
    const match = source.slice(i).match(/^[A-Za-z_][A-Za-z0-9_-]*/);
    if (match) { tokens.push({ kind: 'IDENT', lexeme: match[0], position: i }); i += match[0].length; continue; }
    throw new Error(`Unexpected character "${ch}" at ${i}`);
  }
  tokens.push({ kind: 'EOF', lexeme: '', position: source.length });
  return tokens;
}

class Parser {
  private index = 0;
  constructor(private readonly tokens: KodeToken[]) {}
  private peek() { return this.tokens[this.index]; }
  private take(kind: KodeTokenKind) {
    const token = this.peek();
    if (token.kind !== kind) throw new Error(`Expected ${kind} at ${token.position}, got ${token.kind}`);
    this.index += 1;
    return token;
  }
  private keyword(value: string) {
    const token = this.take('IDENT');
    if (token.lexeme !== value) throw new Error(`Expected "${value}" at ${token.position}`);
    return token;
  }
  parse(): KodeProgram {
    const statements: KodeStatement[] = [];
    while (this.peek().kind !== 'EOF') {
      const statement = this.statement();
      this.take('SEMICOLON');
      statements.push(statement);
    }
    return { kind: 'Program', statements };
  }
  private statement(): KodeStatement {
    const head = this.peek().lexeme;
    if (head === 'path') {
      this.keyword('path');
      const name = this.take('IDENT').lexeme;
      this.take('EQUALS');
      const nodes = [this.take('IDENT').lexeme];
      while (this.peek().kind === 'ARROW') { this.take('ARROW'); nodes.push(this.take('IDENT').lexeme); }
      if (nodes.length < 2) throw new Error('Path requires at least two nodes.');
      return { kind: 'PathDeclaration', name, nodes };
    }
    if (head === 'reverse') {
      this.keyword('reverse');
      const name = this.take('IDENT').lexeme;
      this.take('EQUALS');
      const source = this.take('IDENT').lexeme;
      return { kind: 'ReverseStatement', name, source };
    }
    if (head === 'compose') {
      this.keyword('compose');
      const name = this.take('IDENT').lexeme;
      this.take('EQUALS');
      const left = this.take('IDENT').lexeme;
      this.take('COMMA');
      const right = this.take('IDENT').lexeme;
      return { kind: 'ComposeStatement', name, left, right };
    }
    throw new Error(`Unknown KODE statement "${head}"`);
  }
}

export function parseKode(source: string): KodeProgram {
  return new Parser(lexKode(source)).parse();
}
