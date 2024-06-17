import { useEffect } from 'react'
import { createWorld } from './components/test_demo'

export default function ThreeJsDemo() {
  useEffect(() => {
    createWorld()
  }, [])

  return <div id="retina"></div>
}
