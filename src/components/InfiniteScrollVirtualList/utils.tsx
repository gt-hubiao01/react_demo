import React from 'react'
import { DotLoading } from 'antd-mobile'
import styles from './index.module.less'

export const loadingMoreTip: (
  hasMore: boolean,
  failed: boolean,
  retry: () => void
) => React.ReactNode = (hasMore) => {
  return (
    <div className={styles.loadingMoreTip}>
      {hasMore ? (
        <div className={styles.loading}>
          <DotLoading color="#F2605E" />
          加载中
        </div>
      ) : (
        <div className={styles.noMore}>
          <span className={styles.line}></span>
          <span>没有更多了</span>
          <span className={styles.line}></span>
        </div>
      )}
    </div>
  )
}
