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
          axisLabel: {
            width: 50,
            overflow: 'truncate',
            ellipsis: '...',
          },
          triggerEvent: true,

          data: [
            'Brazil',
            'Indonesia11111111111111111111',
            'USA',
            'India',
            'China',
            'World',
          ],
        },
        series: [
          {
            name: '2011',
            type: 'bar',
            data: [
              { name: 'Brazil', value: 10 },
              { name: 'Indonesia', value: 20 },
              { name: 'USA', value: 30 },
              { name: 'India', value: 40 },
              { name: 'China', value: 50 },
              { name: 'World', value: 60 },
            ],
          },
        ],
        colors: colors,
      }

      const changeCursorAndColor = (params: any, type: string) => {
        const pointInPixel = [params.offsetX, params.offsetY]

        const yIndex = barChart.current?.convertFromPixel(
          { seriesIndex: 0 },
          pointInPixel
        )[1]

        const newOption: any = barChart.current?.getOption()
        const yAxisData = newOption.yAxis[0].data

        const changeItem = () => {
          barChart.current?.getZr().setCursorStyle('pointer')
          newOption.yAxis[0].data = yAxisData.map(
            (item: any, index: number) => {
              return {
                value: item.value || item,
                textStyle: {
                  color: index === yIndex ? 'red' : '',
                },
              }
            }
          )
        }

        const recoverItem = () => {
          newOption.yAxis[0].data = yAxisData.map((item: any) => {
            return item.value || item
          })
        }

        switch (type) {
          case 'graph': {
            if (barChart.current?.containPixel('grid', pointInPixel)) {
              changeItem()
            } else {
              recoverItem()
            }
            break
          }
          case 'yAxis': {
            if (
              yIndex !== undefined &&
              yIndex >= 0 &&
              yIndex < yAxisData.length
            ) {
              changeItem()
            } else {
              recoverItem()
            }
          }
        }

        barChart.current?.setOption(newOption as any, true)
      }

      const hoverOnGraph = (params: any) => {
        changeCursorAndColor(params, 'graph')
      }

      barChart.current.getZr().off('mousemove', hoverOnGraph)
      barChart.current.getZr().on('mousemove', hoverOnGraph)

      const hoverOnYAxis = (params: any) => {
        const xPixelOfZero = barChart.current?.convertToPixel(
          { seriesIndex: 0 },
          [0, 0]
        )[0]
        if (xPixelOfZero && params.offsetX > xPixelOfZero) return
        changeCursorAndColor(params, 'yAxis')
      }

      barChart.current.getZr().off('mousemove', hoverOnYAxis)
      barChart.current.getZr().on('mousemove', hoverOnYAxis)

      const clickOnGraph = (params: any) => {
        const pointInPixel = [params.offsetX, params.offsetY]

        if (barChart.current?.containPixel('grid', pointInPixel)) {
          console.log('点击了柱子')
        }
      }

      barChart.current.getZr().off('click', clickOnGraph)
      barChart.current.getZr().on('click', clickOnGraph)

      const clickOnYAxis = (params: any) => {
        const pointInPixel = [params.offsetX, params.offsetY]

        const xPixelOfZero = barChart.current?.convertToPixel(
          { seriesIndex: 0 },
          [0, 0]
        )[0]

        const yIndex = barChart.current?.convertFromPixel(
          { seriesIndex: 0 },
          pointInPixel
        )[1]

        const newOption: any = barChart.current?.getOption()
        const yAxisData = newOption.yAxis[0].data

        if (
          yIndex !== undefined &&
          yIndex >= 0 &&
          yIndex < yAxisData.length &&
          xPixelOfZero &&
          params.offsetX < xPixelOfZero
        ) {
          console.log('点击了y轴标签')
        }
      }

      barChart.current.getZr().off('click', clickOnYAxis)
      barChart.current.getZr().on('click', clickOnYAxis)

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
