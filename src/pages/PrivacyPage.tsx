import { SEOHead } from '@/components/SEOHead'
import s from './LegalPage.module.css'

export default function PrivacyPage() {
  return (
    <>
      <SEOHead
        title="Privacy Policy – Calculator"
        description="Privacy Policy for Calculator.com. Learn how we collect, use, and protect your information."
        canonical="/privacy"
      />
      <div className={s.page}>
        <div className={`container ${s.wrap}`}>
          <h1 className={s.h1}>Privacy Policy</h1>
          <p className={s.updated}>Last updated: January 1, 2025</p>

          <div className={s.content}>
            <h2>1. Introduction</h2>
            <p>Welcome to Calculator ("we," "our," or "us"). We respect your privacy and are committed to protecting any information you share with us. This Privacy Policy explains how we collect, use, and safeguard information when you visit our website.</p>

            <h2>2. Information We Collect</h2>
            <h3>Information You Provide</h3>
            <p>Our calculators run entirely in your browser. We do not store, transmit, or have access to the numbers or personal data you enter into any calculator on this site. All calculations are performed locally on your device.</p>

            <h3>Automatically Collected Information</h3>
            <p>Like most websites, we automatically collect certain information when you visit, including:</p>
            <ul>
              <li>IP address and general location (country/region)</li>
              <li>Browser type and version</li>
              <li>Pages visited and time spent on each page</li>
              <li>Referring website</li>
              <li>Device type (desktop, mobile, tablet)</li>
            </ul>
            <p>This information is collected through analytics tools and is used to understand how visitors use our site so we can improve it.</p>

            <h3>Cookies</h3>
            <p>We use cookies and similar tracking technologies to:</p>
            <ul>
              <li>Remember your preferences (such as selected currency)</li>
              <li>Analyze site traffic and usage patterns</li>
              <li>Serve relevant advertisements through Google AdSense</li>
            </ul>
            <p>You can control cookies through your browser settings. Disabling cookies may affect some site functionality.</p>

            <h2>3. Google AdSense</h2>
            <p>We use Google AdSense to display advertisements. Google uses cookies to serve ads based on your prior visits to our site and other sites on the internet. You can opt out of personalized advertising by visiting <a href="https://www.google.com/settings/ads" target="_blank" rel="noopener noreferrer">Google's Ad Settings</a>.</p>
            <p>Google's use of advertising cookies enables it and its partners to serve ads based on your visit to our site and/or other sites on the Internet. For more information, see Google's <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer">Privacy Policy</a>.</p>

            <h2>4. Google Analytics</h2>
            <p>We use Google Analytics to analyze website traffic. Google Analytics collects information such as how often users visit the site, what pages they visit, and what other sites they used prior to coming to our site. We use this information to improve our site. Google Analytics collects only the IP address assigned to you on the date you visit our site, not your name or other identifying information.</p>

            <h2>5. How We Use Your Information</h2>
            <p>We use the information we collect to:</p>
            <ul>
              <li>Operate and improve our website and calculators</li>
              <li>Analyze usage patterns to enhance user experience</li>
              <li>Display relevant advertisements</li>
              <li>Monitor for and prevent fraudulent or harmful activity</li>
              <li>Comply with legal obligations</li>
            </ul>

            <h2>6. Information Sharing</h2>
            <p>We do not sell, trade, or rent your personal information to third parties. We may share aggregated, non-personally identifiable information with partners and advertisers. We may disclose information if required by law or to protect our rights.</p>

            <h2>7. Data Retention</h2>
            <p>We retain analytics data for up to 26 months. Since we do not collect personal calculator inputs, there is no user-entered data to retain or delete.</p>

            <h2>8. Children's Privacy</h2>
            <p>Our website is not directed to children under the age of 13. We do not knowingly collect personal information from children under 13. If you believe we have inadvertently collected such information, please contact us immediately.</p>

            <h2>9. Your Rights</h2>
            <p>Depending on your location, you may have the right to:</p>
            <ul>
              <li>Access the personal information we hold about you</li>
              <li>Request correction of inaccurate data</li>
              <li>Request deletion of your data</li>
              <li>Opt out of data collection for advertising purposes</li>
              <li>Lodge a complaint with a supervisory authority</li>
            </ul>
            <p>To exercise these rights, contact us at the address below.</p>

            <h2>10. Third-Party Links</h2>
            <p>Our website may contain links to third-party websites. We are not responsible for the privacy practices of those sites and encourage you to review their privacy policies.</p>

            <h2>11. Changes to This Policy</h2>
            <p>We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new policy on this page and updating the "Last updated" date. Your continued use of the site after changes constitutes acceptance of the updated policy.</p>

            <h2>12. Contact Us</h2>
            <p>If you have questions or concerns about this Privacy Policy, please contact us at:</p>
            <p><strong>Email:</strong> privacy@yourcalculator.com<br />
            <strong>Website:</strong> https://www.yourcalculator.com</p>
          </div>
        </div>
      </div>
    </>
  )
}