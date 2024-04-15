import styles from './index.module.less'
import { Button } from 'antd'
import { useNavigate } from 'react-router-dom'

function HomePage() {
  const navigate = useNavigate()

  return (
    <div className={styles.homePageContainer}>
      <Button type="primary" onClick={() => navigate('/echarts')}>
        Echarts Demo
      </Button>
    </div>
  )
}

export default HomePage
