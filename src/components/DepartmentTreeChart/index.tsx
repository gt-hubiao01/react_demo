import { useEffect, useState, useRef } from 'react'
import styles from './index.module.less'
import Tree from 'react-d3-tree'

const orgChart = {
  name: 'CEO',
  children: [
    {
      name: 'Manager',
      attributes: {
        department: 'Production',
      },
      children: [
        {
          name: 'Foreman',
          attributes: {
            department: 'Fabrication',
          },
          children: [
            {
              name: 'Worker',
            },
          ],
        },
        {
          name: 'Foreman',
          attributes: {
            department: 'Assembly',
          },
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

  useEffect(() => {
    if (containerRef.current) {
      const { width } = containerRef.current.getBoundingClientRect()
      setTransLate({ x: width / 2, y: 50 })
    }
  }, [])

  return (
    <div className={styles.treeContainer} ref={containerRef}>
      <Tree
        data={orgChart}
        initialDepth={3}
        orientation="vertical"
        translate={translate}
      />
    </div>
  )
}

export default DepartmentTreeChart
