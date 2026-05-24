import { Link, useLocation } from 'react-router-dom'
import s from './ComingSoon.module.css'

export default function ComingSoon() {
  const { pathname } = useLocation()
  const name = pathname.split('/').pop()?.replace(/-/g, ' ') ?? 'Calculator'
  const title = name.replace(/\b\w/g, c => c.toUpperCase())

  return (
    <div className={s.page}>
      <span className={s.tag}>Coming Soon</span>
      <h1 className={s.title}>{title}</h1>
      <p className={s.sub}>This calculator is on our roadmap and will be live shortly.</p>
      <Link to="/" className={s.back}>← Back to all calculators</Link>
    </div>
  )
}