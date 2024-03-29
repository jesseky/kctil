const fs = require("fs");
const crypto = require("crypto");

const SECOND = 1e3;
const MINUTE = 60 * SECOND;
const HOUR = 60 * MINUTE;

function PromiseAnyway(array, limit, wrap, calldone, callerror) {
    let arr = array.map((v, i) => [i, v]);
    return new Promise((resolve, reject) => {
        let total = array.length;
        let result = new Array(total);
        let dones = 0;
        function run(va) {
            wrap(va[0], va[1])
                .then((res) => {
                    return typeof calldone === "function" ? calldone(va[0], res, va[1]) : Promise.resolve(res);
                })
                .then((res) => {
                    dones++;
                    result[va[0]] = res;
                    if (arr.length) {
                        run(arr.shift());
                    } else if (dones === total) {
                        resolve(result);
                    }
                })
                .catch((err) => {
                    let nerr = err instanceof Error ? err : new Error(err);
                    if (typeof callerror === "function") {
                        callerror(va[0], nerr, va[1]);
                    }
                    dones++;
                    result[va[0]] = nerr;
                    if (arr.length) {
                        run(arr.shift());
                    } else if (dones === total) {
                        resolve(result);
                    }
                });
        }
        array.slice(0, limit).forEach((v) => {
            run(arr.shift());
        });
    });
}

function existsFile(f) {
    return new Promise((r) => fs.stat(f, (e, s) => r(e ? false : s)));
}
function readFile(path) {
    return new Promise((r, j) => fs.readFile(path, (err, dat) => (err ? j(err) : r(dat))));
}
function writeFile(path, data) {
    return new Promise((r, j) => fs.writeFile(path, data, (err) => (err ? j(err) : r(true))));
}
function appendFile(path, data) {
    return new Promise((r, j) => fs.appendFile(path, data, (err) => (err ? j(err) : r(true))));
}

function dateTime(d = null) {
    if (!d) d = new Date();
    let ds = [d.getFullYear(), d.getMonth() + 1, d.getDate(), d.getHours(), d.getMinutes(), d.getSeconds()].map((v) => (v.toString().length < 2 ? "0" + v : v));
    return ds.slice(0, 3).join("-") + " " + ds.slice(3, 6).join(":");
}
// log
function log(...args) {
    console.log(...["[" + dateTime(new Date()) + "] " + (typeof args[0] === "string" ? args[0] : JSON.stringify(args[0])), ...args.slice(1)]);
}
// log error
function loge(...args) {
    console.error(...["\x1b[31m✗ [" + dateTime(new Date()) + "] " + (typeof args[0] === "string" ? args[0] : JSON.stringify(args[0])), ...args.slice(1)]);
}
// log right
function logr(...args) {
    console.log(...["\x1b[32m✓ [" + dateTime(new Date()) + "] " + (typeof args[0] === "string" ? args[0] : JSON.stringify(args[0])), ...args.slice(1)]);
}
// log warn
function logw(...args) {
    console.log(...["\x1b[33m⚡[" + dateTime(new Date()) + "] " + (typeof args[0] === "string" ? args[0] : JSON.stringify(args[0])), ...args.slice(1)]);
}
function zip(a, b) {
    return Array.from({ length: Math.max(a.length, b.length) }, (v, i) => [a[i], b[i]]);
}

function format(f, ...args) {
    return f.replace(/\%[-+]?([\d\.]*)([s|f|d])/g, function (ifm, num, type, ...ag) {
        let arg = args.length ? args.shift() : "s" === type ? "" : 0;
        let [pre, sign, dec] = ["", "", 0];
        if (typeof arg !== "number" && ("f" === type || "d" === type)) {
            arg = "f" === type ? parseFloat(arg) : parseInt(arg);
        }
        if (typeof arg === "number") {
            if ("%+" === ifm.substr(0, 2)) {
                ifm = ifm.replace(/^\%\+/, "%"); // 含有正号
                if (arg > 0) {
                    sign = "+";
                }
            }
            if ("f" === type && num) {
                let na = num.split(".");
                arg = arg.toFixed(parseInt(na[na.length === 2 ? 1 : 0]));
            } else if ("d" === type && num && num.includes(".")) {
                let na = num.split("."); // 含有 . 号， 前面为正常pad，后面控制整数位数
                let pn = na[1] ? parseInt(na[1]) : NaN;
                [num, arg] = [na[0], !isNaN(pn) ? arg.toString().padStart(pn, "0") : arg.toString()];
            } else {
                arg = arg.toString();
            }
        }
        let pad = /^\%0\d+/.test(ifm) ? "0" : " ";
        if (sign) {
            if ("0" === pad) [pre, dec] = ["+", 1];
            else arg = sign + arg;
        }
        return pre + arg["%-" === ifm.substr(0, 2) ? "padEnd" : "padStart"](num ? parseFloat(num) - dec : 0, pad);
    });
}

function formatSize(size) {
    if (size === 0) return "0 B";
    else if (!/^\+?[1-9][0-9]*$/.test(size)) return size;
    let sizename = ["B", "K", "M", "G", "T", "P", "E", "Z", "Y"];
    let i = Math.floor(Math.log(size) / Math.log(1024));
    return Math.round(size / Math.pow(1024, i), "K" === sizename[i] ? 0 : 1) + sizename[i];
}

