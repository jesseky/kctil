# kctil

This package contains commonly used batch asynchronous task processing functions to control the number of concurrencies.

- PromiseAnyway
- Queue
- batchSlice

### PromiseAnyway

```javascript
/**
 * PromiseAnyway - A utility function to execute an array of asynchronous tasks with a concurrency limit
 *
 * @param {Array} array - An array of values to be processed asynchronously
 * @param {number} limit - The maximum number of concurrent tasks
 * @param {Function} wrap - A function that takes a value from the array and returns a Promise
 * @param {Function} [calldone] - An optional callback function to be called when a task is successfully completed
 * @param {Function} [callerror] - An optional callback function to be called when a task fails
 * @returns {Promise<Array>} - A Promise that resolves with an array of results or errors
 *
 * Usage:
 *
 * const urls = ['https://example.com', 'https://google.com', 'https://invalid-url'];
 *
 * PromiseAnyway(urls, 2, (index, url) => fetch(url), (index, response, url) => {
 *   console.log(`Fetched ${url} at index ${index} with status ${response.status}`);
 *   return response.text();
 * }, (index, error, url) => {
 *   console.error(`Failed to fetch ${url} at index ${index} with error ${error.message}`);
 * })
 * .then(results => {
 *   console.log('All tasks completed', results);
 * });
 */
function PromiseAnyway(array, limit, wrap, calldone, callerror) {
  // ... function implementation ...
}
```

#### Description:

The PromiseAnyway function is a utility that allows executing an array of asynchronous tasks with a concurrency limit. It takes an array of values, a concurrency limit, a wrapper function that returns a Promise for each value, and optional callback functions for successful and failed tasks.

The function returns a Promise that resolves with an array of results or errors, corresponding to the order of the input array. The calldone callback is called for each successful task, and the callerror callback is called for each failed task.

#### Usage:

Pass an array of values to be processed asynchronously as the first argument.
Specify the maximum number of concurrent tasks as the second argument.
Provide a wrapper function as the third argument, which takes a value from the array and returns a Promise.
Optionally, provide a calldone callback function as the fourth argument, which will be called when a task is successfully completed. The callback receives the index of the value, the resolved value, and the original value.
Optionally, provide a callerror callback function as the fifth argument, which will be called when a task fails. The callback receives the index of the value, the error, and the original value.
The returned Promise resolves with an array containing the results or errors for each value in the original array order.

#### Example:

In the provided example, the PromiseAnyway function is used to fetch a list of URLs concurrently with a limit of 2 concurrent requests. The calldone callback logs the successful fetch response, and the callerror callback logs the error for failed requests. The final results (either the response text or the error) are collected in the resolved Promise.
```js
const kctil = require('kctil');
(async () => {
    
    const urls = ['https://example.com', 'https://google.com', 'https://invalid-url'];
    kctil.PromiseAnyway(urls, 2, (index, url) => fetch(url), (index, response, url) => {
        console.log(`Fetched ${url} at index ${index} with status ${response.status}`);
        return response.text();
    }, (index, error, url) => {
        console.error(`Failed to fetch ${url} at index ${index} with error ${error.message}`);
    }).then(results => {
        console.log('All tasks completed', results);
    });

})();
```

This is another example
```js
// Example: npm i kctil node-fetch@2 -g
const kctil = require('kctil');
const fetch = require('node-fetch'); // not need since node.js version 18+
(async () => {
    let results = await kctil.PromiseAnyway(['a', 'b', 'c', 'd', 'e'], 3, async (n, v) => {
        if ('d' == v) {
            throw new Error(`Simulation error ${v}`);
        }
        const resp = await fetch(`https://httpbin.org/get?v=${v}`, { timeout: 5 * 1e3 });
        return kctil.format('%05d: %-30s [%s]', n, v, resp.status + ' ' + resp.statusText);
    }, (n, res, val) => (console.log(res), res), (n, err) => console.log('error index:', n, err.message));

    //console.log(results);
})()
// If any promise fails, the index value in the results array will be an Error object
// such as
/**
[
  '00000: a                              [200 OK]',
  '00001: b                              [200 OK]',
  '00002: c                              [200 OK]',
  Error: Simulation error d              .........,
  '00004: e                              [200 OK]'
]
**/
```

### Queue, async job queue with concurrency control
kctil.Queue implements a simple job queue system. It allows you to enqueue tasks (jobs) and execute them in parallel, with a configurable level of concurrency. Here's a brief introduction and usage guide:

#### Introduction

The Queue class is designed to help manage and execute asynchronous tasks in a controlled manner. It ensures that a specified number of tasks can run concurrently, while the remaining tasks are queued and executed as resources become available. This can be useful in scenarios where you need to limit the number of concurrent operations, such as making API requests or performing resource-intensive tasks.

#### Usage

To use the Queue class, you need to create an instance and provide two arguments:

1.`parallel` (number): The maximum number of tasks that can run concurrently.
2.`wrapFn` (function): A function that will be executed for each task. This function should be an asynchronous function (returning a `Promise`) and will receive an object containing the task arguments and some metadata.
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

### batchSlice(array, batch, callback, callafter = null)
```js
/**
 * batchSlice - A utility function to split an array into batches and process each batch with a callback function
 *
 * @param {Array} array - The input array to be processed
 * @param {number} batch - The desired batch size (number of elements per batch)
 * @param {Function} callback - The function to be called for each batch, receiving the batch array, batch index, start index, and end index
 * @param {Function} [callafter] - An optional function to be called after all batches have been processed, receiving the total number of batches
 *
 * Usage:
 *
 * const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
 *
 * batchSlice(numbers, 3, (batch, batchIndex, startIndex, endIndex) => {
 *   console.log(`Batch ${batchIndex}: [${startIndex}, ${endIndex}] = ${batch}`);
 * }, totalBatches => {
 *   console.log(`Total batches processed: ${totalBatches}`);
 * });
 *
 * Output:
 * Batch 0: [0, 3] = 1,2,3
 * Batch 1: [3, 6] = 4,5,6
 * Batch 2: [6, 9] = 7,8,9
 * Batch 3: [9, 10] = 10
 * Total batches processed: 4
 */
function batchSlice(array, batch, callback, callafter = null) {
  // ... function implementation ...
}
```

Example

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

### Different usage of these three methods
`PromiseAnyway`: You have a certain batch of asynchronous tasks that need to be completed with controlled concurrency and collect the completed results.

`Queue`(Class): You need to control the number of concurrent asynchronous tasks. The total number of tasks is unpredictable, and new tasks will be added at any time during it's running.

`batchSlice`: You have a batch of tasks that need to be completed simultaneously, but not one by one, but a fixed number of tasks at once.

### The following are commonly used functions

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

#### License

MIT © [Jesse](https://github.com/jesseky)
