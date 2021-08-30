# Mighty Promise

> Powerful promise utils collections

[![codecov](https://codecov.io/gh/mighty-pattern/mighty-promise/branch/master/graph/badge.svg?token=I0Egowh0xD)](https://codecov.io/gh/mighty-pattern/mighty-promise)


# Usage

Install 

```bash
yarn add mighty-promise
# or
npm i mighty-promise
```

Use

```ts
import {Progressive} from 'mighty-promise'
import {Progressive} from 'https://deno.land/x/mighty_promise@v0.0.6/mod.ts'
```

# API

#### **`Progressive.map(arr, callback, option)`**

`map` can split a large task on `arr` to several small tasks. It can be used to prevent heavy calculation from blocking the thread.

`option` definition

```ts
interface ProgressiveOptions {
  // in ms
  minInterval?: number;
  // in ms
  maxExecutionDuration?: number;
  useIdleCallback?: boolean;
}
```

##### Example

```ts
import {map} from 'mighty-promise'

async function tasks(taskInfo: string[]) {
  map(tasks, task => {
    runTask(task);
  }, {maxExecutionDuration: 10})
}
```


#### **`Progressive.forEach(arr, callback, option)`**

It is the same as `map`, but the output is ignored.