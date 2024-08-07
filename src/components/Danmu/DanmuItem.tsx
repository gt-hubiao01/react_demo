import { CSSProperties, useRef } from 'react'
import styles from './index.module.less'
import { getRandomRGBColor } from '@/utils/getRandomColor'

export interface IProps {
  message: string
}

const DanmuItem = ({ message }: IProps) => {
  const color = useRef(getRandomRGBColor())

  return (
    <div
      className={styles.itemOuter}
      style={
        {
          '--item-color-r': color.current.r,
          '--item-color-g': color.current.g,
          '--item-color-b': color.current.b,
        } as CSSProperties
      }
    >
      <div className={styles.itemInner}>{message}</div>
    </div>
  )
}

export default DanmuItem
