const fs = require("fs");

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

function dateTime(d) {
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

module.exports = {
  PromiseAnyway,
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
  SECOND,
  MINUTE,
  HOUR,
};
