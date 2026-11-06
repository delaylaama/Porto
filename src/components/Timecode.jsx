import { useState, useEffect } from 'react'

export default function Timecode() {
  const [timecode, setTimecode] = useState('01:24:18.00')

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date()
      const ms = String(Math.floor(now.getMilliseconds() / 10)).padStart(2, '0')
      const sec = String(now.getSeconds()).padStart(2, '0')
      const min = String(now.getMinutes()).padStart(2, '0')
      setTimecode(`01:${min}:${sec}.${ms}`)
    }, 100)

    return () => clearInterval(timer)
  }, [])

  return <span>{timecode}</span>
}
