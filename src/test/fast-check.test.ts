import { describe, it } from 'vitest';
import * as fc from 'fast-check';

describe('fast-checkのセットアップ', () => {
  it('プロパティベーステストが正しく動作する', () => {
    // 任意の数値に対して、その数値に0を足しても同じ値になる
    fc.assert(
      fc.property(fc.integer(), (n) => {
        return n + 0 === n;
      }),
      { numRuns: 100 }
    );
  });

  it('配列の長さは常に0以上である', () => {
    fc.assert(
      fc.property(fc.array(fc.integer()), (arr) => {
        return arr.length >= 0;
      }),
      { numRuns: 100 }
    );
  });
});
