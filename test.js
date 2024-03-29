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

        assert.deepStrictEqual(kctil.range(1, 5), [1, 2, 3, 4, 5], 'range 1:5, should be [1, 2, 3, 4, 5]');
        assert.deepStrictEqual(kctil.range(6, 10), [6, 7, 8, 9, 10], 'range 6:10, should be [6, 7, 8, 9, 10]');
        assert.deepStrictEqual(kctil.range(1, 1), [1], 'range 1:1, should be [1]');
        assert.deepStrictEqual(kctil.range(1, 0), [], 'range 1:0, should be []');
        assert.deepStrictEqual(kctil.range(1, 0), [], 'range 0:1, should be [0,1]');
        assert.deepStrictEqual(kctil.range(-5, -1), [-5, -4, -3, -2, -1], 'range -5:-1, should be [-5, -4, -3, -2, -1]');
        assert.deepStrictEqual(kctil.range(-2, 2), [-2, -1, 0, 1, 2], 'range -2:2, should be [-2, -1, 0, 1, 2]');

        console.log("\x1b[32m✓ Test kctil.range passed");

        assert.strictEqual(kctil.replaceParam("{schema}://{host}{path}?{args}", { schema: 'https', host: 'httpbin.org', path: '/post', args: 'hello=world' }), 'https://httpbin.org/post?hello=world', 'replaceParam {schema}://{host}{path}?{args}, should be https://httpbin.org/post?hello=world');
        assert.strictEqual(kctil.replaceParam("{ schema }://{ host }{ path }?{ args }", { schema: 'https', host: 'httpbin.org', path: '/post', args: 'hello=world' }), 'https://httpbin.org/post?hello=world', 'replaceParam { schema }://{ host }{ path }?{ args }, should be https://httpbin.org/post?hello=world');
        assert.strictEqual(kctil.replaceParam("{schema}://{host}{path}?user={user}&pass={pass}", { schema: 'https', host: 'httpbin.org', path: '/post', pass: '123' }), 'https://httpbin.org/post?user=&pass=123', 'replaceParam {schema}://{host}{path}?user={user}&pass={pass}, should be https://httpbin.org/post?user=&pass=123');
        assert.strictEqual(kctil.replaceParam("city={country.province.city[0]}&country={country.name}", { country: { name: 'CN', province: { name: 'GD', city: ['GZ', 'SZ'] } } }), 'city=GZ&country=CN', 'replaceParam city={country.province.city[0]}&country={country.name}, should be city=GZ&country=CN');
        assert.strictEqual(kctil.replaceParam("city={country.province.city[9]}&country={country.name}", { country: { name: 'CN', province: { name: 'GD', city: ['GZ', 'SZ'] } } }), 'city=&country=CN', 'replaceParam city={country.province.city[9]}&country={country.name}, should be city=&country=CN');
        assert.strictEqual(kctil.replaceParam("type={[0].ext}&size={[0].size}&alias={[0].alias[0]}", [{ ext: 'jpg', size: 0, alias: ['jpeg'] }, { ext: 'png', size: 0 }]), 'type=jpg&size=0&alias=jpeg', 'replaceParam type={[0].ext}&size={[0].size}&alias={[0].alias[0]}, should be type=jpg&size=0&alias=jpeg');
        assert.strictEqual(kctil.replaceParam("type={[0][0]}&size={[0][1]}&alias={[0][2]}&type={[0][3].type}&isvideo={[0][3].isvideo}&from={[0][3].from}", [['jpg', 0, 'jpeg', { isvideo: false }], ['mpg', 1024, 'mpeg']]), 'type=jpg&size=0&alias=jpeg&type=&isvideo=false&from=', 'replaceParam type={[0].ext}&size={[0].size}&alias={[0].alias[0]}, should be type=jpg&size=0&alias=jpeg&type=&isvideo=false&from=');
        assert.strictEqual(kctil.replaceParam("count={stats[0].count}&title={stats[0].title.first[0].abbr}&summary={stats[0].title.first[1].summary}&amount={stats[0].amount}", { stats: [{ count: 5, title: { first: [{ abbr: 'userStat' }] }, amount: 0 }] }), 'count=5&title=userStat&summary=&amount=0', 'replaceParam count={stats[0].count}&name={stats[0].name}, should be count=5&title=userStat&summary=&amount=0');

        console.log("\x1b[32m✓ Test kctil.replaceParam passed");

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
        console.log(`\x1b[32m✓ Test kctil.PromiseAnyway passed.`);

        // batchSlice Test
        const batchArray = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j'];
        const batchTest1 = [];
        kctil.batchSlice(batchArray, 1, (slice, serial, from, to) => batchTest1.push([slice, serial]));
        assert.deepStrictEqual(batchTest1, [
            [['a'], 0],
            [['b'], 1],
            [['c'], 2],
            [['d'], 3],
            [['e'], 4],
            [['f'], 5],
            [['g'], 6],
            [['h'], 7],
            [['i'], 8],
            [['j'], 9]
        ], "batch 1 should generate 10 sub arrays");

        const batchTest3 = [];
        kctil.batchSlice(batchArray, 3, (slice, serial, from, to) => batchTest3.push([slice, serial]));
        assert.deepStrictEqual(batchTest3, [
            [['a', 'b', 'c'], 0],
            [['d', 'e', 'f'], 1],
            [['g', 'h', 'i'], 2],
            [['j'], 3]
        ], "batch 3 should generate 4 sub arrays");

        const batchTest5 = [];
        kctil.batchSlice(batchArray, 5, (slice, serial, from, to) => batchTest5.push([slice, serial]));
        assert.deepStrictEqual(batchTest5, [
            [['a', 'b', 'c', 'd', 'e'], 0],
            [['f', 'g', 'h', 'i', 'j'], 1]
        ], "batch 5 should generate 2 sub arrays");

        const batchTest10 = [];
        kctil.batchSlice(batchArray, 10, (slice, serial, from, to) => batchTest10.push([slice, serial]));
        assert.deepStrictEqual(batchTest10, [
            [['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j'], 0]
        ], "batch 10 should generate 1 sub array");

        const batchTest20 = [];
        kctil.batchSlice(batchArray, 20, (slice, serial, from, to) => batchTest20.push([slice, serial]));
        assert.deepStrictEqual(batchTest20, [
            [['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j'], 0]
        ], "batch 20 should generate 1 sub array");

        console.log("\x1b[32m✓ Test kctil.batchSlice passed");
        // batchSlice Test done

        // Queue Test
        // parallel 1
        const qres1 = [];
        const queue1 = new kctil.Queue(1, ({ data }) => {
            return new Promise((resolve, reject) => {
                setTimeout(() => {
                    qres1.push(`Job data: ${data}`);
                    resolve(data);
                }, 50);
            });
        });
        for (let i = 0; i < 10; i++) {
            queue1.push(`job-${i}`, { data: `data ${i}` });
        }
        // 10 jobs, and one takes 50ms, all will take 550 ms
        await new Promise((resolve, reject) => setTimeout(() => resolve(), 550 + 10));
        assert.deepStrictEqual(qres1, [
            'Job data: data 0',
            'Job data: data 1',
            'Job data: data 2',
            'Job data: data 3',
            'Job data: data 4',
            'Job data: data 5',
            'Job data: data 6',
            'Job data: data 7',
            'Job data: data 8',
            'Job data: data 9'
        ], "Queue parallel 1 should be Array(10) from data 0 to data 9");

        // parallel 3
        const qres3 = [];
        const queue3 = new kctil.Queue(3, ({ data }) => {
            return new Promise((resolve, reject) => {
                setTimeout(() => {
                    qres3.push(`Job data: ${data}`);
                    resolve(data);
                }, 50);
            });
        });
        for (let i = 0; i < 9; i++) {
            queue3.push(`job-${i}`, { data: `data ${i}` });
        }
        // 9 jobs, parallel in 3, one takes 50ms, so all jobs will take 150 ms
        await new Promise((resolve, reject) => setTimeout(() => resolve(), 150 + 10));
        assert.deepStrictEqual(qres3, [
            'Job data: data 0',
            'Job data: data 1',
            'Job data: data 2',
            'Job data: data 3',
            'Job data: data 4',
            'Job data: data 5',
            'Job data: data 6',
            'Job data: data 7',
            'Job data: data 8',
        ], "Queue parallel 3 should be Array(9) from data 0 to data 8");


        // parallel 10
        const qres10 = [];
        const queue10 = new kctil.Queue(10, ({ data }) => {
            return new Promise((resolve, reject) => {
                setTimeout(() => {
                    qres10.push(`Job data: ${data}`);
                    resolve(data);
                }, 50);
            });
        });
        for (let i = 0; i < 10; i++) {
            queue10.push(`job-${i}`, { data: `data ${i}` });
        }

        // 10 jobs will finish in 50ms
        await new Promise((resolve, reject) => setTimeout(() => resolve(), 50 + 10));
        assert.deepStrictEqual(qres10, [
            'Job data: data 0',
            'Job data: data 1',
            'Job data: data 2',
            'Job data: data 3',
            'Job data: data 4',
            'Job data: data 5',
            'Job data: data 6',
            'Job data: data 7',
            'Job data: data 8',
            'Job data: data 9',
        ], "Queue parallel 3 should be Array(10) from data 0 to data 9");

        // Queue Test done
    } catch (e) {
        console.error(`\x1b[31m✗ test failed: ${e.message}`);
        process.exit(1);
    }

    console.log(`\x1b[32m✓ all tests passed.`);
})();
