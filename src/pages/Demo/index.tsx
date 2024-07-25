
import { Button } from 'antd';
import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const Item = () => {

  const {pathname} = useLocation()


  useEffect(() => {
    console.log('Item挂载')

    return () => {
      console.log('Item卸载')
    }
  },[pathname])

  return <div>这是Item</div>
}


export default () => {

  const navigate = useNavigate()

  return (
    <>
      <Item />

      <Button onClick={() => navigate('/demo?query=xxx')}>点击切换路由</Button>
    </>
  )
}
