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
- md5
- flatHash
- range
- replaceParam
- batchSlice
- Queue

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

// Example: npm i kctil node-fetch -g
const kctil = require('kctil');
const fetch = require('node-fetch');
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

// so we can easy create a plain object using first array as keys, and second array as values
Object.fromEntries(kctil.zip(["a", "b", "c"], [1, 2, 3]));
// { a: 1, b: 2, c: 3 }

// or create a Map
new Map(kctil.zip(["a", "b", "c"], [1, 2, 3]));
// Map(3) { 'a' => 1, 'b' => 2, 'c' => 3 }
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
kctil.md5("hello"); // return 5d41402abc4b2a76b9719d911017c592
```

### flatHash(json)

kctil.flatHash works like flat package, it creates a new key:value/array with one level deep, it won't flat array, but will flat array's object elements.
```js
kctil.flatHash({ a: 1, b: { d: 5, e: { f: 6 } }, c: 3 });
// output:
{ a: 1, 'b.d': 5, 'b.e.f': 6, c: 3 }

kctil.flatHash({ result: { data: [{ a: 1, b: { d: 5, e: { f: 6 } }, c: 3 }, { x: 7, y: 8, z: { u: 9, v: 0 } }], status: true }, success: "YES" });
// output: 
{
  'result.data': [
    { a: 1, 'b.d': 5, 'b.e.f': 6, c: 3 },
    { x: 7, y: 8, 'z.u': 9, 'z.v': 0 }
  ],
  'result.status': true,
  success: 'YES'
}
```

### range(start, end)

kctil.range to generate a range within the supplied bounds
```js
kctil.range(1,5)
// output: 
[1, 2, 3, 4, 5]


kctil.range(-2,2)
// output: 
[-2, -1, 0, 1, 2]
```

### replaceParam(str, param)
kctil.replaceParam to replace all variables in the template which starts with `{` and ends with `}`
```js
kctil.replaceParam("count={stats[0].count}&title={stats[0].title.first[0].abbr}&summary={stats[0].title.first[1].summary}&amount={stats[0].amount}", { stats: [{ count: 5, title: { first: [{ abbr: 'userStat' }] }, amount: 0 }] })
// output: 
count=5&title=userStat&summary=&amount=0
```

### batchSlice(array, batch, callback, callafter = null)

kctil.batchSlice is to split an array into a fixed number of batches and pass them to the callback function
```js
kctil.batchSlice(['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j'], 3, (slice, serial, from, to) => {
  console.log('slice:', slice, 'serial:', serial, 'from:', from, 'to:', to);
});
// output:
'slice:' [ 'a', 'b', 'c' ] 'serial:' 0 'from:' 0 'to:' 3
'slice:' [ 'd', 'e', 'f' ] 'serial:' 1 'from:' 3 'to:' 6
'slice:' [ 'g', 'h', 'i' ] 'serial:' 2 'from:' 6 'to:' 9
'slice:' [ 'j' ] 'serial:' 3 'from:' 9 'to:' 10
```

### Queue, async job queue with concurrency control
kctil.Queue implements a simple job queue system. It allows you to enqueue tasks (jobs) and execute them in parallel, with a configurable level of concurrency. Here's a brief introduction and usage guide:

#### Introduction

The Queue class is designed to help manage and execute asynchronous tasks in a controlled manner. It ensures that a specified number of tasks can run concurrently, while the remaining tasks are queued and executed as resources become available. This can be useful in scenarios where you need to limit the number of concurrent operations, such as making API requests or performing resource-intensive tasks.

#### Usage

To use the Queue class, you need to create an instance and provide two arguments:

`parallel` (number): The maximum number of tasks that can run concurrently.
`wrapFn` (function): A function that will be executed for each task. This function should be an asynchronous function (returning a `Promise`) and will receive an object containing the task arguments and some metadata.
Here's an example of how to create a Queue instance:
```js
const queue = new Queue(5, async ({ key, args }) => {
  // Perform some asynchronous task here
  console.log(`Processing task ${key} with args:`, args);
  await new Promise(resolve => setTimeout(resolve, 1000)); // Simulating an async operation
});
```
In this example, we create a Queue instance that allows up to 5 tasks to run concurrently. The wrapFn function simply logs the task key and arguments, and simulates an asynchronous operation using setTimeout.

To enqueue a task, you can use the push method:
```js
queue.push('task1', { data: 'some data' });
queue.push('task2', { data: 'another data' });
// You can enqueue as many tasks as needed
```
The push method takes two arguments: a unique key for the task and an args object containing any necessary data or arguments for the task.

You can check the current state of the queue using the count method:

```js
const { _qlen, _qrun } = queue.count();
console.log(`Queue length: ${_qlen}, Running tasks: ${_qrun}`);
```
The count method returns an object with two properties: _qlen (the number of tasks in the queue) and _qrun (the number of tasks currently running).

The Queue class internally manages the execution of tasks, ensuring that the specified concurrency limit is respected. Tasks are dequeued and executed as resources become available.

Note that the provided code is a basic implementation, and you might want to enhance it with additional features, such as error handling, task prioritization, or cancellation mechanisms, depending on your specific requirements.

### Different usage of these three methods
`PromiseAnyway`: You have a certain batch of asynchronous tasks that need to be completed with controlled concurrency and collect the completed results.

`Queue`(Class): You need to control the number of concurrent asynchronous tasks. The total number of tasks is unpredictable, and new tasks will be added at any time during it's running.

`batchSlice`: You have a batch of tasks that need to be completed simultaneously, but not one by one, but a fixed number of tasks at once.

#### License

MIT © [Jesse](https://github.com/jesseky)
