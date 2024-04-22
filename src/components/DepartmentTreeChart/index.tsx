import { useEffect, useState, useRef } from 'react'
import styles from './index.module.less'
import Tree from 'react-d3-tree'
import { getInitialTree } from './utils'
import { Tooltip } from 'antd'
// import { useNavigate } from 'react-router-dom'

const orgChart = {
  name: '伍新春',
  level: 'M8',
  department: '效能效率中心',
  leaveRate: '10.78%',
  leaveMount: 12345,
  isHigher: true,
  show: true,
  children: [
    {
      name: 'Manager',
      show: true,

      children: [
        {
          name: 'Foreman',
          children: [
            {
              name: 'Worker',
              label: 'Worker',
            },
            {
              name: 'Worker',
            },
            {
              name: 'Worker',
            },
            {
              name: 'Worker',
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

function DepartmentTreeChart() {
  const [translate, setTransLate] = useState({ x: 0, y: 0 })
  const containerRef = useRef<HTMLDivElement>(null)

  const [departmentTree, setDepartmentTree] = useState(orgChart)

  // const navigate = useNavigate()

  useEffect(() => {
    setDepartmentTree(getInitialTree(orgChart))
  }, [])

  useEffect(() => {
    if (containerRef.current) {
      const { width } = containerRef.current.getBoundingClientRect()
      setTransLate({ x: width / 2, y: 140 })
    }
  }, [])

  const plusPath = (radius: number) =>
    `M ${-radius / 2} 0 H ${radius / 2} M 0 ${-radius / 2} V ${radius / 2}`
  const minusPath = (radius: number) => `M ${-radius / 2} 0 H ${radius / 2}`

  const renderCustomNodeElement = (rd3tProps: any) => {
    const { nodeDatum, toggleNode, addChildren } = rd3tProps

    const isLeaf = !(nodeDatum.children && nodeDatum.children.length > 0)
    // console.log(nodeDatum)
    // console.log(rd3tProps)

    // console.log(rd3tProps)
    return (
      // className={!nodeDatum.show ? styles.hideNode : ''}
      <g>
        <foreignObject
          transform={`translate(-72, -138)`}
          width="100%"
          height="100%"
        >
          <div
            className={styles.treeNodeBox}
            onClick={() => {
              console.log(nodeDatum)
              addChildren([{ name: 'AddChild' }])
            }}
          >
            <div className={styles.aboveContent}>
              <Tooltip title={nodeDatum.department}>
                <div className={styles.aboveContentAbove}>
                  {nodeDatum.department}
                </div>
              </Tooltip>

              <div className={styles.aboveContentBelow}>
                {nodeDatum.leaveMount}
                {`(${nodeDatum.leaveRate})`}
              </div>
            </div>
            <div className={styles.belowContent}>
              <div className={styles.belowContentAbove}>{nodeDatum.name}</div>
              <div className={styles.belowContentBelow}>{nodeDatum.level}</div>
            </div>
          </div>
        </foreignObject>
        {!isLeaf && (
          <g onClick={toggleNode}>
            <circle r={12} fill="white" stroke="#F26060" strokeWidth={2} />
            <path
              d={nodeDatum.__rd3t.collapsed ? plusPath(12) : minusPath(12)}
              stroke="#F26060"
              strokeWidth={2}
            />
          </g>
        )}
      </g>
    )
  }

  const customPathFunc = (linkDatum: any) => {
    const { source, target } = linkDatum
    const leafSubLength = target.height === 0 ? 16 : 0
    const additionalBelowLength = 30 // 节点下方垂直线增加的长度
    console.log(linkDatum)
    // const

    // 检查源节点和目标节点的位置

    // 绘制连接线
    return `M${source.x},${source.y + 15}H${target.x}V${target.y - leafSubLength}`
  }

  return (
    <div className={styles.treeContainer} ref={containerRef}>
      <Tree
        data={departmentTree}
        // initialDepth={1}
        orientation="vertical"
        translate={translate}
        pathFunc={customPathFunc}
        // pathFunc="step"
        separation={{ siblings: 1.5, nonSiblings: 1.5 }}
        // nodeSize={{ x: 144, y: 170 }}
        depthFactor={180}
        // centeringTransitionDuration={500}
        enableLegacyTransitions={true}
        transitionDuration={500}
        renderCustomNodeElement={renderCustomNodeElement}
      />
    </div>
  )
}

export default DepartmentTreeChart
