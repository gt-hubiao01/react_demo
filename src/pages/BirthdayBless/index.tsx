import { useMemo,  } from 'react'
import styles from './index.module.less'
import { Swiper } from 'antd-mobile'
import { mockData,danmuData } from './utils'
import BlessCard from './BlessCard'
import Danmu from '../../components/Danmu'


function BirthdayBless() {
  const displayName = '赵冬梅'

  const cards = useMemo(() => {
    // 待定，从接口获取数据
    return mockData.map((item) => {
      return (
        <Swiper.Item key={item.cardId}>
          <BlessCard {...item} />
        </Swiper.Item>
      )
    })
  }, [])

  return (
    <div className={styles.bless}>
      <Danmu messages={danmuData}/>
      <div className={styles.blessTitle}>
        {displayName} 生日快乐
      </div>
      <div className={styles.blessDescription}>请查收来自四面八方的祝福~</div>

      <div className={styles.blessContainer}>
        <Swiper
          className={styles.swiper}
          indicator={() => null}
          slideSize={87.2}
          stuckAtBoundary={false}
          trackOffset={6.4}
        >
          {cards}
        </Swiper>
      </div>
    </div>
  )
}

export default BirthdayBless
