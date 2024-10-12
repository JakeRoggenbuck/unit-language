import { assertEquals, assert } from '@std/assert';
import { ends_token, tokenize, Token, TokenType, next } from './main.ts';

Deno.test(function ends_token_test() {
  assert(ends_token(' '));
  assert(ends_token('\t'));
  assert(ends_token(')'));
  assert(ends_token('('));
});

Deno.test(function tokenize_test() {
  assertEquals(tokenize('+').token_type, TokenType.PLUS);
  assertEquals(tokenize('-').token_type, TokenType.MINUS);
  assertEquals(tokenize(' ').token_type, TokenType.NONE);

  assertEquals(tokenize('/').token_type, TokenType.DIV);
  assertEquals(tokenize('*').token_type, TokenType.MUL);

  assertEquals(tokenize('(').token_type, TokenType.LEFT_PAREN);
  assertEquals(tokenize(')').token_type, TokenType.RIGHT_PAREN);

  // TypeScript Note:
  // I was running the following
  // assertEquals(tokenize('S'), TokenType.NONE);
  // and comparing a Token to a TokenType and the LSP
  // did not catch it, but the deno runtime did.
  // That's better than JavaScript for catching errors but
  // I am not sure why it did not show up in the LSP
  // It's possible that it could not statically determine it without running it

  assertEquals(tokenize('S').token_type, TokenType.NONE);
  assertEquals(tokenize('test').token_type, TokenType.NONE);
  assertEquals(tokenize('jjjjjjj').token_type, TokenType.NONE);
  assertEquals(tokenize('(*$%(*&$(*').token_type, TokenType.NONE);

  assertEquals(tokenize('/').text, '/');
  assertEquals(tokenize('testtext').text, 'testtext');
});

Deno.test(function next_test() {
  let expr = '1 2 +';

  let t = next(expr, 0);
  assertEquals(t.token, { text: '1', token_type: TokenType.NUM_LITERAL });

  assertEquals(t.index, 2);

  let t2 = next(expr, 0);
  assertEquals(t2.token, { text: '1', token_type: TokenType.NUM_LITERAL });

  assertEquals(t2.index, 2);

  let t3 = next(expr, t2.index);
  assertEquals(t3.token, { text: '2', token_type: TokenType.NUM_LITERAL });

  assertEquals(t3.index, 4);

  let t4 = next(expr, t3.index);
  assertEquals(t4.token, { text: '+', token_type: TokenType.PLUS });
});


Deno.test(function next_test() {
  let expr = '2 3 /';

  let t = next(expr, 0);
  assertEquals(t.token, { text: '2', token_type: TokenType.NUM_LITERAL });
  assertEquals(t.index, 2);

  let t2 = next(expr, t.index);
  assertEquals(t2.token, { text: '3', token_type: TokenType.NUM_LITERAL });
  assertEquals(t2.index, 4);

  let t3 = next(expr, t2.index);
  assertEquals(t3.token, { text: '/', token_type: TokenType.DIV });
});
