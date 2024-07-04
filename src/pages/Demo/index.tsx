import React, { Suspense, useEffect, useState } from 'react'

export default function Demo() {
  return (
    <Suspense fallback={<div>加载中...</div>}>
      <List />
    </Suspense>
  )
}

const List = () => {
  const [data, setData] = useState('')


  useEffect(() => {
    const getData = new Promise<string>((resolve) => {
      setTimeout(() => {
        resolve('这是异步加载的数据')
      }, 2000)
    })
    getData.then((res) => {
      setData(res)
    })
  }, [])

  return <div>这是加载完后的数据：{data}</div>
}
