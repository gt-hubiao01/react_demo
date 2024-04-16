import React, { useEffect, useRef } from 'react'
import { init, use, EChartsType, dispose } from 'echarts/core'
import styles from '../index.module.less'
import { Spin } from 'antd'
import EmptyIcon from '@/assets/accountEmpty.svg'
import { BarChart, CustomChart } from 'echarts/charts'
import { colors } from '../ColorMap'
import {
  TooltipComponent,
  TitleComponent,
  GridComponent,
  LegendComponent,
} from 'echarts/components'
import { SVGRenderer } from 'echarts/renderers'

use([
  LegendComponent,
  TitleComponent,
  BarChart,
  CustomChart,
  TooltipComponent,
  GridComponent,
  SVGRenderer,
])

export interface ChannelData {
  [key: string]: number[]
}

const Bar = (props: {
  id: string
  loading: boolean
  average?: number
  data: { label: string; value: string }[]
}): React.ReactElement => {
  const { id, data, average, loading } = props

  const barChart = useRef<EChartsType>()

  useEffect(() => {
    const resizePie = () => {
      setTimeout(() => {
        barChart?.current?.resize()
      }, 100)
    }
    window.addEventListener('resize', resizePie)
    return () => {
      window.removeEventListener('resize', resizePie)
    }
  }, [])

  useEffect(() => {
    const dom = document.getElementById(id) as HTMLElement
    if (data.length > 0 && dom) {
      // 先清除，再重新初始化
      barChart.current = undefined
      dispose(dom)
      if (!barChart.current) {
        barChart.current = init(dom, undefined, {
          renderer: 'svg',
          useDirtyRect: false,
        })
      }

      const option = {
        title: {
          text: 'World Population',
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow',
          },
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true,
        },
        xAxis: {
          type: 'value',
          boundaryGap: [0, 0.01],
        },
        yAxis: {
          type: 'category',
          data: ['Brazil', 'Indonesia', 'USA', 'India', 'China', 'World'],
        },
        series: [
          {
            name: '2011',
            type: 'bar',
            data: [18203, 23489, 29034, 104970, 131744, 630230],
          },
        ],
        colors: colors,
      }

      // 更改鼠标为pointer
      const changeCursor = (params: any) => {
        const pointInPixel = [params.offsetX, params.offsetY]

        if (barChart.current?.containPixel('grid', pointInPixel)) {
          const yIndex = barChart.current.convertFromPixel(
            {
              seriesIndex: 0,
            },
            [params.offsetX, params.offsetY]
          )[1]
        }
        const currentOption: any = barChart.current?.getOption()
        const pointInGrid = barChart.current?.convertFromPixel(
          {
            seriesIndex: 0,
          },
          pointInPixel
        )
        const pixelCoord = barChart.current?.convertToPixel(
          { seriesIndex: 0 },
          [0, pointInGrid![1]]
        )
        console.log(pixelCoord)
        // console.log(pointInGrid)
        const newSeries = [currentOption.series[0]].concat({
          type: 'custom',
          renderItem: function () {
            // 返回箭头元素
            return {
              type: 'path',
              x: pixelCoord![0] - 30, // 调整箭头 x 位置
              y: pixelCoord![1] - 5, // 调整箭头 y 位置
              shape: {
                pathData: 'M 0 0 L 10 0 L 10 10 L 0 10 Z', // 箭头路径数据
              },
              style: {
                fill: '#000', // 箭头默认颜色
              },
              emphasis: {
                style: {
                  fill: '#f00', // 鼠标悬浮时箭头颜色变化为红色
                },
              },
              onclick: function () {
                console.log(`Arrow clicked at index ${api.value(0)}!`) // 点击箭头时的操作
              },
            }
          },
          data: [0],
        })
        currentOption.series = newSeries
        barChart.current?.setOption(currentOption)
      }
      barChart.current.getZr().off('mousemove', changeCursor)
      barChart.current.getZr().on('mousemove', changeCursor)

      if (option && typeof option === 'object') {
        barChart?.current?.setOption(option)
      }
    }
  }, [id, data, average])

  return loading ? (
    <Spin className={styles.chartsSpinLoading} />
  ) : (
    <>
      {data.length === 0 && !loading ? (
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

export default Bar
