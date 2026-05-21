import { ReactNode, useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import s from './Layout.module.css'

const NAV = [
  { label: 'Finance', path: '/finance' },
  { label: 'Real Estate', path: '/real-estate' },
  { label: 'Math', path: '/math' },
  { label: 'Business', path: '/business' },
]

export function Layout({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false)

  return (
    <div className={s.root}>
      <header className={s.header}>
        <div className={`container ${s.bar}`}>
          <Link to="/" className={s.logo}>
            <span className={s.logoMark}>◈</span>
            <span className={s.logoText}>Calculator</span>
          </Link>

          <nav className={s.nav}>
            {NAV.map(n => (
              <NavLink key={n.path} to={n.path}
                className={({ isActive }) => `${s.link} ${isActive ? s.active : ''}`}>
                {n.label}
              </NavLink>
            ))}
          </nav>

          <button className={s.burger} onClick={() => setOpen(o => !o)} aria-label="Menu">
            <span /><span /><span />
          </button>
        </div>

        {open && (
          <div className={s.mobileNav}>
            {NAV.map(n => (
              <NavLink key={n.path} to={n.path} className={s.mobileLink}
                onClick={() => setOpen(false)}>
                {n.label}
              </NavLink>
            ))}
          </div>
        )}
      </header>

      <main className={s.main}>{children}</main>

      <footer className={s.footer}>
        <div className={`container ${s.footerInner}`}>
          <p className={s.footerLogo}>◈ Calculator</p>
          <p className={s.footerSub}>Free calculators for finance, real estate, math & business.</p>
          <p className={s.footerDisclaimer}>
            Results are for informational purposes only. Always consult a qualified
            professional for financial, legal, or real estate decisions.
          </p>
          <div className={s.footerLinks}>
            <Link to="/finance">Finance</Link>
            <Link to="/real-estate">Real Estate</Link>
            <Link to="/math">Math</Link>
            <Link to="/business">Business</Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
