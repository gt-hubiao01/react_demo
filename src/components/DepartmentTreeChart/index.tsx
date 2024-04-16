import styles from './index.module.less'
import Tree from 'react-d3-tree'

function DepartmentTreeChart() {
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

  return (
    <div className={styles.treeContainer}>
      <Tree data={orgChart} />
    </div>
  )
}

export default DepartmentTreeChart
