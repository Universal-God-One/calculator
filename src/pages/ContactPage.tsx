import { SEOHead } from '@/components/SEOHead'
import s from './LegalPage.module.css'

export default function ContactPage() {
  return (
    <>
      <SEOHead
        title="Contact – Calculator"
        description="Contact the Calculator team. Report bugs, suggest new calculators, or ask questions."
        canonical="/contact"
      />
      <div className={s.page}>
        <div className={`container ${s.wrap}`}>
          <h1 className={s.h1}>Contact Us</h1>

          <div className={s.content}>
            <p className={s.lead}>Have a question, found a bug, or want to suggest a new calculator? We'd love to hear from you.</p>

            <h2>General Inquiries</h2>
            <p>For general questions about our calculators or website:</p>
            <p><strong>Email:</strong> <a href="mailto:hello@yourcalculator.com">hello@yourcalculator.com</a></p>

            <h2>Report a Bug</h2>
            <p>If a calculator is producing incorrect results or something isn't working, please let us know. Include:</p>
            <ul>
              <li>Which calculator (e.g. "Mortgage Calculator")</li>
              <li>The values you entered</li>
              <li>The result you got vs what you expected</li>
              <li>Your browser and device</li>
            </ul>
            <p><strong>Email:</strong> <a href="mailto:bugs@yourcalculator.com">bugs@yourcalculator.com</a></p>

            <h2>Suggest a Calculator</h2>
            <p>Don't see a calculator you need? We're always adding new tools. Send us your suggestion and we'll consider it for a future update.</p>
            <p><strong>Email:</strong> <a href="mailto:suggest@yourcalculator.com">suggest@yourcalculator.com</a></p>

            <h2>Business & Advertising</h2>
            <p>For advertising inquiries or business partnerships:</p>
            <p><strong>Email:</strong> <a href="mailto:business@yourcalculator.com">business@yourcalculator.com</a></p>

            <h2>Privacy & Legal</h2>
            <p>For privacy-related requests or legal inquiries:</p>
            <p><strong>Email:</strong> <a href="mailto:privacy@yourcalculator.com">privacy@yourcalculator.com</a></p>

            <div className={s.responseNote}>
              <strong>Response time:</strong> We typically respond within 2–3 business days.
            </div>
          </div>
        </div>
      </div>
    </>
  )
}