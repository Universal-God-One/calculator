import { Link } from 'react-router-dom'
import { SEOHead } from '@/components/SEOHead'
import s from './CategoryPage.module.css'

const MATH_TOOLS = [
  {
    group: 'Arithmetic',
    tools: [
      { name: 'Percentage Calculator', path: '/math/percentage-calculator', desc: 'What is X% of Y? Percentage change and more' },
      { name: 'Fraction Calculator', path: '/math/fraction-calculator', desc: 'Add, subtract, multiply, divide fractions with steps' },
      { name: 'Long Division Calculator', path: '/math/long-division-calculator', desc: 'Step-by-step DMSB division with decimals' },
    ],
  },
  {
    group: 'Algebra',
    tools: [
      { name: 'Quadratic Formula Calculator', path: '/math/quadratic-formula-calculator', desc: 'Solve ax² + bx + c = 0, real and complex roots' },
      { name: 'Log Calculator', path: '/math/log-calculator', desc: 'Logarithms, antilog, log laws, and graph' },
      { name: 'Matrix Calculator', path: '/math/matrix-calculator', desc: 'Add, multiply, determinant, inverse, and properties' },
    ],
  },
  {
    group: 'Geometry',
    tools: [
      { name: 'Triangle Calculator', path: '/math/triangle-calculator', desc: 'Solve any triangle using SSS, SAS, ASA, AAS, SSA' },
    ],
  },
  {
    group: 'Statistics',
    tools: [
      { name: 'Standard Deviation Calculator', path: '/math/standard-deviation-calculator', desc: 'Mean, median, variance, std dev, and box plot' },
      { name: 'Statistics Calculator', path: '/math/statistics-calculator', desc: 'Full descriptive stats — skewness, kurtosis, outliers' },
      { name: 'Probability Calculator', path: '/math/probability-calculator', desc: 'Binomial, normal distribution, combinations & permutations' },
      { name: 'Z-Score Calculator', path: '/math/z-score-calculator', desc: 'Z-scores, cumulative probability, and z-table' },
    ],
  },
  {
    group: 'Tools',
    tools: [
      { name: 'Scientific Calculator', path: '/math/scientific-calculator', desc: 'Full scientific calc with trig, log, memory, and history' },
    ],
  },
]

export default function MathPage() {
  return (
    <>
      <SEOHead
        title="Math Calculators – Algebra, Statistics, Geometry & More"
        description="Free math calculators for percentages, fractions, quadratic equations, logarithms, matrices, triangles, statistics, probability, and more."
        canonical="/math"
      />
      <div className={s.page}>
        <div className={`container ${s.wrap}`}>
          <div className={s.hero}>
            <p className={s.crumb}>◈ Math</p>
            <h1 className={s.h1}>Math Calculators</h1>
            <p className={s.sub}>12 free math calculators covering arithmetic, algebra, geometry, and statistics.</p>
          </div>

          {MATH_TOOLS.map(group => (
            <section key={group.group} className={s.group}>
              <h2 className={s.groupTitle}>{group.group}</h2>
              <div className={s.grid}>
                {group.tools.map(tool => (
                  <Link key={tool.path} to={tool.path} className={s.card}>
                    <span className={s.cardName}>{tool.name}</span>
                    <span className={s.cardDesc}>{tool.desc}</span>
                    <span className={s.cardArrow}>→</span>
                  </Link>
                ))}
              </div>
            </section>
          ))}
        </div>
      </div>
    </>
  )
}