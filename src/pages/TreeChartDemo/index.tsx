import styles from './index.module.less'
import DepartmentTreeChart from '@/components/DepartmentTreeChart'

function EchartsDemo() {
  return (
    <div className={styles.treeContainer}>
      <DepartmentTreeChart />
    </div>
  )
}

export default EchartsDemo
