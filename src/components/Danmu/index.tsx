import { useEffect, useRef, useState } from 'react'
import styles from './index.module.less'
import gsap from 'gsap'
import DanmuItem from './DanmuItem'

type DanmuItemType = typeof DanmuItem

type DanmuType = { message: string; id: string; top: number }

interface IProps {
  messages: string[]
  Item?: DanmuItemType
  speed?: number
  density?: number
}

const Danmu = (props: IProps) => {
  const { messages, Item = DanmuItem, speed = 1, density = 1 } = props

  const [danmus, setDanmus] = useState<DanmuType[]>([])
  const containerRef = useRef<HTMLDivElement>(null)

  const noWrapCount = useRef(5)

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.parentElement?.style.setProperty(
        'position',
        'relative'
      )
    }
  }, [])

  useEffect(() => {
    const newMessages = messages.reduce((accMessages, message, index) => {
      let top: number
      let count = 0
      const existingTops =
        accMessages.length > noWrapCount.current
          ? accMessages.slice(-noWrapCount.current).map((item) => item.top)
          : accMessages.map((item) => item.top)


      do {
        top = Math.random() * (containerRef.current!.clientHeight - 20)
      } while (
        existingTops.some(
          (existingTop) => Math.abs(existingTop - top) < 20 && count++ < 10
        )
      )

      accMessages.push({
        message,
        top,
        id: message + index,
      })
      return accMessages
    }, [] as DanmuType[])

    setDanmus(newMessages)
  }, [messages])

  useEffect(() => {
    const tl = gsap.timeline()
    tl.to(`.${styles.danmuItem}`, {
      right: '100%',
      stagger: (1 / density) / 5,
      duration: (1 / speed) * 5,
      ease: 'linear',
    })
  }, [danmus])

  return (
    <div className={styles.danmuContainer} ref={containerRef}>
      {danmus.map((danmu) => (
        <div
          key={danmu.id}
          id='danmuItem'
          className={styles.danmuItem}
          style={{ top: danmu.top }}
        >
          <Item message={danmu.message} />
        </div>
      ))}
    </div>
  )
}

export default Danmu
