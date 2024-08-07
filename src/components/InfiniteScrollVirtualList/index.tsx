import React, { useEffect, useRef } from 'react'
import type { CSSProperties } from 'react'
import { List, InfiniteScroll } from 'antd-mobile'
import {
  List as VirtualizedList,
  AutoSizer,
  WindowScroller,
  CellMeasurer,
  CellMeasurerCache,
} from 'react-virtualized'
import styles from './index.module.less'
import { MeasuredCellParent } from 'react-virtualized/dist/es/CellMeasurer'
import { loadingMoreTip } from './utils'
import useUpdate from '@/hooks/basicHooks/useUpdate'

export type VListItemPropsType = {
  item: any
  index: number
  measure: () => void
}

export type VListItemType = (props: VListItemPropsType) => React.ReactNode

interface IProps {
  data: any[]
  hasMore: boolean
  loadMore: (isRetry: boolean) => Promise<void>
  listItem: VListItemType
  overscanRowCount?: number
  onScroll?: (params: { scrollLeft: number; scrollTop: number }) => void
}

const InfiniteScrollVirtualList = ({
  data,
  hasMore,
  loadMore,
  listItem,
  overscanRowCount,
  onScroll,
}: IProps) => {
  const scrollerContainer = useRef<HTMLDivElement>(null)

  const update = useUpdate()

  // 需要强制刷新来解决列表项高度变化导致的列表高度计算错误
  useEffect(() => {
    setTimeout(() => {
      update()
    }, 0)
  }, [update, data])

  const cache = useRef(
    new CellMeasurerCache({
      defaultHeight: 50,
      fixedWidth: true,
    })
  )

  const [showTopShadow, setShowTopShadow] = React.useState(false)
  const [showBottomShadow, setShowBottomShadow] = React.useState(false)

  const handleScroll = () => {
    const container = scrollerContainer.current

    if (!container) return

    const maxScrollHeight = container.scrollHeight - container.clientHeight
    setShowTopShadow(container.scrollTop > 0)
    setShowBottomShadow(container.scrollTop < maxScrollHeight)
  }

  useEffect(() => {
    setTimeout(() => {
      handleScroll()
    }, 0)
  }, [data])

  const rowRenderer = ({
    index,
    key,
    style,
    parent,
  }: {
    index: number
    key: string
    style: CSSProperties
    parent: MeasuredCellParent
  }) => {
    const item = data[index]
    if (!item) return

    return (
      <CellMeasurer
        cache={cache.current}
        columnIndex={0}
        key={key}
        parent={parent}
        rowIndex={index}
      >
        {({ measure, registerChild }) => (
          <div ref={registerChild as undefined} style={style}>
            <List.Item key={key}>
              {listItem({ item, index, measure })}
            </List.Item>
          </div>
        )}
      </CellMeasurer>
    )
  }

  return (
    <div className={styles.vListContainer}>
      <div
        className={`${styles.shadow} ${showTopShadow ? styles.topShadow : ''}`}
      />
      <div className={styles.infiniteScrollVList} ref={scrollerContainer}>
        <WindowScroller
          onScroll={(props) => {
            handleScroll()
            onScroll && onScroll(props)
          }}
          scrollElement={
            (scrollerContainer.current as HTMLElement) || undefined
          }
        >
          {({ height, scrollTop, isScrolling }) => (
            <List className={styles.antMobileList}>
              <AutoSizer disableHeight>
                {({ width }) => (
                  <VirtualizedList
                    autoHeight
                    deferredMeasurementCache={cache.current}
                    height={height}
                    isScrolling={isScrolling}
                    overscanRowCount={overscanRowCount || 10}
                    rowCount={data.length}
                    rowHeight={cache.current.rowHeight}
                    rowRenderer={rowRenderer}
                    scrollTop={scrollTop}
                    width={width}
                  />
                )}
              </AutoSizer>
            </List>
          )}
        </WindowScroller>
        <InfiniteScroll hasMore={hasMore} loadMore={loadMore}>
          {loadingMoreTip}
        </InfiniteScroll>
      </div>
      <div
        className={`${styles.shadow} ${
          showBottomShadow ? styles.bottomShadow : ''
        }`}
      />
    </div>
  )
}

export default InfiniteScrollVirtualList
