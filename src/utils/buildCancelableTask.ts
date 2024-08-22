/**
 * 构建可取消任务，用于包装给定的异步任务。
 * @template T 任务结果的类型。
 * @param {() => Promise<T>} task 要包装的异步任务。
 * @param {boolean} [immediatelyStart=true] 确定任务是否应在创建时立即启动。
 * @returns {{ start: () => Promise<T>, cancel: () => void }} 包含 `start` 和 `cancel` 方法的对象。
 */
const buildCancelableTask = <T>(
  task: () => Promise<T>,
  immediatelyStart: boolean = true
) => {
  const abortController = new AbortController()

  const start = () =>
    new Promise<T>((resolve, reject) => {
      const cancelTask = () => reject(new Error('CanceledError'))

      if (abortController.signal.aborted) {
        cancelTask()
        return
      }

      task().then(resolve, reject)

      abortController.signal.addEventListener('abort', () => {
        cancelTask
      })
    })

  const cancel = () => {
    abortController.abort()
  }

  if (immediatelyStart) {
    start()
  }

  return {
    start,
    cancel,
  }
}
