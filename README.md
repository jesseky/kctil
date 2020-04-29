# kctil

This package encapsulates some commonly used functions

- PromiseAnyway
- existsFile, readFile, writeFile, appendFile
- dateTime
- log, logr, logw, loge
- zip
- format
- formatSize
- randRange
- sleep
- replace

### PromiseAnyway

```javascript
PromiseAnyway(array, limit, wrap, [calldone = undefined], [callerror = undefined]) {

}
// @array    : Plain js array, such as [1,2,3] or ['a','b','c'];
// @limit    : Limit the number of concurrency;
// @wrap     : function(n, val){ return new Promise(); } A function to return a promise
// The following are optional parameters
// @calldone : function(n, res, val){ }, n is the index of @array array, and res is wrap function resolved value.
//		Called when every single task is completed, and the returned value is put into the final results array,
//		if not provided, default return is wrap function resolved value.
// @callerror: function(n, err, val){ }, err is wrap function rejected value.
//		Called when every single task is rejected. the returned value is just ignored.

// Example: require('node-fetch')
let results = await kctil.PromiseAnyway(['a', 'b', 'c', 'd', 'e'], 3, (n, v)=> new Promise(async (r,j) => {
		try {
			let resp = await fetch(`http://test.com/${v}.html`);
			r(kctil.format('%05d: %-30s [%s]', n, v, resp.status + ' ' + resp.statusText));
		} catch (e) {
			j(kctil.format('%05d: %-30s [%s]', n, v, e.message));
		}
}), (n,res,val) => (console.log(res), res), (n, err) => console.log(err) );
// If any promise fails, the index value in the results array will be an Error object
// such as
/**
[
  '00000: a                              [462 ]',
  '00001: b                              [462 ]',
  '00002: c                              [462 ]',
  Error: 00003: d                    [network timeout at:,...]
  '00004: e                              [462 ]'
]
**/
```

### existsFile(filename)

```js
let stat = await kctil.existsFile("/tmp/test.txt");
// if file is not exists, the returned value is false, otherwise is file stat
```

### readFile, writeFile, appendFile

equals to util.promisify(fs.readFile), util.promisify(fs.writeFile), util.promisify(fs.appendFile)

### dateTime

dateTime(d) Formats date output in yyyy-mm-dd hh:mm:ss

```js
kctil.dateTime(new Date());
// 2020-04-01 18:28:31
```

### log, logr, logw, loge

output log with date time prefix, logr is log right, logw, is log warning, loge is log error. These functions output different colors

```js
kctil.log("This is a log");
// output in terminal [2020-04-01 18:29:22] This is a log
```

## zip(array1, array2)

Merge two arrays into one

```js
kctil.zip(["a", "b", "c"], [1, 2, 3]);

//[ [ 'a', 1 ], [ 'b', 2 ], [ 'c', 3 ] ]
```

### format(formatString, ...args)

kctil.format supports `%s` `%d` `%+d` `%f`, and width extends, such as `%10s` `%-10s` `%20d` `%-20d` `%015d` `%.3f`

```javascript
kctil.format("[%s] [%10s] [%-10s] [%s] [%10s] [%5d] [%05d] [%+d] [%s] [%.3f]", "An example of", "string", "int", "and", "float", 3, 1, 4, "PI", 3.14159);
// '[An example of] [    string] [int       ] [and] [     float] [    3] [00001] [+4] [PI] [3.142]'
```

### formatSize(bytes)

kctil.formatSize Format the file size into a readable form

```js
kctil.formatSize(122323);
// 119K
kctil.formatSize(6123713);
// 6M
```

### randRange(min, max)

kctil.randRange(min, max) return a random integer from min to max and includes min,max

### sleep(millisecond)

kctil.sleep is using in async function to sleep milliseconds

```js
await kctil.sleep(5 * 1e3); // sleep 5 seconds
// or
await kctil.sleep(5 * kctil.SECOND);

await kctil.sleep(2 * kctil.MINUTE); // sleep 2 mintues

await kctil.sleep(3 * kctil.HOUR); // sleep 3 hours
```

### replace(str, param)

kctil.replace function use to replace variables by param index

```js
kctil.replace("http://test.com/name={name}&pass={pass}", { "{name}": "hello", "{pass}": "world" });
// http://test.com/name=hello&pass=world
```

### md5(str)

kctil.md5 function to create md5 hash from string

```js
kctil.md5("hello); // return 5d41402abc4b2a76b9719d911017c592
```

#### License

MIT © [Jesse](https://github.com/jesseky)
