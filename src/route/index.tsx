import HomePage from '@/pages/HomePage'
import EchartsDemo from '@/pages/EchartsDemo'
import TreeChartDemo from '@/pages/TreeChartDemo'
import ThreeJsDemo from '@/pages/ThreeJsDemo'
import TfjsDemo from '@/pages/TfjsDemo'
import Demo from '@/pages/Demo'

type RouteType = {
  path: string
  component: React.ReactNode
  name?: string
}

const route: RouteType[] = [
  {
    path: '/',
    component: <HomePage />,
  },
  {
    path: '/echarts',
    component: <EchartsDemo />,
  },
  {
    path: '/treeChart',
    component: <TreeChartDemo />,
  },
  {
    path: '/threejs',
    component: <ThreeJsDemo />,
  },
  {
    path: '/tfjs',
    component: <TfjsDemo />,
  },
  {
    path: '/demo',
    component: <Demo />,
  },
]

export default route