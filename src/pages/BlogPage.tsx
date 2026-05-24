import { Link } from 'react-router-dom'
import { SEOHead } from '@/components/SEOHead'
import { BLOG_POSTS } from '@/data/blogPosts'
import s from './BlogPage.module.css'

const CATEGORY_COLORS: Record<string, string> = {
  Finance: '#3b82f6',
  'Real Estate': '#10b981',
  Math: '#f59e0b',
  Business: '#8b5cf6',
}

export default function BlogPage() {
  return (
    <>
      <SEOHead
        title="Calculator Blog – Financial Tips, Math Guides & More"
        description="Free guides on personal finance, mortgage calculations, budgeting, freelancing, and business metrics. Practical articles with real examples."
        canonical="/blog"
      />
      <div className={s.page}>
        <div className={`container ${s.wrap}`}>
          <div className={s.hero}>
            <p className={s.crumb}>◈ Blog</p>
            <h1 className={s.h1}>Guides & Articles</h1>
            <p className={s.sub}>Practical guides on finance, real estate, math, and business — with real examples and free calculators.</p>
          </div>

          <div className={s.grid}>
            {BLOG_POSTS.map(post => (
              <Link key={post.slug} to={`/blog/${post.slug}`} className={s.card}>
                <div className={s.cardTop}>
                  <span className={s.category}
                    style={{ color: CATEGORY_COLORS[post.category] ?? 'var(--accent-glow)' }}>
                    {post.category}
                  </span>
                  <span className={s.readTime}>{post.readTime}</span>
                </div>
                <h2 className={s.cardTitle}>{post.title}</h2>
                <p className={s.cardDesc}>{post.description}</p>
                <div className={s.cardFooter}>
                  <span className={s.date}>{post.date}</span>
                  <span className={s.readMore}>Read more →</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </>
  )
}