import { SEOHead } from '@/components/SEOHead'
import s from './LegalPage.module.css'

export default function TermsPage() {
  return (
    <>
      <SEOHead
        title="Terms of Service – Calculator"
        description="Terms of Service for Calculator.com. Read our terms and conditions before using our free online calculators."
        canonical="/terms"
      />
      <div className={s.page}>
        <div className={`container ${s.wrap}`}>
          <h1 className={s.h1}>Terms of Service</h1>
          <p className={s.updated}>Last updated: January 1, 2025</p>

          <div className={s.content}>
            <h2>1. Acceptance of Terms</h2>
            <p>By accessing and using Calculator ("the Site"), you accept and agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use the Site.</p>

            <h2>2. Description of Service</h2>
            <p>Calculator provides free online calculators for educational and informational purposes, including tools for finance, real estate, mathematics, and business calculations. All calculators run in your browser and do not transmit your data to our servers.</p>

            <h2>3. Disclaimer of Warranties</h2>
            <p>THE SITE AND ALL CALCULATORS ARE PROVIDED "AS IS" WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED. We do not warrant that:</p>
            <ul>
              <li>The calculators will be error-free or produce accurate results for all inputs</li>
              <li>The site will be available continuously or without interruption</li>
              <li>Results are appropriate for your specific financial, legal, or professional situation</li>
            </ul>
            <p>Calculator results are estimates based on the inputs provided and standard mathematical formulas. Actual results may vary due to factors not accounted for in the calculations.</p>

            <h2>4. Not Professional Advice</h2>
            <p><strong>IMPORTANT:</strong> The calculators and information on this site are for general informational and educational purposes only. Nothing on this site constitutes financial, investment, legal, tax, accounting, real estate, or professional advice of any kind.</p>
            <p>Before making any financial decision — including taking out a loan, investing, purchasing property, or planning for retirement — you should consult with a qualified professional such as a licensed financial advisor, accountant, attorney, or real estate agent who can review your specific situation.</p>

            <h2>5. Limitation of Liability</h2>
            <p>TO THE MAXIMUM EXTENT PERMITTED BY LAW, CALCULATOR AND ITS OPERATORS SHALL NOT BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR EXEMPLARY DAMAGES arising from your use of or reliance on the Site or calculator results, including but not limited to financial losses, lost profits, or decisions made based on calculator outputs.</p>

            <h2>6. Accuracy of Information</h2>
            <p>We strive to ensure our calculators use accurate formulas and current information (such as tax rates and fee structures). However, tax laws, interest rates, fees, and regulations change frequently. Always verify critical information with official sources or qualified professionals before making decisions.</p>

            <h2>7. Intellectual Property</h2>
            <p>All content on this site, including calculator code, design, text, and graphics, is owned by or licensed to Calculator and is protected by copyright and other intellectual property laws. You may not reproduce, distribute, or create derivative works without our express written permission.</p>
            <p>You may use individual calculator results for personal, non-commercial purposes.</p>

            <h2>8. Prohibited Uses</h2>
            <p>You agree not to:</p>
            <ul>
              <li>Use the site for any unlawful purpose</li>
              <li>Attempt to gain unauthorized access to our systems</li>
              <li>Scrape, crawl, or systematically download site content</li>
              <li>Transmit malware, viruses, or harmful code</li>
              <li>Misrepresent calculator results or attribute inaccuracies to us</li>
            </ul>

            <h2>9. Third-Party Advertising</h2>
            <p>This site displays advertisements served by Google AdSense and other advertising networks. We are not responsible for the content of third-party advertisements. Clicking on ads may take you to third-party sites governed by their own terms and privacy policies.</p>

            <h2>10. Links to Third-Party Sites</h2>
            <p>Our site may contain links to third-party websites. These links are provided for convenience only. We have no control over the content of those sites and accept no responsibility for them or for any loss or damage that may arise from your use of them.</p>

            <h2>11. Changes to Terms</h2>
            <p>We reserve the right to modify these Terms of Service at any time. Changes will be effective immediately upon posting to the site. Your continued use of the site constitutes acceptance of the modified terms.</p>

            <h2>12. Governing Law</h2>
            <p>These Terms of Service shall be governed by and construed in accordance with applicable law. Any disputes shall be resolved in the appropriate courts.</p>

            <h2>13. Contact Us</h2>
            <p>If you have questions about these Terms of Service, please contact us at:</p>
            <p><strong>Email:</strong> legal@yourcalculator.com<br />
            <strong>Website:</strong> https://www.yourcalculator.com</p>
          </div>
        </div>
      </div>
    </>
  )
}