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
  NONE,
}

export type Token = {
  text: string;
  token_type: TokenType;
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

if (import.meta.main) {
}
