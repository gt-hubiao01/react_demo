import gsap from 'gsap'
import { useEffect } from 'react'
import './index.less'

const Demo = () => {
  useEffect(() => {
    gsap.from('.demo', { duration: 1, x: 500 })
  }, [])

  return (
    <div className="box">
      <div className="inner"></div>
    </div>
  )
}

export default Demo
