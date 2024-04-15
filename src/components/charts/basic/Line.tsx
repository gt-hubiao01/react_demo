import React, { useEffect, useRef } from 'react'
import { init, use, EChartsType, dispose } from 'echarts/core'
import styles from './index.module.less'
import { Spin } from 'antd'
import EmptyIcon from '@/assets/empty.svg'
import { LineChart } from 'echarts/charts'
import {
  TooltipComponent,
  GridComponent,
  LegendComponent,
} from 'echarts/components'
import { SVGRenderer } from 'echarts/renderers'
import { formatNumber } from '@/utils/transformNumber'
import dayjs from 'dayjs'

use([LegendComponent, LineChart, TooltipComponent, GridComponent, SVGRenderer])

export type LineChartData = {
  time: number
  value: number
}[]

const Line = (props: {
  id: string
  typeName: string
  loading: boolean
  data: LineChartData
}): React.ReactElement => {
  const { id, data, loading, typeName } = props

  const lineChart = useRef<EChartsType>()

  useEffect(() => {
    const resizeLine = () => {
      setTimeout(() => {
        lineChart?.current?.resize()
      }, 100)
    }
    window.addEventListener('resize', resizeLine)
    return () => {
      window.removeEventListener('resize', resizeLine)
    }
  }, [])

  useEffect(() => {
    const dom = document.getElementById(id) as HTMLElement
    if (data && data.length > 0 && dom && dom.clientHeight > 0) {
      lineChart.current = undefined
      dispose(dom)
      if (!lineChart.current) {
        lineChart.current = init(dom, undefined, {
          renderer: 'svg',
          useDirtyRect: false,
        })
      }

      const option = {
        tooltip: {
          confine: true,
          trigger: 'axis',
          textStyle: {
            fontSize: 12,
            fontWeight: 400,
          },
          formatter: (params: any) => {
            return `${dayjs(params[0].axisValueLabel).format(
              'YYYY年MM月DD日'
            )}<br />${params[0].marker}${params[0].seriesName}：${formatNumber(
              params[0].value[1]
            )}`
          },
        },
        grid: {
          top: 38,
          left: 11,
          right: 38,
          bottom: 38,
          containLabel: true,
        },
        xAxis: {
          type: 'time',
          minInterval: 3600 * 1000 * 24,
          axisLabel: {
            margin: 20,
            color: '#666666',
            hideOverlap: true,
            showMaxLabel: true,
            formatter: (value: number) => {
              return dayjs(value).format('YY年MM月DD日')
            },
          },
          axisTick: {
            show: false,
          },
          axisLine: {
            lineStyle: {
              color: '#F3F3F3',
              width: 1,
            },
          },
          data: data.map((item) => item.time),
        },
        yAxis: {
          type: 'value',
          splitLine: {
            lineStyle: {
              color: '#F3F3F3',
              width: 1,
              type: 'dashed',
            },
          },
          axisLabel: {
            margin: 20,
            color: '#666666',
            formatter: formatNumber,
          },
        },
        series: [
          {
            name: typeName,
            type: 'line',
            data: data.map((item) => [item.time, item.value]),
            lineStyle: {
              width: 2,
            },
            symbol: 'circle',
            symbolSize: 6,
            showSymbol: false,
            itemStyle: {
              color: '#A99AFD',
            },
            areaStyle: {
              color: {
                type: 'linear',
                x: 0,
                y: 0.9234,
                x2: 0,
                y2: 0,
                colorStops: [
                  {
                    offset: 0,
                    color: 'rgba(169, 154, 253, 0.0)',
                  },
                  {
                    offset: 1,
                    color: '#A99AFD',
                  },
                ],
              },
              opacity: 0.2388,
            },
          },
        ],
        color: '#A99AFD',
      }

      if (option && typeof option === 'object') {
        lineChart?.current?.setOption(option)
      }
    }
  }, [id, data, typeName])

  return loading ? (
    <Spin className={styles.chartsSpinLoading} />
  ) : (
    <>
      {data && data.length === 0 && !loading ? (
        <>
          <div className={styles.empty}>
            <img src={EmptyIcon} />
            <span>暂无数据</span>
          </div>
        </>
      ) : (
        <div className={styles.body} id={id}></div>
      )}
    </>
  )
}

export default Line
