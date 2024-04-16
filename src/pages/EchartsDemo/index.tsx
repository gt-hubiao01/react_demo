import styles from './index.module.less'
import Bar from '@/components/charts/Bar'

function EchartsDemo() {
  return (
    <div className={styles.chartsContainer}>
      <Bar
        id="barChartDemo"
        loading={false}
        data={[{ label: '123', value: '123' }]}
      />
    </div>
  )
}

export default EchartsDemo
