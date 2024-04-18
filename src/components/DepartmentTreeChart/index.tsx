import { useEffect, useState, useRef } from 'react'
import styles from './index.module.less'
import Tree from 'react-d3-tree'
import { MinusIcon } from './icons'
import { getInitialTree } from './utils'

const orgChart = {
  name: '伍新春',
  level: 'M8',
  department: '效能效率中心',
  leaveRate: '10.78%',
  leaveMount: 12345,
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

  const renderCustomNodeElement = (rd3tProps: any) => {
    const { nodeDatum, toggleNode } = rd3tProps
    return (
      <>
        {nodeDatum.collapsed ? (
          <foreignObject x="-6.5" y="0" width="100%" height="100%">
            <div onClick={() => console.log('222')}>123423432dasdasdasd</div>
            <div
              onClick={() => {
                console.log('222')
                toggleNode()
                // setDepartmentTree((pre) => {
                //   return getCollapsedTree(pre, nodeDatum.name)
                // })
              }}
            >
              {/* <PlusIcon /> */}
            </div>
          </foreignObject>
        ) : (
          <foreignObject x="-6.5" y="0" width="100%" height="100%">
            <div>
              <MinusIcon />
            </div>
          </foreignObject>
        )}
        <g
          style={{
            transform: 'translate(-72px, -61px)',
            width: '144px',
            height: '122px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: 'red',
          }}
        >
          <foreignObject x="0" y="0" width="100%" height="100%">
            <div onClick={() => console.log(333)}>23123123</div>
          </foreignObject>

          <text fill="black" strokeWidth="1" x="20">
            {nodeDatum.name}
          </text>
          {nodeDatum.attributes?.department && (
            <text fill="black" x="20" dy="20" strokeWidth="1">
              Department: {nodeDatum.attributes?.department}
            </text>
          )}
        </g>
      </>
    )
  }

  return (
    <div className={styles.treeContainer} ref={containerRef}>
      <Tree
        data={departmentTree}
        initialDepth={1}
        orientation="vertical"
        translate={translate}
        pathFunc="step"
        renderCustomNodeElement={renderCustomNodeElement}
      />
    </div>
  )
}

export default DepartmentTreeChart
