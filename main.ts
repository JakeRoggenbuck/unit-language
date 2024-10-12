export function ends_token(c: string): boolean {
  if (c == '(' || c == ')') {
    return true;
  }

  if (c == ' ' || c == '\t' || c == '\n') {
    return true;
  }

  if (c == '+' || c == '-' || c == '/' || c == '*') {
    return true;
  }

  return false;
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
  }

  return { text: token_text, token_type: token_type };
}

if (import.meta.main) {
}
