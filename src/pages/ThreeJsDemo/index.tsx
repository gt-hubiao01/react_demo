import { useEffect } from 'react'
import { createGalaxy } from './components/galaxy'

export default function ThreeJsDemo() {
  useEffect(() => {
    createGalaxy()
  }, [])

  return <div id="app"></div>
}
