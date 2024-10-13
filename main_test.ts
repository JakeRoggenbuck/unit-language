import { assertEquals, assert } from '@std/assert';
import { ends_token, tokenize, TokenType, next, parser } from './main.ts';

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
  const expr = '1 2 +';

  const t = next(expr, 0);
  assertEquals(t.token, { text: '1', token_type: TokenType.NUM_LITERAL });

  assertEquals(t.index, 2);

  const t2 = next(expr, 0);
  assertEquals(t2.token, { text: '1', token_type: TokenType.NUM_LITERAL });

  assertEquals(t2.index, 2);

  const t3 = next(expr, t2.index);
  assertEquals(t3.token, { text: '2', token_type: TokenType.NUM_LITERAL });

  assertEquals(t3.index, 4);

  const t4 = next(expr, t3.index);
  assertEquals(t4.token, { text: '+', token_type: TokenType.PLUS });
});

Deno.test(function next_test() {
  const expr = '2 3 /';

  const t = next(expr, 0);
  assertEquals(t.token, { text: '2', token_type: TokenType.NUM_LITERAL });
  assertEquals(t.index, 2);

  const t2 = next(expr, t.index);
  assertEquals(t2.token, { text: '3', token_type: TokenType.NUM_LITERAL });
  assertEquals(t2.index, 4);

  const t3 = next(expr, t2.index);
  assertEquals(t3.token, { text: '/', token_type: TokenType.DIV });
});

Deno.test(function consts_test() {
  const expr = 'pi 1 +';
  const t = next(expr, 0);
  assertEquals(t.token, { text: 'pi', token_type: TokenType.PI });
});

Deno.test(function parser_test() {
  let s = parser('2 3 +');
  assertEquals(s, [{ val: 5 }]);

  s = parser('10 5 *');
  assertEquals(s, [{ val: 50 }]);

  s = parser('10 3 /');
  assertEquals(s, [{ val: 10 / 3 }]);

  s = parser('7 3 -');
  assertEquals(s, [{ val: 4 }]);
});

Deno.test(function parser_consts_test() {
  let s = parser('pi 1 +');
  assertEquals(s, [{ val: Math.PI + 1 }]);

  s = parser('pi e *');
  assertEquals(s, [{ val: Math.PI * Math.E }]);

  s = parser('2');
  assertEquals(s, [{ val: 2}]);

  s = parser('2 sin');
  assertEquals(s, [{ val: Math.sin(2)}]);

  s = parser('e sin');
  assertEquals(s, [{ val: Math.sin(Math.E)}]);

  s = parser('e tan');
  assertEquals(s, [{ val: Math.tan(Math.E)}]);
});
