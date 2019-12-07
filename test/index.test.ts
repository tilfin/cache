import util from 'util'
import { Cache, CacheAsync } from '../src'
import { expect } from 'chai'

const delay = util.promisify(setTimeout)

class Item {}

describe('Cache', () => {
  describe('set|get|delete', () => {
    it('handles rightly', () => {
      const cache = new Cache<Item>()

      const item = new Item()
      cache.set('itemKey', item)

      expect(cache.get('itemKey')).to.eq(item)

      expect(cache.delete('itemKey')).to.true
      expect(cache.delete('dummy')).to.false

      expect(cache.get('itemKey')).to.be.undefined
    })
  })

  describe('TTL', () => {
    it('handles rightly', async () => {
      const cache = new Cache<Item>({ defaultTtl: 200 })
      const itemDefaultTtl = new Item()
      const itemExpire100ms = new Item()
      const itemExpire300ms = new Item()
      const itemNotExpire = new Item()
      cache.set('default', itemDefaultTtl)
      cache.set('expire100ms', itemExpire100ms, 100)
      cache.set('expire300ms', itemExpire300ms, 300)
      cache.set('notExpire', itemNotExpire, 0)

      await delay(120)
      expect(cache.get('expire100ms')).to.be.undefined
      expect(cache.get('default')).to.eq(itemDefaultTtl)
      expect(cache.get('expire300ms')).to.eq(itemExpire300ms)
      expect(cache.get('notExpire')).to.eq(itemNotExpire)

      await delay(130) // 250
      expect(cache.get('default')).to.be.undefined
      expect(cache.get('expire300ms')).to.eq(itemExpire300ms)
      expect(cache.get('notExpire')).to.eq(itemNotExpire)

      await delay(70) // 320
      expect(cache.get('expire300ms')).to.be.undefined
      expect(cache.get('notExpire')).to.eq(itemNotExpire)
    })
  })

  describe('onDelete', () => {
    it('calls on deleted', () => {
      let deletedItem: Item | null = null

      const cache = new Cache<Item>({
        onDelete: (item) => {
          deletedItem = item
        }
      })

      const item = new Item()
      cache.set('itemKey', item)
      expect(cache.delete('itemKey')).to.true
      expect(deletedItem).to.eq(item)
    })
  })
})

describe('CacheAsync', () => {
  describe('set|get|delete', () => {
    it('handles rightly', async () => {
      const cache = new CacheAsync<Item>()

      const item = new Item()
      await cache.set('itemKey', item)

      expect(await cache.get('itemKey')).to.eq(item)

      expect(await cache.delete('itemKey')).to.true
      expect(await cache.delete('dummy')).to.false

      expect(await cache.get('itemKey')).to.be.undefined
    })
  })

  describe('TTL', () => {
    it('handles rightly', async () => {
      const cache = new CacheAsync<Item>({ defaultTtl: 200 })

      const itemDefaultTtl = new Item()
      const itemExpire100ms = new Item()
      const itemExpire300ms = new Item()
      const itemNotExpire = new Item()
      await cache.set('default', itemDefaultTtl)
      await cache.set('expire100ms', itemExpire100ms, 100)
      await cache.set('expire300ms', itemExpire300ms, 300)
      await cache.set('notExpire', itemNotExpire, 0)

      await delay(120)
      expect(await cache.get('expire100ms')).to.be.undefined
      expect(await cache.get('default')).to.eq(itemDefaultTtl)
      expect(await cache.get('expire300ms')).to.eq(itemExpire300ms)
      expect(await cache.get('notExpire')).to.eq(itemNotExpire)

      await delay(130) // 250
      expect(await cache.get('default')).to.be.undefined
      expect(await cache.get('expire300ms')).to.eq(itemExpire300ms)
      expect(await cache.get('notExpire')).to.eq(itemNotExpire)

      await delay(70) // 320
      expect(await cache.get('expire300ms')).to.be.undefined
      expect(await cache.get('notExpire')).to.eq(itemNotExpire)
    })
  })

  describe('onDelete', () => {
    it('calls on deleted', async () => {
      let deletedItem: Item | null = null

      const cache = new CacheAsync<Item>({
        onDelete: async (item) => {
          deletedItem = item
        }
      })

      const item = new Item()
      await cache.set('itemKey', item)
      expect(await cache.delete('itemKey')).to.true
      expect(deletedItem).to.eq(item)
    })
  })
})
