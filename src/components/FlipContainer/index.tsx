import React, {
  forwardRef,
  PropsWithChildren,
  useImperativeHandle,
} from 'react'
import styles from './index.module.less'
import { gsap } from 'gsap'

interface IProps {}

interface IRefType {
  // 触发翻转动画，可选参数为播放动画完毕后的回调函数
  trigger: (callback?: () => void) => void
  isAnimating: boolean
}

const FlipContainer = (
  { children }: PropsWithChildren<IProps>,
  ref: React.Ref<IRefType>
) => {
  const containerRef = React.useRef<HTMLDivElement>(null)

  const [isAnimating, setIsAnimating] = React.useState(false)

  const disableMouseEvents = () => {
    document.body.style.pointerEvents = 'none'
  }

  const enableMouseEvents = () => {
    document.body.style.pointerEvents = 'auto'
  }

  const trigger = (callback?: () => void) => {
    const container = containerRef.current
    const tl = gsap.timeline({
      onStart: () => {
        disableMouseEvents()
        setIsAnimating(true)
      },
      onComplete: () => {
        enableMouseEvents()
        setIsAnimating(false)
        callback && callback()
      },
    })

    if (container) {
      tl.to(container, {
        rotationY: -60,
        duration: 0.6,
        ease: 'none',
      }).to(container, {
        rotationY: 360,
        duration: 4,
        ease: 'elastic.out(1, 0.9)',
      })
    }
  }

  useImperativeHandle(ref, () => ({
    trigger,
    isAnimating,
  }))

  return (
    <div className={styles.flipContainer} ref={containerRef}>
      {children}
    </div>
  )
}

export default forwardRef(FlipContainer)
