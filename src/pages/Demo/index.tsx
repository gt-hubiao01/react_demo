import { generateAvatar } from '@/utils/generateAvatar'
import { useEffect, useState } from 'react'

export default function Demo() {
  const [avatar, setAvatar] = useState<string>('')

  useEffect(() => {
    const avatar = generateAvatar('企')
    setAvatar(avatar)
  }, [])


  return (
    <>
      <h1>这是Demo</h1>
      <img src={avatar} alt="" />
    </>
  )
}
