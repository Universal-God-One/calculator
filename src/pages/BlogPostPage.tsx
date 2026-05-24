import { useParams, Link, Navigate } from 'react-router-dom'
import { SEOHead } from '@/components/SEOHead'
import { AdBanner } from '@/components/AdUnit'
import { BLOG_POSTS } from '@/data/blogPosts'
import s from './BlogPage.module.css'

const CATEGORY_COLORS: Record<string, string> = {
  Finance: '#3b82f6',
  'Real Estate': '#10b981',
  Math: '#f59e0b',
  Business: '#8b5cf6',
}

// Very simple markdown-like renderer
function renderContent(content: string) {
  const lines = content.trim().split('\n')
  const elements: React.ReactNode[] = []
  let i = 0

  while (i < lines.length) {
    const line = lines[i].trim()

    if (!line) { i++; continue }

    // H2
    if (line.startsWith('## ')) {
      elements.push(<h2 key={i} className={s.postH2}>{line.slice(3)}</h2>)
      i++; continue
    }
    // H3
    if (line.startsWith('### ')) {
      elements.push(<h3 key={i} className={s.postH3}>{line.slice(4)}</h3>)
      i++; continue
    }
    // Table
    if (line.startsWith('|')) {
      const tableLines: string[] = []
      while (i < lines.length && lines[i].trim().startsWith('|')) {
        tableLines.push(lines[i].trim())
        i++
      }
      const rows = tableLines.filter(l => !l.match(/^\|[-| ]+\|$/))
      const headers = rows[0].split('|').filter(Boolean).map(c => c.trim())
      const bodyRows = rows.slice(1)
      elements.push(
        <div key={`t${i}`} className={s.tableWrap}>
          <table className={s.table}>
            <thead><tr>{headers.map((h, j) => <th key={j}>{renderInline(h)}</th>)}</tr></thead>
            <tbody>
              {bodyRows.map((row, ri) => (
                <tr key={ri}>
                  {row.split('|').filter(Boolean).map((cell, ci) => (
                    <td key={ci}>{renderInline(cell.trim())}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )
      continue
    }
    // Unordered list
    if (line.startsWith('- ')) {
      const items: string[] = []
      while (i < lines.length && lines[i].trim().startsWith('- ')) {
        items.push(lines[i].trim().slice(2))
        i++
      }
      elements.push(<ul key={`ul${i}`} className={s.postUl}>{items.map((it, j) => <li key={j}>{renderInline(it)}</li>)}</ul>)
      continue
    }
    // Code block (bold formula line)
    if (line.startsWith('**') && line.endsWith('**') && !line.slice(2, -2).includes('**')) {
      elements.push(<div key={i} className={s.formula}>{line.slice(2, -2)}</div>)
      i++; continue
    }
    // Paragraph
    elements.push(<p key={i} className={s.postP}>{renderInline(line)}</p>)
    i++
  }
  return elements
}

function renderInline(text: string): React.ReactNode {
  // Handle **bold**, *italic*, [link](url)
  const parts = text.split(/(\*\*[^*]+\*\*|\*[^*]+\*|\[[^\]]+\]\([^)]+\))/g)
  return parts.map((part, i) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return <strong key={i}>{part.slice(2, -2)}</strong>
    }
    if (part.startsWith('*') && part.endsWith('*')) {
      return <em key={i}>{part.slice(1, -1)}</em>
    }
    const linkMatch = part.match(/^\[([^\]]+)\]\(([^)]+)\)$/)
    if (linkMatch) {
      const [, text, href] = linkMatch
      if (href.startsWith('/')) {
        return <Link key={i} to={href} className={s.inlineLink}>{text}</Link>
      }
      return <a key={i} href={href} target="_blank" rel="noopener noreferrer" className={s.inlineLink}>{text}</a>
    }
    return part
  })
}

export default function BlogPostPage() {
  const { slug } = useParams<{ slug: string }>()
  const post = BLOG_POSTS.find(p => p.slug === slug)

  if (!post) return <Navigate to="/blog" replace />

  const related = BLOG_POSTS.filter(p => p.slug !== slug && p.category === post.category).slice(0, 2)

  return (
    <>
      <SEOHead
        title={`${post.title} – Calculator Blog`}
        description={post.description}
        canonical={`/blog/${post.slug}`}
      />
      <div className={s.postPage}>
        <div className={`container ${s.postWrap}`}>

          {/* Breadcrumb */}
          <div className={s.breadcrumb}>
            <Link to="/">Home</Link>
            <span>›</span>
            <Link to="/blog">Blog</Link>
            <span>›</span>
            <span>{post.category}</span>
          </div>

          <div className={s.postHeader}>
            <span className={s.postCategory}
              style={{ color: CATEGORY_COLORS[post.category] ?? 'var(--accent-glow)' }}>
              {post.category}
            </span>
            <h1 className={s.postH1}>{post.title}</h1>
            <div className={s.postMeta}>
              <span>{post.date}</span>
              <span>·</span>
              <span>{post.readTime}</span>
            </div>
            <p className={s.postLead}>{post.description}</p>
          </div>

          <AdBanner slot="99000000001" />

          <div className={s.postContent}>
            {renderContent(post.content)}
          </div>

          <AdBanner slot="99000000002" />

          {related.length > 0 && (
            <div className={s.related}>
              <h2 className={s.relatedTitle}>Related Articles</h2>
              <div className={s.relatedGrid}>
                {related.map(p => (
                  <Link key={p.slug} to={`/blog/${p.slug}`} className={s.relatedCard}>
                    <span className={s.relatedCat} style={{ color: CATEGORY_COLORS[p.category] }}>{p.category}</span>
                    <span className={s.relatedTitle2}>{p.title}</span>
                    <span className={s.relatedRead}>{p.readTime}</span>
                  </Link>
                ))}
              </div>
            </div>
          )}

          <div className={s.backLink}>
            <Link to="/blog">← Back to all articles</Link>
          </div>
        </div>
      </div>
    </>
  )
}