function randRange(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min); // min and max included
}

function sleep(tm) {
    return new Promise((rs) => setTimeout(rs, tm));
}

function replace(str, param) {
    // str: http://test.com/name={name}&pass={pass}  param: {'{name}': 'test', '{pass}': 'pass'}
    for (let k in param) {
        str = str.replace(new RegExp(k, "g"), param[k]);
    }
    return str;
}

function escape(str) {
    return str
        .split("&")
        .map((v) =>
            v
                .split("=")
                .map((k) => encodeURIComponent(k))
                .join("=")
        )
        .join("&");
}

function md5(s) {
    return crypto.createHash("md5").update(s, "utf-8").digest("hex");
}

function flatHash(o, pre = '') { // 将嵌套的对象转换成一级索引对象 {a: {b: 1, c: 2}, d: 3}  => {a.b: 1, a.c: 2, d: 3}
    let r = {};
    if (Object.prototype.toString.call(o) === '[object Object]') {
        for (let k in o) {
            let v = o[k];
            if (Object.prototype.toString.call(v) === '[object Object]') {
                r = Object.assign(r, flatHash(v, pre + k + '.'));
            } else if (Object.prototype.toString.call(v) === '[object Array]') {  // 如果转换数组
                r[pre + k] = v.map(ov => flatHash(ov));
            } else {
                r[pre + k] = v;
            }
        }
    } else if (Object.prototype.toString.call(o) === '[object Array]') {
        return o.map(ov => flatHash(ov, pre));
    }
    return r;
}

// 返回 [start..end]数组
function range(start, end) {
    return Array.from({ length: end - start + 1 }, (_, i) => i + start);
}

// 参数替换 
function replaceParam(str, param) { // str: http://test.com/name={name}&pass={pass}&ipcity={ip.city}  param: {'name': 'test', 'pass': '123', ip: {country: 'CN', city: 'SH' } }
    return str.replace(/\{\s*([\w\d\[\]\._\-]+)\s*\}/g, (m, p1) => {
        if (/[\.\[\]]+/.test(p1)) {
            return p1.replace(/^\[/, '').replace(/\[/g, '.').replace(/\]/g, '').split('.').reduce((res, pv) => {
                return typeof (res) === 'string' ? res : (typeof (res[pv]) !== 'undefined' ? res[pv] : '');
            }, param);
        }
        return typeof (param[p1]) !== 'undefined' ? param[p1] : '';
    });
}

// batchSlice 分批次获取数组元素，并执行回调函数
function batchSlice(array, batch, callback, callafter = null) {
    let [from, serial, total, quantity] = [0, 0, array.length, Number.isInteger(batch) && batch > 0 ? batch : 1];
    do {
        const to = Math.min(from + quantity, total);
        const slice = array.slice(from, to);
        callback(slice, serial, from, to);
        from += quantity;
        serial++;
    } while (from < total && total > 0);
    if (callafter && typeof callafter === 'function') {
        callafter(serial);
    }
}

// Queue 队列任务，先入先出顺序完成任务，同时控制并发量
class Queue {
    constructor(parallel, wrapFn) {

        this.wrapFn = wrapFn; // wrapFn 是一个包装函数,用于执行异步任务
        this.parallel = Math.max(1, parallel); // parallel 是最大并行执行数量

        this.queue_jobs = []; // queue_jobs 是待执行任务队列
        this.queue_runs = {}; // queue_runs 是正在执行的任务队列
    }

    push(key, args) {  // 将新的任务推入待执行队列
        this.queue_jobs.push({ key: key, args: args, time: Date.now() });
        this.start(); // 启动执行
    }

    count() { // 返回当前待执行和正在执行的任务数量
        return { _qlen: this.queue_jobs.length, _qrun: Object.keys(this.queue_runs).length };
    }

    async start() {
        // 如果待执行队列不为空,且正在执行的任务数量小于最大并行数
        if (this.queue_jobs.length && Object.keys(this.queue_runs).length < this.parallel) {
            const item = this.queue_jobs.shift();   // 从待执行队列中取出一个任务
            if (!this.queue_runs[item.key]) {       // 如果该任务不在正在执行队列中
                this.queue_runs[item.key] = item;   // 将该任务加入正在执行队列
                const num = this.count();
                try {
                    // 执行包装函数,传入当前任务数量和任务参数
                    await this.wrapFn(Object.assign({}, num, item.args));
                } catch (e) { // 捕获异常
                    console.log("error job", item, e);
                }
                delete this.queue_runs[item.key];   // 从正在执行队列中移除该任务
                this.start();                       // 继续执行下一个任务
            }
        }
    }
}

module.exports = {
    PromiseAnyway,
    Queue,
    batchSlice,
    existsFile,
    readFile,
    writeFile,
    appendFile,
    dateTime,
    log,
    loge,
    logr,
    logw,
    zip,
    format,
    formatSize,
    randRange,
    sleep,
    replace,
    escape,
    md5,
    flatHash,
    range,
    replaceParam,
    SECOND,
    MINUTE,
    HOUR,
};
