export interface BlogPost {
  slug: string
  title: string
  description: string
  category: string
  date: string
  readTime: string
  content: string
}

export const BLOG_POSTS: BlogPost[] = [
  {
    slug: 'how-to-calculate-compound-interest',
    title: 'How to Calculate Compound Interest (With Examples)',
    description: 'Learn how compound interest works, the formula behind it, and how to calculate it manually or with our free calculator.',
    category: 'Finance',
    date: 'January 15, 2025',
    readTime: '6 min read',
    content: `
## What Is Compound Interest?

Compound interest is interest calculated on both the initial principal and the accumulated interest from previous periods. Unlike simple interest, which only earns interest on the original amount, compound interest earns interest on interest — which is why it's often called "the eighth wonder of the world."

## The Compound Interest Formula

The standard compound interest formula is:

**A = P(1 + r/n)^(nt)**

Where:
- **A** = Final amount (principal + interest)
- **P** = Principal (initial investment)
- **r** = Annual interest rate (as a decimal)
- **n** = Number of times interest compounds per year
- **t** = Time in years

## Example Calculation

Let's say you invest **$10,000** at **7% annual interest**, compounded **monthly**, for **20 years**.

- P = $10,000
- r = 0.07
- n = 12 (monthly)
- t = 20

**A = 10,000 × (1 + 0.07/12)^(12×20)**
**A = 10,000 × (1.005833)^240**
**A = 10,000 × 4.0387**
**A = $40,387**

Your $10,000 grew to $40,387 — a gain of $30,387, of which only $14,000 came from additional contributions (none in this case) and the rest from compounding.

## Compounding Frequency Matters

The more frequently interest compounds, the more you earn:

| Frequency | Final Amount (same example) |
|---|---|
| Annually | $38,697 |
| Quarterly | $40,064 |
| Monthly | $40,387 |
| Daily | $40,494 |

## The Rule of 72

Want a quick estimate of how long it takes to double your money? Divide 72 by your annual interest rate.

At 7% interest: 72 ÷ 7 = **~10.3 years** to double.
At 10% interest: 72 ÷ 10 = **7.2 years** to double.

## How to Use Our Compound Interest Calculator

Our [Compound Interest Calculator](/finance/compound-interest-calculator) lets you:
- Set any starting principal, rate, and time period
- Choose compounding frequency (daily, monthly, quarterly, annually)
- Add regular contributions
- See a year-by-year growth chart

The visual breakdown makes it easy to see how your money grows over time and how much of your final balance comes from interest vs. your own contributions.

## Key Takeaways

- Start early — time is the most powerful variable in compound interest
- Higher compounding frequency = slightly higher returns
- Even small differences in interest rate have a massive long-term impact
- Use our calculator to model your specific situation
    `,
  },
  {
    slug: 'debt-to-income-ratio-explained',
    title: 'Debt-to-Income Ratio Explained: What Lenders Look For',
    description: 'What is DTI ratio, how to calculate it, and what percentage lenders want to see before approving a mortgage or loan.',
    category: 'Real Estate',
    date: 'January 22, 2025',
    readTime: '5 min read',
    content: `
## What Is Debt-to-Income Ratio?

Your Debt-to-Income (DTI) ratio is one of the most important numbers lenders look at when you apply for a mortgage, car loan, or any major credit. It compares your total monthly debt payments to your gross monthly income.

**DTI = Total Monthly Debt Payments ÷ Gross Monthly Income × 100**

For example, if you earn $6,000/month and pay $2,000/month in debts, your DTI is 33%.

## Front-End vs. Back-End DTI

Lenders actually calculate two DTI ratios:

**Front-End DTI (Housing Ratio):** Only your housing costs (mortgage/rent, property taxes, homeowner's insurance, HOA fees) divided by income. Conventional loans prefer this below **28%**.

**Back-End DTI:** ALL monthly debts — housing plus car loans, student loans, credit card minimums, personal loans — divided by income. This is the number lenders focus on most.

## What DTI Do Lenders Require?

| Loan Type | Max Front-End | Max Back-End |
|---|---|---|
| Conventional | 28% | 36–43% |
| FHA | 31% | 43% |
| VA | No limit | 41% preferred |
| Jumbo | 28% | 36–43% |

## DTI Ratings

- **≤ 20%** — Excellent. You'll qualify for the best rates.
- **21–28%** — Good. Well within conventional mortgage limits.
- **29–36%** — Fair. Acceptable but leaves less room for surprises.
- **37–43%** — High. You may still qualify for FHA or VA loans.
- **> 43%** — Very High. Most lenders will decline or require compensating factors.

## What Counts as Debt?

Include these in your DTI calculation:
- Mortgage or rent payment
- Car loan payments
- Student loan minimum payments
- Credit card minimum payments
- Personal loan payments
- Child support or alimony

Do NOT include:
- Utilities (electric, gas, water)
- Groceries
- Insurance premiums
- Cell phone bills
- Streaming subscriptions

## How to Lower Your DTI

1. **Pay down debt** — Eliminating a car payment or credit card balance has immediate impact
2. **Increase income** — A raise, side job, or rental income all count
3. **Don't take on new debt** — Avoid new credit cards or loans before applying
4. **Pay off small debts first** — Clearing smaller balances reduces your monthly obligations fastest

## Calculate Your DTI

Use our [DTI Ratio Calculator](/business/dti-ratio-calculator) to enter your income and all monthly debts. It shows your front-end and back-end DTI, rates your result, and tells you exactly how much debt you can add before hitting lender limits.
    `,
  },
  {
    slug: '50-30-20-budget-rule',
    title: 'The 50/30/20 Budget Rule: A Simple Guide to Managing Money',
    description: 'How the 50/30/20 budgeting rule works, whether it fits your situation, and how to apply it to your monthly income.',
    category: 'Business',
    date: 'February 3, 2025',
    readTime: '5 min read',
    content: `
## What Is the 50/30/20 Rule?

The 50/30/20 rule is one of the most popular personal budgeting frameworks. Popularized by Senator Elizabeth Warren in her book "All Your Worth," it divides your after-tax income into three categories:

- **50% → Needs** (essential expenses)
- **30% → Wants** (discretionary spending)
- **20% → Savings & Debt Repayment**

It's simple enough to remember, flexible enough to adapt, and effective for most income levels.

## The Three Categories Explained

### 50% — Needs

Needs are expenses you can't avoid — the basics required to live and work:
- Housing (rent or mortgage)
- Utilities (electricity, water, gas, internet)
- Groceries and basic food
- Transportation (car payment, insurance, gas, public transit)
- Health insurance and essential medical costs
- Minimum debt payments

If your needs exceed 50%, you either need to cut expenses (move somewhere cheaper, get a cheaper car) or increase income.

### 30% — Wants

Wants are things you enjoy but don't strictly need:
- Dining out and coffee shops
- Entertainment (streaming, concerts, movies)
- Gym memberships
- Travel and vacations
- New clothes beyond basics
- Hobbies and subscriptions

This is your lifestyle spending — it's not bad, but it's the most flexible category.

### 20% — Savings & Debt Repayment

This 20% is what builds your financial future:
- Emergency fund (target: 3–6 months of expenses)
- 401(k) or IRA contributions
- Extra debt payments (above minimums)
- Investing
- Saving for a down payment or other goals

**Note:** Minimum debt payments go in "Needs." Only extra debt payments beyond minimums go in this 20%.

## Example: $5,000/Month After Tax

| Category | Percentage | Amount |
|---|---|---|
| Needs | 50% | $2,500 |
| Wants | 30% | $1,500 |
| Savings | 20% | $1,000 |

## Does the 50/30/20 Rule Work for Everyone?

Not always. In expensive cities, housing alone can consume 40–50% of take-home pay, leaving little room for the 50% needs target. If you're in this situation:

- Adjust to 60/20/20 or 70/10/20 temporarily
- Focus on the savings percentage as the non-negotiable
- Work on reducing needs over time (refinancing, moving, etc.)

The rule is a guideline, not a law. The key principle is to be intentional: allocate your money before you spend it.

## Alternatives to 50/30/20

- **70/20/10** — 70% living expenses, 20% savings, 10% giving/charity
- **80/20 (Pay Yourself First)** — Save 20% first automatically, spend the rest however
- **Zero-Based Budget** — Assign every dollar a job until income minus expenses = $0

## Try Our Budget Calculator

Our [Budget Allocation Calculator](/business/budget-allocation-calculator) lets you enter your monthly income and automatically calculates each category. You can use the 50/30/20 preset or customize your own percentages and see the breakdown in a pie chart.
    `,
  },
  {
    slug: 'ltv-cac-ratio-saas',
    title: 'LTV:CAC Ratio: The SaaS Metric Every Founder Needs to Know',
    description: 'What LTV:CAC ratio means, how to calculate it, what a healthy ratio looks like, and how to improve your unit economics.',
    category: 'Business',
    date: 'February 14, 2025',
    readTime: '7 min read',
    content: `
## What Is LTV:CAC Ratio?

The LTV:CAC ratio compares the **lifetime value of a customer (LTV)** to the **cost to acquire that customer (CAC)**. It's the single most important unit economics metric for subscription and SaaS businesses.

**LTV:CAC Ratio = Customer Lifetime Value ÷ Customer Acquisition Cost**

A ratio of 3:1 means you generate $3 of value for every $1 spent acquiring customers — the industry benchmark for healthy SaaS businesses.

## How to Calculate LTV

For subscription businesses, the standard LTV formula is:

**LTV = (Average Monthly Revenue per Customer × Gross Margin %) ÷ Monthly Churn Rate**

Example:
- ARPU = $100/month
- Gross margin = 80%
- Monthly churn = 2%

**LTV = ($100 × 0.80) ÷ 0.02 = $80 ÷ 0.02 = $4,000**

## How to Calculate CAC

**CAC = Total Sales & Marketing Spend ÷ New Customers Acquired**

If you spent $50,000 last month on sales and marketing and acquired 100 new customers:

**CAC = $50,000 ÷ 100 = $500**

## Interpreting Your LTV:CAC Ratio

| Ratio | Interpretation |
|---|---|
| < 1:1 | You lose money on every customer |
| 1–2:1 | Barely recovering acquisition costs |
| 3:1 | SaaS benchmark — sustainable growth |
| 5:1+ | Excellent — may be underinvesting in growth |

At 3:1, your $4,000 LTV vs $500 CAC gives you a ratio of 8:1 — excellent.

## CAC Payback Period

The CAC payback period tells you how long it takes to recover acquisition costs:

**Payback = CAC ÷ (Monthly Revenue × Gross Margin)**

With $500 CAC, $100/month ARPU, and 80% gross margin:

**Payback = $500 ÷ ($100 × 0.80) = $500 ÷ $80 = 6.25 months**

Under 12 months is considered good; under 6 months is excellent.

## Why Churn Is the Most Powerful Lever

A small reduction in churn has a massive impact on LTV. Compare:

| Monthly Churn | Customer Lifetime | LTV (at $80 monthly contribution) |
|---|---|---|
| 5% | 20 months | $1,600 |
| 3% | 33 months | $2,667 |
| 2% | 50 months | $4,000 |
| 1% | 100 months | $8,000 |

Cutting churn from 5% to 2% **2.5x's your LTV** without changing anything else.

## How to Improve LTV:CAC

**Increase LTV:**
- Reduce churn through better onboarding and customer success
- Expand revenue with upsells and cross-sells
- Increase prices (even 10–20% can dramatically improve LTV)

**Reduce CAC:**
- Improve lead conversion rates
- Double down on highest-ROI acquisition channels
- Implement referral programs (lower-cost acquisition)
- Improve sales efficiency and cycle time

## Industry Benchmarks

- **Enterprise SaaS:** 5–8x ratio, 18–36 month payback
- **SMB SaaS:** 3–5x ratio, 12–18 month payback
- **E-commerce:** 3–4x ratio, 6–12 month payback

## Calculate Yours

Use our [LTV to CAC Calculator](/business/ltv-cac-calculator) to input your ARPU, gross margin, churn rate, and CAC. It calculates your ratio, rates it against benchmarks, shows the payback curve, and tells you how much LTV you need to hit a 3x ratio.
    `,
  },
  {
    slug: 'mortgage-calculator-guide',
    title: 'How to Use a Mortgage Calculator: Everything You Need to Know',
    description: 'A complete guide to understanding mortgage calculations — monthly payments, amortization, total interest, and what factors affect your payment.',
    category: 'Real Estate',
    date: 'February 28, 2025',
    readTime: '8 min read',
    content: `
## What Does a Mortgage Calculator Tell You?

A mortgage calculator helps you estimate your monthly payment and understand the total cost of a home loan. The key outputs are:

- **Monthly payment** (principal + interest)
- **Total interest paid** over the life of the loan
- **Amortization schedule** — how each payment splits between principal and interest
- **Total cost** (purchase price + all interest)

## The Mortgage Payment Formula

Monthly payment is calculated using this formula:

**M = P[r(1+r)^n] / [(1+r)^n - 1]**

Where:
- **M** = Monthly payment
- **P** = Loan principal (home price minus down payment)
- **r** = Monthly interest rate (annual rate ÷ 12)
- **n** = Total number of payments (loan term in months)

## Example Calculation

$400,000 home, 20% down payment, 7% interest rate, 30-year term:

- Loan amount: $320,000
- Monthly rate: 7% ÷ 12 = 0.5833%
- Payments: 30 × 12 = 360

**Monthly P&I = $2,129**

Over 30 years, you'd pay $456,440 in total — meaning $136,440 in interest on a $320,000 loan.

## What's NOT Included in the Basic Payment

The P&I payment is just principal and interest. Your actual monthly housing cost also includes:

- **Property taxes** — Typically 0.5–2% of home value annually, escrowed monthly
- **Homeowner's insurance** — ~$150–300/month
- **PMI** — Required if down payment < 20%, typically 0.5–1.5% of loan annually
- **HOA fees** — If applicable, $50–500+/month

Our [Mortgage Calculator](/real-estate/mortgage-calculator) includes all of these for a complete picture.

## How Different Factors Affect Your Payment

### Loan Amount
Every $10,000 more borrowed ≈ $67/month more at 7%.

### Interest Rate
The difference between 6.5% and 7.5% on a $300,000 loan is about $180/month — and $64,800 over 30 years.

### Loan Term
- **30-year:** Lower monthly payment, much more total interest
- **15-year:** Higher monthly payment (~40% more), roughly half the total interest

| Term | Monthly Payment | Total Interest |
|---|---|---|
| 30-year at 7% | $2,129 | $136,440 |
| 15-year at 7% | $2,877 | $37,886 |

The 15-year saves $98,554 in interest, but your payment is $748/month higher.

### Down Payment
A larger down payment means:
- Smaller loan (lower payments)
- No PMI if you reach 20%
- Lower interest rate sometimes

## Fixed vs. Adjustable Rate

- **Fixed rate:** Same rate for the entire loan term. Predictable, no surprise increases.
- **ARM (adjustable):** Lower initial rate, then adjusts periodically. Can save money if you sell before adjustments kick in, but risky if rates rise.

Most buyers today choose fixed rates for security.

## Amortization: Why Early Payments Are Mostly Interest

In the early years, most of your payment goes to interest:

- Month 1 on $320,000 at 7%: $1,867 interest, $262 principal
- Month 180 (year 15): $1,287 interest, $842 principal
- Month 360 (last payment): $12 interest, $2,117 principal

This is why extra principal payments in the early years have such a dramatic impact on total interest paid.

## Use Our Calculators

Start with our [Mortgage Calculator](/real-estate/mortgage-calculator) for your monthly payment, then check the [Amortization Calculator](/real-estate/amortization-calculator) for the full payment-by-payment breakdown. If you're deciding whether to buy, the [Rent vs Buy Calculator](/real-estate/rent-vs-buy-calculator) factors in opportunity cost, appreciation, and tax benefits.
    `,
  },
  {
    slug: 'freelance-hourly-rate-calculator',
    title: 'How to Set Your Freelance Hourly Rate (And Not Undercharge)',
    description: 'A step-by-step guide to calculating your minimum freelance rate based on income goals, expenses, taxes, and billable hours — with examples.',
    category: 'Business',
    date: 'March 10, 2025',
    readTime: '6 min read',
    content: `
## Why Most Freelancers Undercharge

Most freelancers set their rates by looking at what others charge or what feels "reasonable." The problem: they're not accounting for the full cost of self-employment — taxes, business expenses, non-billable time, and the lack of benefits.

The correct approach starts with your target income and works backward.

## Step 1: Define Your Income Target

Start with the annual take-home pay you need (or want). This is after-tax income — what actually lands in your bank account.

Example: **$80,000/year after tax**

## Step 2: Add Taxes

As a self-employed freelancer, you pay:
- **Self-employment tax:** ~15.3% (Social Security + Medicare)
- **Federal income tax:** Based on your bracket
- **State income tax:** Varies by state

For most freelancers in the US, setting aside **25–35%** for taxes is a reasonable rule of thumb.

At 30% tax rate, to net $80,000 you need to earn:
**$80,000 ÷ (1 - 0.30) = $114,286 gross**

So you need to generate ~$114,286 in revenue just to take home $80,000.

## Step 3: Add Business Expenses

Business expenses reduce your profit. Common freelancer expenses:
- Software subscriptions: $100–500/month
- Home office / co-working: $200–800/month
- Health insurance: $300–600/month
- Professional development: $500–2,000/year
- Marketing and advertising: varies
- Equipment and hardware: varies

Let's assume **$12,000/year** in total expenses.

**Total revenue needed = $114,286 + $12,000 = $126,286**

## Step 4: Calculate Billable Hours

You work 40 hours/week but not all hours are billable. Time spent on:
- Admin, invoicing, emails: 5–10 hrs/week
- Marketing, proposals: 3–8 hrs/week
- Professional development: 2–5 hrs/week
- Unpaid revisions: 2–5 hrs/week

Realistic billable percentage: **60–70%**

At 40 hrs/week × 48 weeks/year = 1,920 total hours.
At 65% utilization: **1,248 billable hours/year**

## Step 5: Calculate Your Minimum Rate

**Minimum hourly rate = Total revenue needed ÷ Billable hours**

**$126,286 ÷ 1,248 = $101/hour**

This is your break-even rate. Charge less and you can't meet your income goal.

## Step 6: Add a Profit Margin

A minimum rate leaves no room for slow months, unexpected expenses, or business growth. Add 20–30% profit margin:

**$101 × 1.25 = $126/hour recommended rate**

## Sanity Check Against the Market

Now compare your rate to what the market pays for your role. If market rate for your skill is:
- **$75–150/hour** → Your $126 is right in range ✓
- **$50–80/hour** → You may need to specialize, increase skill, or reduce expenses
- **$200–300/hour** → You may be undercharging even at $126

## Project-Based Pricing

Many experienced freelancers move to project pricing. To quote a project:
1. Estimate hours needed
2. Multiply by your hourly rate
3. Add a buffer (20–30%) for scope creep
4. Present as a flat project fee

A 40-hour project at $126/hr = $5,040 + 25% buffer = **$6,300 project fee**

## Use Our Calculator

Our [Billable Rate Calculator](/business/billable-rate-calculator) does all of this automatically. Enter your income target, working hours, utilization rate, expenses, and tax rate — and it gives you your minimum and recommended rate, plus a project quote reference table.

Stop guessing. Calculate your rate from the numbers.
    `,
  },
]