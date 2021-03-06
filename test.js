const kctil = require("./index.js");
const assert = require("assert");

(async () => {
  try {
    assert.strictEqual(kctil.format("[s01] hello %s.", "world"), "[s01] hello world.", "should be: [s01] hello world.");
    assert.strictEqual(kctil.format("[s02] hello %10s.", "world"), "[s02] hello      world.", "should be: [s02] hello      world.");
    assert.strictEqual(kctil.format("[s03] hello %-10s.", "world"), "[s03] hello world     .", "should be: [s03] hello world     .");
    assert.strictEqual(kctil.format("[d01] number %5d.", 20), "[d01] number    20.", "should be: [d01] number    20.");
    assert.strictEqual(kctil.format("[d02] number %-5d.", 20), "[d02] number 20   .", "should be: [d02] number 20   .");
    assert.strictEqual(kctil.format("[d03] number %-05d.", 20), "[d03] number 20   .", "should be: [d03] number 20   .");
    assert.strictEqual(kctil.format("[d04] number %05d.", 20), "[d04] number 00020.", "should be: [d04] number 00020.");
    assert.strictEqual(kctil.format("[d05] number %10.5d.", 20), "[d05] number      00020.", "should be: [d05] number      00020.");
    assert.strictEqual(kctil.format("[d06] number %10.d.", 20), "[d06] number         20.", "should be: [d06] number         20.");
    assert.strictEqual(kctil.format("[d07] number %+5d.", 20), "[d07] number   +20.", "should be: [d07] number   +20.");
    assert.strictEqual(kctil.format("[d08] number %-5d.", -20), "[d08] number -20  .", "should be: [d08] number -20  .");
    assert.strictEqual(kctil.format("[d09] number %+05d.", 20), "[d09] number +0020.", "should be: [d09] number +0020.");
    assert.strictEqual(kctil.format("[f01] float %.5f.", 5.35), "[f01] float 5.35000.", "should be: [f01] float 5.35000.");
    assert.strictEqual(kctil.format("[f02] float %10.5f.", 5.35), "[f02] float    5.35000.", "should be: [f02] float    5.35000.");
    assert.strictEqual(kctil.format("[f03] float %-10.5f.", 5.35), "[f03] float 5.35000   .", "should be: [f03] float 5.35000   .");
    assert.strictEqual(kctil.format("[f04] float %-010.5f.", 5.35), "[f04] float 5.35000   .", "should be: [f04] float 5.35000   .");
    assert.strictEqual(kctil.format("[f05] float %010.5f.", 5.35), "[f05] float 0005.35000.", "should be: [f05] float 0005.35000.");

    console.log("\x1b[32m✓ Test kctil.format passed");

    assert.deepStrictEqual(
      kctil.zip(["a", "b"], [1, 2]),
      [
        ["a", 1],
        ["b", 2],
      ],
      'zip 1, should be: [["a", 1], ["b", 2]]'
    );

    assert.deepStrictEqual(
      kctil.zip(["a", "b", "c"], [1, 2]),
      [
        ["a", 1],
        ["b", 2],
        ["c", undefined],
      ],
      'zip 2, should be: [["a", 1], ["b", 2], ["c", undefined]]'
    );

    assert.deepStrictEqual(
      kctil.zip(["a", "b"], [1, 2, 3]),
      [
        ["a", 1],
        ["b", 2],
        [undefined, 3],
      ],
      'zip 3, should be: [["a", 1], ["b", 2], [undefined, 3]]'
    );
    assert.deepStrictEqual(kctil.zip([], []), [], "zip 4, should be: []");
    console.log("\x1b[32m✓ Test kctil.zip passed");

    assert.strictEqual(kctil.md5("hello"), "5d41402abc4b2a76b9719d911017c592", "md5(hello) = 5d41402abc4b2a76b9719d911017c592");
    assert.strictEqual(kctil.md5("12345"), "827ccb0eea8a706c4c34a16891f84e7b", "md5(12345) = 827ccb0eea8a706c4c34a16891f84e7b");

    console.log("\x1b[32m✓ Test kctil.md5 passed");

    assert.deepStrictEqual(kctil.flatHash({ a: 1, b: { d: 5, e: { f: 6 } }, c: 3 }), { a: 1, "b.d": 5, "b.e.f": 6, c: 3 });
    assert.deepStrictEqual(kctil.flatHash([{ a: 1, b: { d: 5, e: { f: 6 } }, c: 3 }, { x: 7, y: 8, z: { u: 9, v: 0 } }]), [{ a: 1, "b.d": 5, "b.e.f": 6, c: 3 }, { x: 7, y: 8, "z.u": 9, "z.v": 0 }]);
    assert.deepStrictEqual(kctil.flatHash({ data: [{ a: 1, b: { d: 5, e: { f: 6 } }, c: 3 }, { x: 7, y: 8, z: { u: 9, v: 0 } }], status: true }), { data: [{ a: 1, "b.d": 5, "b.e.f": 6, c: 3 }, { x: 7, y: 8, "z.u": 9, "z.v": 0 }], status: true });
    assert.deepStrictEqual(kctil.flatHash({ result: { data: [{ a: 1, b: { d: 5, e: { f: 6 } }, c: 3 }, { x: 7, y: 8, z: { u: 9, v: 0 } }], status: { code: 200, done: true }, message: "OK" }, success: "YES" }), { "result.data": [{ a: 1, "b.d": 5, "b.e.f": 6, c: 3 }, { x: 7, y: 8, "z.u": 9, "z.v": 0 }], "result.status.code": 200, "result.status.done": true, "result.message": "OK", "success": "YES" });

    console.log("\x1b[32m✓ Test kctil.flatHash passed");

    let array = ["a", "b", "c", "d", "e", "f", "g"];
    let limit = 4;
    let wrap = function (n, v) {
      return new Promise((re, rj) => {
        console.log(`${n}:${v} start`);
        setTimeout(() => {
          if ("d" === v || "f" === v) {
            rj(`er: ${n}@${v}`);
          } else {
            re(`ok: ${n}@${v}`);
          }
        }, 50);
      });
    };
    let calldone = function (n, res) {
      let r = `${n}:${res} done`;
      console.log(r);
      return r;
    };
    let callerror = function (n, err) {
      let r = `${n}:${err} error`;
      console.log(r);
    };
    let results = await kctil.PromiseAnyway(array, limit, wrap, calldone, callerror);
    console.log(results.map((r, n) => (r instanceof Error ? `${n}:${r.message} error` : r)));
    assert.deepStrictEqual(results, ["0:ok: 0@a done", "1:ok: 1@b done", "2:ok: 2@c done", new Error("er: 3@d"), "4:ok: 4@e done", new Error("er: 5@f"), "6:ok: 6@g done"], "results should be Array(7) with 3,5 Error");
    console.log(`\x1b[32m✓ all tests passed.`);
  } catch (e) {
    console.error(`\x1b[31m✗ test failed: ${e.message}`);
    process.exit(1);
  }
})();
