import { assertEquals, assert } from '@std/assert';
import { ends_token, tokenize, Token, TokenType } from './main.ts';

Deno.test(function ends_token_test() {
  assert(ends_token(' '));
  assert(ends_token('\t'));
  assert(ends_token(')'));
  assert(ends_token('('));
});
