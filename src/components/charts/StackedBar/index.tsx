import React, { useEffect, useRef } from 'react'
import { init, use, EChartsType, dispose } from 'echarts/core'
import styles from '../index.module.less'
import { Spin } from 'antd'
import EmptyIcon from '@/assets/accountEmpty.svg'
import { BarChart } from 'echarts/charts'
import { colors } from '../ColorMap'
import {
  TooltipComponent,
  GridComponent,
  LegendComponent,
} from 'echarts/components'
import { SVGRenderer } from 'echarts/renderers'

use([LegendComponent, BarChart, TooltipComponent, GridComponent, SVGRenderer])

export interface ChannelData {
  [key: string]: number[]
}

const StackedBar = (props: {
  id: string
  loading: boolean
  xAxis: { label: string; value: string }[]
  yData: ChannelData
  legendData: { label: string; value: string }[]
  onClickBar?: ({ label, value }: { label: string; value: string }) => void
}): React.ReactElement => {
  const { id, xAxis, yData, legendData, loading, onClickBar } = props

  const stakcedChart = useRef<EChartsType>()

  useEffect(() => {
    const resizePie = () => {
      setTimeout(() => {
        stakcedChart?.current?.resize()
      }, 100)
    }
    window.addEventListener('resize', resizePie)
    return () => {
      window.removeEventListener('resize', resizePie)
    }
  }, [])

  useEffect(() => {
    const dom = document.getElementById(id) as HTMLElement
    if (xAxis.length > 0 && dom) {
      // 先清除，再重新初始化
      stakcedChart.current = undefined
      dispose(dom)
      if (!stakcedChart.current) {
        stakcedChart.current = init(dom, undefined, {
          renderer: 'svg',
          useDirtyRect: false,
        })
      }

      const option = {
        tooltip: {
          confine: true,
          trigger: 'axis',
          axisPointer: {
            type: 'shadow',
          },
          textStyle: {
            fontSize: 12,
            fontWeight: 400,
          },
        },
        legend: {
          type: 'scroll',
          data: legendData
            .filter((item) => Object.keys(yData).indexOf(item.value) > -1)
            .map(({ label }) => label)
            .filter(Boolean),
          bottom: 0,
          padding: 0,
          left: 'center',
          icon: 'circle',
          itemGap: 30,
          itemWidth: 15,
          textStyle: {
            color: '#2C3542A6',
            fontSize: 12,
            fontWeight: 400,
          },
        },
        grid: {
          top: 10,
          left: 0,
          right: 16,
          bottom: 38,
          containLabel: true,
        },
        xAxis: {
          type: 'value',
          minInterval: 1,
        },
        yAxis: [
          {
            type: 'category',
            axisLabel: {
              width: 100,
              lineHeight: 16,
              overflow: 'truncate',
            },
            data: xAxis.map(({ label }) => label),
          },
        ],
        series: legendData.map(({ value, label }) => {
          return {
            name: label,
            type: 'bar',
            stack: 'total',
            data: (yData[`${value}`] || []).map((num) =>
              num > 0 ? num : undefined
            ),
            barMaxWidth: 30,
            cursor: 'pointer',
          }
        }),
        color: colors,
      }

      if (option && typeof option === 'object') {
        stakcedChart?.current?.setOption(option)
      }

      // 更改鼠标为pointer
      const changeCursor = (params: any) => {
        const pointInPixel = [params.offsetX, params.offsetY]
        if (stakcedChart.current?.containPixel('grid', pointInPixel)) {
          stakcedChart.current.getZr().setCursorStyle('pointer')
        }
      }
      stakcedChart.current.getZr().off('mousemove', changeCursor)
      stakcedChart.current.getZr().on('mousemove', changeCursor)

      // 设置整个空白区域可点击
      const clickToJump = (params: any) => {
        const pointInPixel = [params.offsetX, params.offsetY]
        if (stakcedChart.current?.containPixel('grid', pointInPixel)) {
          const yIndex = stakcedChart.current.convertFromPixel(
            {
              seriesIndex: 0,
            },
            [params.offsetX, params.offsetY]
          )[1]
          onClickBar && onClickBar(xAxis[yIndex])
        }
      }
      stakcedChart.current.getZr().off('click', clickToJump)
      stakcedChart.current.getZr().on('click', clickToJump)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, xAxis, yData, legendData])

  return loading ? (
    <Spin className={styles.chartsSpinLoading} />
  ) : (
    <>
      {xAxis.length === 0 && !loading ? (
        <div className={styles.empty}>
          <img src={EmptyIcon} />
          <span>暂无数据</span>
        </div>
      ) : (
        <div className={styles.body} id={id}></div>
      )}
    </>
  )
}

export default StackedBar
