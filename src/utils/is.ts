// 是否是对象
export const isObject = (val: any): val is Record<any, any> => {
  return val !== null && typeof val === 'object'
}

// 是否是数组
export const isArray = (val: any): val is Array<any> => {
  return Array.isArray(val)
}

// 是否是函数
export const isFunction = (val: any): val is Function => {
  return typeof val === 'function'
}

// 是否是空对象或者空数组
export const isEmpty = (val: any): boolean => {
  if (isObject(val)) 
    return Object.keys(val).length === 0
  if (isArray(val))
    return val.length === 0
  return false
}

