# @tilfin/cache

Key-Value based cache map for sync or async

## Features

- Passive TTL(Time-To-Live) expiring
- Hook when cached item is deleted

## Install

```
$ npm install @tilfin/cache
```

## How to use

### Cache

```js
const { Cache } = require('@tilfin/cache')

const cache = new Cache({
  defaultTtl: 60 // Delete cached item if getting it after 60 seconds passed
})

export.get = (item) => {
  cache.set(item.id, item)
}

export.get = (id) => {
  return cache.get(id)
}
```

### CacheAsync

```js
const { CacheAsync } = require('@tilfin/cache')

const cache = new CacheAsync({
  onDelete: async (item) => {
    await item.dispose()
  }
})

export.set = async (item) => {
  await cache.set(item.id, item, 30)
}

export.get = async (id) => {
  return await cache.get(id)
}
```
