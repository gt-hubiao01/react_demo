import styles from './index.module.less'
import { Button } from 'antd'
import { useNavigate } from 'react-router-dom'
import route from '@/route'

function HomePage() {
  const navigate = useNavigate()

  const newRoute = route.filter((item) => item.path !== '/')

  return (
    <div className={styles.homePageContainer}>
      {newRoute.map((item) => (
        <Button
          key={item.path}
          type="primary"
          onClick={() => navigate(item.path)}
        >
          {item.name || item.path.replace('/', '')}
        </Button>
      ))}
    </div>
  )
}

export default HomePage
