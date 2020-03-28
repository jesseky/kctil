### kctil
This package encapsulates some commonly used functions

### PromiseAnyway
```
PromiseAnyway(arr, limit, wrap, [calldone = undefined], [callerror = undefined]) {

}
// @arr      : Plain js array, such as [1,2,3] or ['a','b','c'];
// @limit    : Limit the number of concurrency;
// @wrap     : function(n, val){ return new Promise(); } A function to return a promise
// @calldone : function(n, res){ }, n is the index of @arr array, and res is wrap function resolved value. Called when every single task is completed, and the returned value is put into the final results array, if not provided, default return is wrap function resolved value.
// @callerror: function(n, err){ }, err is wrap function rejected value. Called when every single task is rejected. the returned value is just ignored.

// Example: require('node-fetch')
await kctil.PromiseAnyway(['a', 'b', 'c', 'd', 'e'], 3, (n, v)=> new Promise(async (r,j) => { 
		try {
			let resp = await fetch(`http://test.com/${v}.html`));
			r(kctil.format('%05d: %-30s [%s]', n, v, resp.status + ' ' + resp.statusText));
		} catch (e) {
			j(kctil.format('%05d: %-30s [%s]', n, v, e.message));
		}
}), (n,res) => console.log(res), (n, err) => console.log(err) );

```

#### License
MIT © [Jesse](https://github.com/jesseky)