"use client";

import { motion } from "framer-motion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const fadeIn = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5 }
};

const staggerChildren = {
  animate: {
    transition: {
      staggerChildren: 0.1
    }
  }
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen pt-16">
      <motion.div
        key="privacy-page"
        initial="initial"
        animate="animate"
        variants={staggerChildren}
      >
        <motion.section
          variants={staggerChildren}
          className="bg-muted/50 py-24"
        >
          <div className="container mx-auto px-4">
            <motion.div variants={fadeIn} className="max-w-3xl mx-auto text-center">
              <h1 className="text-4xl font-bold mb-6">Privacy Policy</h1>
              <p className="text-xl text-muted-foreground mb-8">
                Last updated: {new Date().toLocaleDateString()}
              </p>
              <p className="text-muted-foreground">
                Your privacy is important to us. This Privacy Policy explains how 404 Monetizer collects, uses, and protects your information when you use our services.
              </p>
            </motion.div>
          </div>
        </motion.section>

        <motion.section
          variants={staggerChildren}
          className="py-24"
        >
          <div className="container mx-auto px-4">
            <motion.div 
              variants={staggerChildren}
              className="max-w-4xl mx-auto space-y-8"
            >
              <motion.div variants={fadeIn}>
                <Card>
                  <CardHeader>
                    <CardTitle>1. Information We Collect</CardTitle>
                    <CardDescription>
                      We collect information to provide and improve our 404 monetization services.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div>
                      <h4 className="font-semibold mb-3">Personal Information</h4>
                      <ul className="list-disc pl-6 space-y-2 text-sm text-muted-foreground">
                        <li>Account information (name, email address, password)</li>
                        <li>Profile information and preferences</li>
                        <li>Payment and billing information</li>
                        <li>Contact details and communication preferences</li>
                        <li>Support tickets and correspondence</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-3">Usage Data</h4>
                      <ul className="list-disc pl-6 space-y-2 text-sm text-muted-foreground">
                        <li>404 page views, clicks, and interactions</li>
                        <li>Visitor analytics and traffic patterns</li>
                        <li>Conversion rates and monetization metrics</li>
                        <li>Feature usage and performance data</li>
                        <li>API calls and integration data</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-3">Technical Information</h4>
                      <ul className="list-disc pl-6 space-y-2 text-sm text-muted-foreground">
                        <li>IP addresses and geolocation data</li>
                        <li>Browser type, version, and device information</li>
                        <li>Operating system and platform details</li>
                        <li>Referrer URLs and page navigation</li>
                        <li>Cookies and similar tracking technologies</li>
                      </ul>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div variants={fadeIn}>
                <Card>
                  <CardHeader>
                    <CardTitle>2. How We Use Your Information</CardTitle>
                    <CardDescription>
                      We use collected information to operate, improve, and secure our services.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div>
                      <h4 className="font-semibold mb-3">Service Provision</h4>
                      <ul className="list-disc pl-6 space-y-2 text-sm text-muted-foreground">
                        <li>Create and manage your 404 monetization pages</li>
                        <li>Process payments and manage subscriptions</li>
                        <li>Provide analytics and reporting features</li>
                        <li>Enable integrations with third-party services</li>
                        <li>Deliver customer support and technical assistance</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-3">Service Improvement</h4>
                      <ul className="list-disc pl-6 space-y-2 text-sm text-muted-foreground">
                        <li>Analyze usage patterns to enhance features</li>
                        <li>Optimize performance and user experience</li>
                        <li>Develop new monetization strategies</li>
                        <li>Conduct A/B testing and feature experiments</li>
                        <li>Generate anonymized insights and benchmarks</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-3">Communication</h4>
                      <ul className="list-disc pl-6 space-y-2 text-sm text-muted-foreground">
                        <li>Send service updates and security alerts</li>
                        <li>Provide product announcements and tips</li>
                        <li>Respond to inquiries and support requests</li>
                        <li>Send marketing communications (with consent)</li>
                        <li>Deliver notifications about account activity</li>
                      </ul>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div variants={fadeIn}>
                <Card>
                  <CardHeader>
                    <CardTitle>3. Information Sharing and Disclosure</CardTitle>
                    <CardDescription>
                      We may share your information in limited circumstances as described below.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div>
                      <h4 className="font-semibold mb-3">Service Providers</h4>
                      <p className="text-sm text-muted-foreground mb-2">
                        We may share information with trusted third-party service providers who assist us in operating our business:
                      </p>
                      <ul className="list-disc pl-6 space-y-2 text-sm text-muted-foreground">
                        <li>Payment processors and billing services</li>
                        <li>Cloud hosting and infrastructure providers</li>
                        <li>Analytics and monitoring services</li>
                        <li>Customer support and communication tools</li>
                        <li>Security and fraud prevention services</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-3">Legal Requirements</h4>
                      <p className="text-sm text-muted-foreground">
                        We may disclose information when required by law, legal process, or to protect our rights, property, or safety, or that of our users or the public.
                      </p>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-3">Business Transfers</h4>
                      <p className="text-sm text-muted-foreground">
                        In the event of a merger, acquisition, or sale of assets, your information may be transferred to the new entity, subject to this Privacy Policy.
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div variants={fadeIn}>
                <Card>
                  <CardHeader>
                    <CardTitle>4. Data Security and Protection</CardTitle>
                    <CardDescription>
                      We implement comprehensive security measures to protect your information.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div>
                      <h4 className="font-semibold mb-3">Technical Safeguards</h4>
                      <ul className="list-disc pl-6 space-y-2 text-sm text-muted-foreground">
                        <li>Industry-standard encryption for data in transit and at rest</li>
                        <li>Secure HTTPS connections for all communications</li>
                        <li>Regular security audits and vulnerability assessments</li>
                        <li>Multi-factor authentication for account access</li>
                        <li>Automated monitoring and intrusion detection</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-3">Organizational Measures</h4>
                      <ul className="list-disc pl-6 space-y-2 text-sm text-muted-foreground">
                        <li>Employee training on data protection and privacy</li>
                        <li>Access controls and principle of least privilege</li>
                        <li>Regular backup procedures and disaster recovery plans</li>
                        <li>Incident response and breach notification protocols</li>
                        <li>Third-party security certifications and compliance</li>
                      </ul>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div variants={fadeIn}>
                <Card>
                  <CardHeader>
                    <CardTitle>5. Your Rights and Choices</CardTitle>
                    <CardDescription>
                      You have important rights regarding your personal information.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div>
                      <h4 className="font-semibold mb-3">Data Subject Rights</h4>
                      <ul className="list-disc pl-6 space-y-2 text-sm text-muted-foreground">
                        <li><strong>Access:</strong> Request a copy of your personal data we hold</li>
                        <li><strong>Rectification:</strong> Correct inaccurate or incomplete information</li>
                        <li><strong>Erasure:</strong> Request deletion of your personal data</li>
                        <li><strong>Restriction:</strong> Limit how we process your information</li>
                        <li><strong>Portability:</strong> Receive your data in a structured format</li>
                        <li><strong>Objection:</strong> Object to certain types of processing</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-3">Marketing Communications</h4>
                      <p className="text-sm text-muted-foreground">
                        You can opt out of marketing emails at any time by clicking the unsubscribe link or contacting us directly. Note that you may still receive transactional and service-related messages.
                      </p>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-3">Account Deletion</h4>
                      <p className="text-sm text-muted-foreground">
                        You can delete your account at any time through your account settings. This will permanently remove your personal data, though some information may be retained for legal or business purposes.
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div variants={fadeIn}>
                <Card>
                  <CardHeader>
                    <CardTitle>6. Cookies and Tracking Technologies</CardTitle>
                    <CardDescription>
                      We use cookies and similar technologies to enhance your experience.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div>
                      <h4 className="font-semibold mb-3">Types of Cookies</h4>
                      <ul className="list-disc pl-6 space-y-2 text-sm text-muted-foreground">
                        <li><strong>Essential Cookies:</strong> Required for basic site functionality</li>
                        <li><strong>Performance Cookies:</strong> Help us understand how visitors use our site</li>
                        <li><strong>Functional Cookies:</strong> Remember your preferences and settings</li>
                        <li><strong>Analytics Cookies:</strong> Provide insights into user behavior</li>
                        <li><strong>Marketing Cookies:</strong> Used for targeted advertising (with consent)</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-3">Managing Cookies</h4>
                      <p className="text-sm text-muted-foreground">
                        You can control cookies through your browser settings. However, disabling certain cookies may affect site functionality and your user experience.
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div variants={fadeIn}>
                <Card>
                  <CardHeader>
                    <CardTitle>7. Data Retention</CardTitle>
                    <CardDescription>
                      How long we keep your information depends on the type of data and legal requirements.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <ul className="list-disc pl-6 space-y-2 text-sm text-muted-foreground">
                      <li><strong>Account Data:</strong> Retained while your account is active and for up to 7 years after deletion for legal purposes</li>
                      <li><strong>Analytics Data:</strong> Aggregated data may be retained indefinitely for business insights</li>
                      <li><strong>Communication Records:</strong> Support tickets and emails retained for 3 years</li>
                      <li><strong>Payment Information:</strong> Billing records kept for 7 years for tax and legal compliance</li>
                      <li><strong>Log Data:</strong> Server logs and access records retained for 12 months</li>
                    </ul>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div variants={fadeIn}>
                <Card>
                  <CardHeader>
                    <CardTitle>8. International Data Transfers</CardTitle>
                    <CardDescription>
                      Information about how we handle cross-border data transfers.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-sm text-muted-foreground">
                      Our services are operated from various locations worldwide. When we transfer your data internationally, we ensure appropriate safeguards are in place, including:
                    </p>
                    <ul className="list-disc pl-6 space-y-2 text-sm text-muted-foreground">
                      <li>Adequacy decisions by relevant data protection authorities</li>
                      <li>Standard contractual clauses approved by regulatory bodies</li>
                      <li>Binding corporate rules for intra-group transfers</li>
                      <li>Certification schemes and codes of conduct</li>
                    </ul>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div variants={fadeIn}>
                <Card>
                  <CardHeader>
                    <CardTitle>9. Children's Privacy</CardTitle>
                    <CardDescription>
                      Our services are not intended for children under 13.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-sm text-muted-foreground">
                      404 Monetizer does not knowingly collect personal information from children under 13 years of age. If we become aware that a child under 13 has provided us with personal information, we will take steps to delete such information promptly. If you believe we may have collected information from a child under 13, please contact us immediately.
                    </p>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div variants={fadeIn}>
                <Card>
                  <CardHeader>
                    <CardTitle>10. Changes to This Privacy Policy</CardTitle>
                    <CardDescription>
                      How we handle updates to our privacy practices.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-sm text-muted-foreground">
                      We may update this Privacy Policy from time to time to reflect changes in our practices, technology, legal requirements, or other factors. We will notify you of any material changes by:
                    </p>
                    <ul className="list-disc pl-6 space-y-2 text-sm text-muted-foreground">
                      <li>Posting a notice on our website</li>
                      <li>Sending an email to your registered address</li>
                      <li>Displaying an in-app notification</li>
                      <li>Updating the "Last Modified" date at the top of this policy</li>
                    </ul>
                    <p className="text-sm text-muted-foreground mt-4">
                      Your continued use of our services after any changes indicates your acceptance of the updated Privacy Policy.
                    </p>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div variants={fadeIn}>
                <Card>
                  <CardHeader>
                    <CardTitle>11. Contact Information</CardTitle>
                    <CardDescription>
                      How to reach us with privacy-related questions or concerns.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-sm text-muted-foreground">
                      If you have any questions about this Privacy Policy or our data practices, please contact us:
                    </p>
                    <div className="bg-muted/50 p-4 rounded-lg">
                      <p className="text-sm"><strong>Email:</strong> support@404monetizer.com</p>
                      <p className="text-sm"><strong>Address:</strong> Bengaluru, Karnataka, India</p>
                      <p className="text-sm"><strong>Response Time:</strong> We aim to respond within 72 hours</p>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      For EU residents, you also have the right to lodge a complaint with your local data protection authority if you believe we have not handled your data appropriately.
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            </motion.div>
          </div>
        </motion.section>
      </motion.div>
    </div>
  );
} 