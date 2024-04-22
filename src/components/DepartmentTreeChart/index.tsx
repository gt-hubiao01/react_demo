import { useEffect, useState, useRef } from 'react'
import styles from './index.module.less'
import Tree from 'react-d3-tree'
import { getInitialTree } from './utils'
import { Tooltip } from 'antd'

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
    const { nodeDatum, toggleNode } = rd3tProps

    const isLeaf = !(nodeDatum.children && nodeDatum.children.length > 0)
    console.log(nodeDatum)

    // console.log(rd3tProps)
    return (
      // className={!nodeDatum.show ? styles.hideNode : ''}
      <g>
        <foreignObject
          x={-72}
          y={isLeaf ? -122 : -138}
          width="100%"
          height="100%"
        >
          <div
            className={styles.treeNodeBox}
            onClick={() => {
              console.log(nodeDatum)
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
              d={nodeDatum.collapsed ? plusPath(12) : minusPath(12)}
              stroke="#F26060"
              strokeWidth={2}
            />
          </g>
        )}
      </g>
    )
  }

  return (
    <div className={styles.treeContainer} ref={containerRef}>
      <Tree
        data={departmentTree}
        // initialDepth={1}
        orientation="vertical"
        translate={translate}
        pathFunc="step"
        separation={{ siblings: 1.5, nonSiblings: 1.5 }}
        nodeSize={{ x: 144, y: 170 }}
        // centeringTransitionDuration={500}
        enableLegacyTransitions={true}
        transitionDuration={500}
        renderCustomNodeElement={renderCustomNodeElement}
      />
    </div>
  )
}

export default DepartmentTreeChart
