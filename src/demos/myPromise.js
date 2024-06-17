class MyPromise {
  static PENDING = 'pending'
  static FULFILLED = 'fulfilled'
  static REJECTED = 'rejected'

  value = undefined
  status = MyPromise.PENDING
  onFulfilledCallbacks = []
  onRejectedCallbacks = []

  constructor(excute) {
    const resolve = (value) => {
      if (this.status === MyPromise.PENDING) {
        this.status = MyPromise.FULFILLED
        this.value = value
        this.onFulfilledCallbacks.forEach((fn) => fn(value))
      }
    }

    const reject = (value) => {
      if (this.status === MyPromise.PENDING) {
        this.status = MyPromise.REJECTED
        this.value = value
        this.onRejectedCallbacks.forEach((fn) => fn(value))
      }
    }

    try {
      excute(resolve, reject)
    } catch (error) {
      reject(error)
    }
  }

  then(onFulfilled, onRejected) {
    onFulfilled =
      typeof onFulfilled === 'function'
        ? onFulfilled
        : (onFulfilled) => onFulfilled
    onRejected =
      typeof onRejected === 'function' ? onRejected : (onRejected) => onRejected

    return new MyPromise((resolve, reject) => {
      // 处理已完成状态
      if (this.status === MyPromise.FULFILLED) {
        try {
          queueMicrotask(() => {
            const result = onFulfilled(this.value)
            this.handlePromiseResult(result, resolve, reject)
          })
        } catch (error) {
          reject(error)
        }
      }
      // 处理已拒绝状态
      else if (this.status === MyPromise.REJECTED) {
        try {
          queueMicrotask(() => {
            const result = onRejected(this.value)
            this.handlePromiseResult(result, resolve, reject)
          })
        } catch (error) {
          reject(error)
        }
      }
      // 处理异步状态
      else {
        this.onFulfilledCallbacks.push((value) => {
          queueMicrotask(() => {
            const result = onFulfilled(value)
            this.handlePromiseResult(result, resolve, reject)
          })
        })

        this.onRejectedCallbacks.push((value) => {
          queueMicrotask(() => {
            const result = onRejected(value)
            this.handlePromiseResult(result, resolve, reject)
          })
        })
      }
    })
  }

  handlePromiseResult(result, resolve, reject) {
    if (result instanceof MyPromise) {
      result.then(resolve, reject)
    } else {
      resolve(result)
    }
  }

  static resolve(value) {
    return new MyPromise((resolve) => {
      resolve(value)
    })
  }

  static reject(value) {
    return new MyPromise((_, reject) => {
      reject(value)
    })
  }

  static all(promises) {
    if (!this._hasIterator(promises)) {
      throw new Error('MyPromise.all must receive an iterable')
    }

    return new MyPromise((resolve, reject) => {
      const resultArr = []

      promises.forEach((promise) => {
        promise.then(
          (res) => {
            if (resultArr.length === promises.length) {
              resolve(resultArr)
            }
            resultArr.push(res)
          },
          (err) => {
            reject(err)
          }
        )
      })
    })
  }

  static allSettled(promises) {
    if (!this._hasIterator(promises)) {
      throw new Error('MyPromise.allSettled must receive an iterable')
    }

    return new MyPromise((resolve) => {
      const resultArr = []

      promises.forEach((promise) => {
        promise.then(
          (res) => {
            resultArr.push({ status: 'fulfilled', value: res })
            if (resultArr.length === promise.length) {
              resolve(resultArr)
            }
          },
          (err) => {
            resultArr.push({ status: 'rejected', reason: err })
            if (resultArr.length === promise.length) {
              resolve(resultArr)
            }
          }
        )
      })
    })
  }

  static race(promises) {
    if (!this._hasIterator(promises)) {
      throw new Error('MyPromise.race must receive an iterable')
    }

    return new MyPromise((resolve, reject) => {
      promises.forEach((promise) => {
        promise.then(
          (res) => resolve(res),
          (err) => reject(err)
        )
      })
    })
  }

  static any(promises) {
    if (!this._hasIterator(promises)) {
      throw new Error('MyPromise.any must receive an iterable')
    }

    return new MyPromise((resolve) => {
      promises.forEach((promise) => {
        promise.then((res) => resolve(res))
      })
    })
  }

  static deferred() {
    let dfd = {}
    dfd.promise = new MyPromise((resolve, reject) => {
      dfd.resolve = resolve
      dfd.reject = reject
    })

    return dfd
  }
}

export default MyPromise
