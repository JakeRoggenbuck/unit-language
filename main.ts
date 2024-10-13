export function ends_token(c: string): boolean {
  if (c === '(' || c === ')') {
    return true;
  }

  if (c === ' ' || c === '\t' || c === '\n') {
    return true;
  }

  if (c === '+' || c === '-' || c === '/' || c === '*') {
    return true;
  }

  return false;
}

function isNumber(value?: string | number): boolean {
  return (
    value != null &&
    value !== '' &&
    value !== ' ' &&
    !isNaN(Number(value.toString()))
  );
}

export enum TokenType {
  LEFT_PAREN,
  RIGHT_PAREN,
  NUM_LITERAL,
  PLUS,
  MINUS,
  DIV,
  MUL,
  SIN,
  COS,
  TAN,
  PI,
  E,
  NONE,
}

export type Token = {
  text: string;
  token_type: TokenType;
};

export type Value = {
  val: number;
};

export function tokenize(token_text: string): Token {
  let token_type = TokenType.NONE;

  switch (token_text) {
    case '(':
      token_type = TokenType.LEFT_PAREN;
      break;
    case ')':
      token_type = TokenType.RIGHT_PAREN;
      break;
    case '+':
      token_type = TokenType.PLUS;
      break;
    case '-':
      token_type = TokenType.MINUS;
      break;
    case '*':
      token_type = TokenType.MUL;
      break;
    case '/':
      token_type = TokenType.DIV;
      break;
    case 'sin':
      token_type = TokenType.SIN;
      break;
    case 'cos':
      token_type = TokenType.COS;
      break;
    case 'tan':
      token_type = TokenType.TAN;
      break;
    case 'e':
      token_type = TokenType.E;
      break;
    case 'pi':
      token_type = TokenType.PI;
      break;
    default:
      if (isNumber(token_text)) {
        token_type = TokenType.NUM_LITERAL;
      }
      break;
  }

  return { text: token_text, token_type: token_type };
}

interface Lex {
  token: Token;
  index: number;
}

export function next(content: string, start: number): Lex {
  let buf: string = '';

  for (let i = start; i <= content.length; i++) {
    buf += content[i];

    if (ends_token(content[i])) {
      // if it's a symbol i.e. it ends a token, pop the last char
      if (!ends_token(buf[0])) {
        // pop the last char off the string
        buf = buf.slice(0, -1);
      }
      i++;
      return { token: tokenize(buf), index: i };
    }
  }

  return { token: { text: buf, token_type: TokenType.NONE }, index: -1 };
}

export function parser(content: string) {
  // Add padding
  content += ' ';

  const stack: Value[] = [];

  let index = 0;

  while (index < content.length && index !== -1) {
    const l: Lex = next(content, index);
    index = l.index;
    const token = l.token;

    if (token.token_type === TokenType.NUM_LITERAL) {
      stack.push({ val: Number(token.text) });
    }

    if (token.token_type === TokenType.PLUS) {
      const b = stack.pop();
      const a = stack.pop();

      // Narrowing
      if (a !== undefined && b !== undefined) {
        stack.push({ val: a.val + b.val });
      } else {
        throw new Error('Not enough values on the stack');
      }
    }

    if (token.token_type === TokenType.PI) {
      stack.push({ val: Math.PI });
    }

    if (token.token_type === TokenType.E) {
      stack.push({ val: Math.E });
    }

    if (token.token_type === TokenType.SIN) {
      const a = stack.pop();
      if (a !== undefined) {
        stack.push({ val: Math.sin(a.val) });
      }
    }

    if (token.token_type === TokenType.TAN) {
      const a = stack.pop();
      if (a !== undefined) {
        stack.push({ val: Math.tan(a.val) });
      }
    }

    if (token.token_type === TokenType.COS) {
      const a = stack.pop();
      if (a !== undefined) {
        stack.push({ val: Math.cos(a.val) });
      }
    }

    if (token.token_type === TokenType.MUL) {
      const b = stack.pop();
      const a = stack.pop();

      // Narrowing
      if (a !== undefined && b !== undefined) {
        stack.push({ val: a.val * b.val });
      } else {
        throw new Error('Not enough values on the stack');
      }
    }

    if (token.token_type === TokenType.DIV) {
      const b = stack.pop();
      const a = stack.pop();

      // Narrowing
      if (a !== undefined && b !== undefined) {
        stack.push({ val: a.val / b.val });
      } else {
        throw new Error('Not enough values on the stack');
      }
    }

    if (token.token_type === TokenType.MINUS) {
      const b = stack.pop();
      const a = stack.pop();

      // Narrowing
      if (a !== undefined && b !== undefined) {
        stack.push({ val: a.val - b.val });
      } else {
        throw new Error('Not enough values on the stack');
      }
    }
  }

  return stack;
}

if (import.meta.main) {
  console.log('Unit Language');

  let s = parser('2 3 +');
  console.log(s);

  s = parser('10 5 *');
  console.log(s);

  s = parser('10 3 /');
  console.log(s);

  s = parser('7 3 -');
  console.log(s);
}
