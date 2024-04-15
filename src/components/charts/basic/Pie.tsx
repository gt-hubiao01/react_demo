import React, { useEffect, useMemo, useRef } from 'react'
import { init, use, EChartsType, getInstanceByDom } from 'echarts/core'
import styles from './index.module.less'
import { Spin } from 'antd'
import EmptyIcon from '@/assets/accountEmpty.svg'
import { colors } from './ColorMap'
import { PieChart } from 'echarts/charts'
import {
  TooltipComponent,
  GridComponent,
  LegendComponent,
} from 'echarts/components'
import { SVGRenderer } from 'echarts/renderers'

use([LegendComponent, PieChart, TooltipComponent, GridComponent, SVGRenderer])

interface CategoryData {
  type: string
  name: string
  value: number
}

const Pie = (props: {
  id: string
  loading: boolean
  data: CategoryData[]
  legendData?: { label: string; value: string }[]
  onClickPie?:
    | ((type: string) => void)
    | (({ label, value }: { label: string; value: string }) => void)
  clickLabel?: boolean
}): React.ReactElement => {
  const {
    id,
    data = [],
    legendData = [],
    loading,
    onClickPie,
    clickLabel,
  } = props

  const myPieChart = useRef<EChartsType>()

  useEffect(() => {
    const resizePie = () => {
      setTimeout(() => {
        myPieChart?.current?.resize()
      }, 100)
    }
    window.addEventListener('resize', resizePie)
    return () => {
      window.removeEventListener('resize', resizePie)
    }
  }, [])

  const cData = useMemo(() => {
    if (data.length > 0 && legendData.length > 0) {
      return legendData
        .map(({ value }) => {
          const item = data.find(({ type }) => type === value) as CategoryData
          return item
        })
        .filter(Boolean)
    }
    return data
  }, [data, legendData])

  useEffect(() => {
    const dom = document.getElementById(id) as HTMLElement
    if (cData.length > 0 && dom) {
      myPieChart.current = getInstanceByDom(dom)
      if (!myPieChart.current) {
        myPieChart.current = init(dom, undefined, {
          renderer: 'svg',
          useDirtyRect: false,
        })
      }

      const option = {
        tooltip: {
          trigger: 'item',
          textStyle: {
            fontSize: 12,
            fontWeight: 400,
          },
        },
        legend: {
          data: cData
            .map(({ value, name }) => (value > 0 ? name : undefined))
            .filter(Boolean),
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
          type: 'scroll',
          orient: 'horizontal',
          right: 0,
          bottom: 10,
        },
        series: [
          {
            type: 'pie',
            radius: ['33.6%', '55%'],
            percentPrecision: 1,
            data: cData.filter(({ value }) => value > 0),
            emphasis: {
              itemStyle: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: 'rgba(0, 0, 0, 0.5)',
              },
            },
            label: {
              formatter: '{b}: {d}%',
              color: '#000000A6',
              fontWeight: 400,
              fontSize: 12,
            },
            center: ['50%', '45%'],
            top: 0,
            bottom: 0,
            tooltip: {
              borderWidth: 0,
              formatter: '{b}: {c} ({d}%)',
            },
            minShowLabelAngle: 8,
          },
        ],
        color: colors,
      }

      if (option && typeof option === 'object') {
        myPieChart?.current?.setOption(option)
      }

      myPieChart.current.off('click')
      myPieChart.current.on('click', (params: any) => {
        const { data } = params
        if (clickLabel) {
          onClickPie &&
            onClickPie({ label: data.name, value: data.type } as unknown as {
              label: string
              value: string
            } & string)
        } else {
          onClickPie && onClickPie(data.type)
        }
      })
    }
  }, [id, cData, onClickPie, legendData, clickLabel])

  return loading ? (
    <Spin className={styles.chartsSpinLoading} />
  ) : (
    <>
      {cData.length === 0 && !loading ? (
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

export default Pie
