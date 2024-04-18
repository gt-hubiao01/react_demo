import React, { useEffect, useRef } from 'react'
import { init, use, EChartsType, dispose } from 'echarts/core'
import styles from '../index.module.less'
import { Spin } from 'antd'
import EmptyIcon from '@/assets/accountEmpty.svg'
import { TreeChart, CustomChart } from 'echarts/charts'
import {
  TooltipComponent,
  TitleComponent,
  GridComponent,
  LegendComponent,
} from 'echarts/components'
import { SVGRenderer } from 'echarts/renderers'
import {
  getInitialTree,
  getFoldTree,
  getHoverBtnTree,
  getHoverBoxTree,
  recoverHover,
} from './util'

use([
  LegendComponent,
  TitleComponent,
  TreeChart,
  CustomChart,
  TooltipComponent,
  GridComponent,
  SVGRenderer,
])

export interface ChannelData {
  [key: string]: number[]
}

const orgChart = {
  name: '伍新春',
  level: 'M8',
  department: '效能效率中心',
  leaveRate: '10.78%',
  leaveCount: 12345,
  isHigher: true,
  children: [
    {
      name: 'Manager',

      children: [
        {
          name: 'Foreman',
          children: [
            {
              name: 'Worker',
              label: 'Worker',
            },
          ],
        },
        {
          name: 'Foreman',

          children: [
            {
              name: 'Worker',
            },
          ],
        },
      ],
    },
  ],
}

const Tree = (props: {
  id: string
  loading: boolean
  data: { label: string; value: string }[]
}): React.ReactElement => {
  const { id, data, loading } = props

  const treeChart = useRef<EChartsType>()

  const newTree = getInitialTree(orgChart)

  // const finalTree = useFinalTree(newTree)

  useEffect(() => {
    const resizePie = () => {
      setTimeout(() => {
        treeChart?.current?.resize()
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
      treeChart.current = undefined
      dispose(dom)
      if (!treeChart.current) {
        treeChart.current = init(dom, undefined, {
          renderer: 'svg',
          useDirtyRect: false,
        })
      }

      const option = {
        name: '组织架构资产一览图',
        //提供数据视图、还原、下载的工具
        tooltip: {
          show: false,
          trigger: 'item',
          formatter: '{b}: {c}',
        },
        series: [
          {
            name: '组织架构一览图',
            type: 'tree',
            orient: 'vertical', //竖向或水平   TB代表竖向  LR代表水平
            edgeShape: 'polyline', //控制折线的形式
            top: '150',
            expandAndCollapse: false, //点击节点时不收起子节点，default: true

            symbolSize: [16, 16],
            emphasis: {
              disabled: true,
            },

            label: {
              position: 'top',
              borderWidth: 1,
              borderRadius: 16,
              width: 144,
              height: 120,
              borderColor: '#FF968A',
              backgroundColor: '#fff',
              formatter: () => {
                return ''
              },
            },
            labelLayout: {
              moveOverlap: 'shiftX',
            },

            lineStyle: {
              color: '#D5D5D5',
              width: 1,
            },
            roam: true,
            data: [newTree],
            animationDurationUpdate: 750,
          },
        ],
      }

      const clickOnGraph = (params: any) => {
        const currentOption: any = treeChart.current?.getOption()
        const currentData = currentOption.series[0].data[0]
        if (params.event.target.type === 'image') {
          currentOption.series[0].data[0] = getFoldTree(
            currentData,
            params.name
          )
          treeChart.current?.setOption(currentOption as any, true)
        } else {
          console.log(params.name)
        }
      }

      treeChart.current.off('click', clickOnGraph)
      treeChart.current.on('click', clickOnGraph)

      const hoverOnGraph = (params: any) => {
        // console.log(params)
        const currentOption: any = treeChart.current?.getOption()
        const currentData = currentOption.series[0].data[0]
        if (params.event.target.type === 'image') {
          currentOption.series[0].data[0] = getHoverBtnTree(
            currentData,
            params.name
          )
        } else {
          currentOption.series[0].data[0] = getHoverBoxTree(
            currentData,
            params.name
          )
        }
        treeChart.current?.setOption(currentOption as any, true)
      }

      treeChart.current.off('mousemove', hoverOnGraph)
      treeChart.current.on('mousemove', hoverOnGraph)

      const hoverOut = () => {
        const currentOption: any = treeChart.current?.getOption()
        const currentData = currentOption.series[0].data[0]
        currentOption.series[0].data[0] = recoverHover(currentData)
        treeChart.current?.setOption(currentOption as any, true)
      }

      treeChart.current.off('mouseout', hoverOut)
      treeChart.current.on('mouseout', hoverOut)

      if (option && typeof option === 'object') {
        treeChart?.current?.setOption(option)
      }
    }
  }, [id, data, newTree])

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
        <>
          {/* <img src={finalTree.symbol} alt="" /> */}
          <div className={styles.body} id={id}></div>
        </>
      )}
    </>
  )
}

export default Tree
