/**
 * From https://github.com/charlieduong94/util-promisifyAll/blob/master/index.js
 */
// @ts-ignore
import { promisify } from 'util'

const functionBlackListMap =
  Object.getOwnPropertyNames(Object.prototype)
    .reduce(function (map: any, functionName) {
      map[functionName] = true
      return map
    }, {});

function _promisifyAllFunctions (object: any) {
  for (const key of Object.getOwnPropertyNames(object)) {
    if (functionBlackListMap[key]) {
      continue;
    }

    const descriptor = Object.getOwnPropertyDescriptor(object, key)

    if (descriptor && !descriptor.get) {
      const func = object[key]
      if (typeof func === 'function') {
        object[`${key}Async`] = promisify(func)
        console.log(`${key}Async`)
      }
    }
  }
}

export function promisifyAll (object: any) {
  _promisifyAllFunctions(object)

  const proto = Object.getPrototypeOf(object)
  if (proto) {
    _promisifyAllFunctions(proto)
  }

  return object
}