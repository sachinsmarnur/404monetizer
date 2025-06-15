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

export default function TermsPage() {
  return (
    <div className="min-h-screen pt-16">
      <motion.div
        key="terms-page"
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
              <h1 className="text-4xl font-bold mb-6">Terms of Service</h1>
              <p className="text-xl text-muted-foreground mb-8">
                Last updated: 12/06/2025
              </p>
              <p className="text-muted-foreground">
                These Terms of Service govern your use of 404 Monetizer services. By accessing or using our platform, you agree to be bound by these terms.
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
                    <CardTitle>1. Acceptance of Terms</CardTitle>
                    <CardDescription>
                      By using 404 Monetizer, you agree to these terms and conditions.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-sm text-muted-foreground">
                      By accessing or using 404 Monetizer's services, website, or platform (collectively, the "Service"), 
                      you agree to be bound by these Terms of Service ("Terms"). If you disagree with any part of these 
                      terms, you may not access or use the Service.
                    </p>
                    <p className="text-sm text-muted-foreground">
                      These Terms apply to all visitors, users, and others who access or use the Service. By using the 
                      Service, you represent that you are at least 18 years old or have reached the age of majority in 
                      your jurisdiction.
                    </p>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div variants={fadeIn}>
                <Card>
                  <CardHeader>
                    <CardTitle>2. Description of Service</CardTitle>
                    <CardDescription>
                      404 Monetizer provides tools for creating and monetizing custom 404 error pages.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-sm text-muted-foreground">
                      404 Monetizer is a platform that allows users to:
                    </p>
                    <ul className="list-disc pl-6 space-y-2 text-sm text-muted-foreground">
                      <li>Create custom 404 error pages with various monetization features</li>
                      <li>Integrate affiliate links, email collection forms, and other monetization tools</li>
                      <li>Track analytics and performance metrics for their 404 pages</li>
                      <li>Generate revenue from website traffic that would otherwise be lost</li>
                      <li>Customize the appearance and functionality of error pages</li>
                    </ul>
                    <p className="text-sm text-muted-foreground">
                      We reserve the right to modify, suspend, or discontinue any part of the Service at any time 
                      with or without notice.
                    </p>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div variants={fadeIn}>
                <Card>
                  <CardHeader>
                    <CardTitle>3. User Accounts and Registration</CardTitle>
                    <CardDescription>
                      Requirements and responsibilities for creating and maintaining user accounts.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div>
                      <h4 className="font-semibold mb-3">Account Creation</h4>
                      <ul className="list-disc pl-6 space-y-2 text-sm text-muted-foreground">
                        <li>You must provide accurate and complete information during registration</li>
                        <li>You are responsible for maintaining the confidentiality of your account credentials</li>
                        <li>You must be at least 18 years old to create an account</li>
                        <li>One person or entity may not maintain more than one account without our permission</li>
                        <li>You must notify us immediately of any unauthorized use of your account</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-3">Account Responsibilities</h4>
                      <ul className="list-disc pl-6 space-y-2 text-sm text-muted-foreground">
                        <li>You are solely responsible for all activities that occur under your account</li>
                        <li>You must keep your contact information current and accurate</li>
                        <li>You are responsible for all fees and charges incurred under your account</li>
                        <li>You must comply with all applicable laws and regulations</li>
                      </ul>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div variants={fadeIn}>
                <Card>
                  <CardHeader>
                    <CardTitle>4. Acceptable Use Policy</CardTitle>
                    <CardDescription>
                      Guidelines for appropriate use of our platform and services.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div>
                      <h4 className="font-semibold mb-3">Permitted Uses</h4>
                      <p className="text-sm text-muted-foreground mb-2">
                        You may use our Service for legitimate business purposes, including:
                      </p>
                      <ul className="list-disc pl-6 space-y-2 text-sm text-muted-foreground">
                        <li>Creating custom 404 pages for your websites</li>
                        <li>Implementing approved monetization strategies</li>
                        <li>Collecting analytics and performance data</li>
                        <li>Integrating with third-party services and platforms</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-3">Prohibited Uses</h4>
                      <p className="text-sm text-muted-foreground mb-2">
                        You may not use our Service to:
                      </p>
                      <ul className="list-disc pl-6 space-y-2 text-sm text-muted-foreground">
                        <li>Violate any applicable laws, regulations, or third-party rights</li>
                        <li>Distribute malware, viruses, or other harmful software</li>
                        <li>Engage in fraudulent, deceptive, or misleading practices</li>
                        <li>Create content that is offensive, discriminatory, or harassing</li>
                        <li>Attempt to gain unauthorized access to our systems or other users' accounts</li>
                        <li>Interfere with or disrupt the Service or servers</li>
                        <li>Scrape, harvest, or collect user information without permission</li>
                        <li>Use the Service for illegal gambling, adult content, or prohibited activities</li>
                      </ul>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div variants={fadeIn}>
                <Card>
                  <CardHeader>
                    <CardTitle>5. Payment Terms and Billing</CardTitle>
                    <CardDescription>
                      Information about pricing, billing, and payment processing.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div>
                      <h4 className="font-semibold mb-3">Pricing and Plans</h4>
                      <ul className="list-disc pl-6 space-y-2 text-sm text-muted-foreground">
                        <li>Current pricing is available on our website and subject to change</li>
                        <li>All fees are non-refundable unless otherwise stated</li>
                        <li>Prices are quoted in USD and exclude applicable taxes</li>
                        <li>We offer various subscription plans with different features and limitations</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-3">Billing and Payment</h4>
                      <ul className="list-disc pl-6 space-y-2 text-sm text-muted-foreground">
                        <li>Subscription fees are billed in advance on a recurring basis</li>
                        <li>Payment is due immediately upon subscription or renewal</li>
                        <li>We accept major credit cards and other approved payment methods</li>
                        <li>Failed payments may result in service suspension or termination</li>
                        <li>You authorize us to charge your payment method for all applicable fees</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-3">Refunds and Cancellation</h4>
                      <ul className="list-disc pl-6 space-y-2 text-sm text-muted-foreground">
                        <li>You may cancel your subscription at any time through your account settings</li>
                        <li>Cancellation takes effect at the end of your current billing period</li>
                        <li>No refunds are provided for partial billing periods</li>
                        <li>Refund requests are evaluated on a case-by-case basis for exceptional circumstances</li>
                      </ul>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div variants={fadeIn}>
                <Card>
                  <CardHeader>
                    <CardTitle>6. Intellectual Property Rights</CardTitle>
                    <CardDescription>
                      Rights and ownership of content, software, and intellectual property.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div>
                      <h4 className="font-semibold mb-3">Our Rights</h4>
                      <ul className="list-disc pl-6 space-y-2 text-sm text-muted-foreground">
                        <li>404 Monetizer and its original content, features, and functionality are owned by us</li>
                        <li>The Service is protected by copyright, trademark, and other intellectual property laws</li>
                        <li>Our trademarks and trade dress may not be used without our express written permission</li>
                        <li>We retain all rights not expressly granted to you</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-3">Your Content</h4>
                      <ul className="list-disc pl-6 space-y-2 text-sm text-muted-foreground">
                        <li>You retain ownership of any content you create using our Service</li>
                        <li>You grant us a license to use, display, and distribute your content as necessary to provide the Service</li>
                        <li>You represent that you have all necessary rights to the content you upload</li>
                        <li>You are responsible for ensuring your content does not infringe on third-party rights</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-3">License to Use Service</h4>
                      <p className="text-sm text-muted-foreground">
                        We grant you a limited, non-exclusive, non-transferable license to use the Service in accordance 
                        with these Terms. This license does not include the right to resell, redistribute, or create 
                        derivative works based on the Service.
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div variants={fadeIn}>
                <Card>
                  <CardHeader>
                    <CardTitle>7. Privacy and Data Protection</CardTitle>
                    <CardDescription>
                      How we handle your personal information and data.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-sm text-muted-foreground">
                      Your privacy is important to us. Our Privacy Policy explains how we collect, use, and protect 
                      your information when you use our Service. By using the Service, you consent to our data 
                      practices as described in our Privacy Policy.
                    </p>
                    <ul className="list-disc pl-6 space-y-2 text-sm text-muted-foreground">
                      <li>We collect and process data necessary to provide and improve our Service</li>
                      <li>We implement appropriate security measures to protect your information</li>
                      <li>We may share data with third-party service providers as described in our Privacy Policy</li>
                      <li>You have certain rights regarding your personal data, including access and deletion</li>
                      <li>We comply with applicable data protection laws and regulations</li>
                    </ul>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div variants={fadeIn}>
                <Card>
                  <CardHeader>
                    <CardTitle>8. Service Availability and Support</CardTitle>
                    <CardDescription>
                      Information about service uptime, maintenance, and customer support.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div>
                      <h4 className="font-semibold mb-3">Service Availability</h4>
                      <ul className="list-disc pl-6 space-y-2 text-sm text-muted-foreground">
                        <li>We strive to maintain 99.9% uptime but cannot guarantee uninterrupted service</li>
                        <li>Scheduled maintenance will be announced in advance when possible</li>
                        <li>Emergency maintenance may be performed without prior notice</li>
                        <li>Service interruptions due to third-party providers are beyond our control</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-3">Customer Support</h4>
                      <ul className="list-disc pl-6 space-y-2 text-sm text-muted-foreground">
                        <li>Support is provided through email and our online help center</li>
                        <li>We aim to respond to support requests within 24-48 hours</li>
                        <li>Priority support may be available for higher-tier subscription plans</li>
                        <li>Support is provided in English during business hours</li>
                      </ul>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div variants={fadeIn}>
                <Card>
                  <CardHeader>
                    <CardTitle>9. Disclaimers and Warranties</CardTitle>
                    <CardDescription>
                      Important disclaimers about our service and your use thereof.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div>
                      <h4 className="font-semibold mb-3">Service Disclaimer</h4>
                      <p className="text-sm text-muted-foreground">
                        THE SERVICE IS PROVIDED "AS IS" AND "AS AVAILABLE" WITHOUT WARRANTIES OF ANY KIND, 
                        EITHER EXPRESS OR IMPLIED. WE DISCLAIM ALL WARRANTIES, INCLUDING BUT NOT LIMITED TO:
                      </p>
                      <ul className="list-disc pl-6 space-y-2 text-sm text-muted-foreground">
                        <li>MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE</li>
                        <li>NON-INFRINGEMENT OF THIRD-PARTY RIGHTS</li>
                        <li>SECURITY, RELIABILITY, OR ACCURACY OF THE SERVICE</li>
                        <li>UNINTERRUPTED OR ERROR-FREE OPERATION</li>
                        <li>RESULTS OR REVENUE GENERATION FROM USE OF THE SERVICE</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-3">Third-Party Services</h4>
                      <p className="text-sm text-muted-foreground">
                        Our Service may integrate with or link to third-party services. We are not responsible 
                        for the availability, content, or practices of third-party services. Your use of 
                        third-party services is governed by their respective terms and policies.
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div variants={fadeIn}>
                <Card>
                  <CardHeader>
                    <CardTitle>10. Limitation of Liability</CardTitle>
                    <CardDescription>
                      Limits on our liability for damages arising from your use of the Service.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-sm text-muted-foreground">
                      TO THE MAXIMUM EXTENT PERMITTED BY LAW, 404 MONETIZER SHALL NOT BE LIABLE FOR ANY 
                      INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, INCLUDING BUT NOT 
                      LIMITED TO:
                    </p>
                    <ul className="list-disc pl-6 space-y-2 text-sm text-muted-foreground">
                      <li>LOSS OF PROFITS, REVENUE, OR DATA</li>
                      <li>BUSINESS INTERRUPTION OR LOST OPPORTUNITIES</li>
                      <li>DAMAGE TO REPUTATION OR GOODWILL</li>
                      <li>COSTS OF SUBSTITUTE SERVICES</li>
                      <li>ANY OTHER INTANGIBLE LOSSES</li>
                    </ul>
                    <p className="text-sm text-muted-foreground">
                      OUR TOTAL LIABILITY ARISING FROM OR RELATED TO THESE TERMS OR THE SERVICE SHALL NOT 
                      EXCEED THE AMOUNT YOU PAID TO US IN THE 12 MONTHS PRECEDING THE CLAIM, OR $100, 
                      WHICHEVER IS GREATER.
                    </p>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div variants={fadeIn}>
                <Card>
                  <CardHeader>
                    <CardTitle>11. Indemnification</CardTitle>
                    <CardDescription>
                      Your agreement to protect us from certain claims and damages.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-sm text-muted-foreground">
                      You agree to indemnify, defend, and hold harmless 404 Monetizer, its officers, directors, 
                      employees, and agents from and against any claims, damages, obligations, losses, liabilities, 
                      costs, or debt, and expenses (including attorney's fees) arising from:
                    </p>
                    <ul className="list-disc pl-6 space-y-2 text-sm text-muted-foreground">
                      <li>Your use of the Service in violation of these Terms</li>
                      <li>Your violation of any third-party rights, including intellectual property rights</li>
                      <li>Any content you submit or display using the Service</li>
                      <li>Your violation of any applicable laws or regulations</li>
                      <li>Any fraudulent or illegal activities conducted through your account</li>
                    </ul>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div variants={fadeIn}>
                <Card>
                  <CardHeader>
                    <CardTitle>12. Termination</CardTitle>
                    <CardDescription>
                      Conditions under which these Terms may be terminated.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div>
                      <h4 className="font-semibold mb-3">Termination by You</h4>
                      <ul className="list-disc pl-6 space-y-2 text-sm text-muted-foreground">
                        <li>You may terminate your account at any time through your account settings</li>
                        <li>Termination takes effect immediately upon request</li>
                        <li>You remain responsible for all charges incurred prior to termination</li>
                        <li>Some provisions of these Terms will survive termination</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-3">Termination by Us</h4>
                      <ul className="list-disc pl-6 space-y-2 text-sm text-muted-foreground">
                        <li>We may suspend or terminate your account for violation of these Terms</li>
                        <li>We may terminate accounts that remain inactive for extended periods</li>
                        <li>We reserve the right to refuse service to anyone for any reason</li>
                        <li>We may terminate the Service entirely with 30 days' notice</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-3">Effect of Termination</h4>
                      <p className="text-sm text-muted-foreground">
                        Upon termination, your right to use the Service will cease immediately. We may delete 
                        your account and data, though some information may be retained as required by law or 
                        for legitimate business purposes.
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div variants={fadeIn}>
                <Card>
                  <CardHeader>
                    <CardTitle>13. Governing Law and Dispute Resolution</CardTitle>
                    <CardDescription>
                      Legal framework for resolving disputes and governing these Terms.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div>
                      <h4 className="font-semibold mb-3">Governing Law</h4>
                      <p className="text-sm text-muted-foreground">
                        These Terms shall be governed by and construed in accordance with the laws of [Your Jurisdiction], 
                        without regard to its conflict of law provisions. Any legal action or proceeding arising 
                        under these Terms will be brought exclusively in the courts of [Your Jurisdiction].
                      </p>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-3">Dispute Resolution</h4>
                      <ul className="list-disc pl-6 space-y-2 text-sm text-muted-foreground">
                        <li>We encourage resolving disputes through direct communication first</li>
                        <li>Disputes that cannot be resolved informally may be subject to binding arbitration</li>
                        <li>You waive the right to participate in class action lawsuits</li>
                        <li>Some jurisdictions may not allow certain limitations on dispute resolution</li>
                      </ul>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div variants={fadeIn}>
                <Card>
                  <CardHeader>
                    <CardTitle>14. Changes to Terms</CardTitle>
                    <CardDescription>
                      How we handle updates and modifications to these Terms of Service.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-sm text-muted-foreground">
                      We reserve the right to modify these Terms at any time. When we make changes, we will:
                    </p>
                    <ul className="list-disc pl-6 space-y-2 text-sm text-muted-foreground">
                      <li>Post the updated Terms on our website</li>
                      <li>Update the "Last Modified" date at the top of this page</li>
                      <li>Notify you of material changes via email or in-app notification</li>
                      <li>Provide at least 30 days' notice for significant changes</li>
                    </ul>
                    <p className="text-sm text-muted-foreground">
                      Your continued use of the Service after any changes constitutes acceptance of the new Terms. 
                      If you do not agree to the updated Terms, you must stop using the Service.
                    </p>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div variants={fadeIn}>
                <Card>
                  <CardHeader>
                    <CardTitle>15. General Provisions</CardTitle>
                    <CardDescription>
                      Additional terms and conditions that apply to your use of the Service.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div>
                      <h4 className="font-semibold mb-3">Severability</h4>
                      <p className="text-sm text-muted-foreground">
                        If any provision of these Terms is found to be unenforceable, the remaining provisions 
                        will remain in full force and effect.
                      </p>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-3">Entire Agreement</h4>
                      <p className="text-sm text-muted-foreground">
                        These Terms, together with our Privacy Policy, constitute the entire agreement between 
                        you and 404 Monetizer regarding the Service.
                      </p>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-3">Assignment</h4>
                      <p className="text-sm text-muted-foreground">
                        You may not assign or transfer your rights under these Terms without our written consent. 
                        We may assign our rights and obligations without restriction.
                      </p>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-3">Waiver</h4>
                      <p className="text-sm text-muted-foreground">
                        Our failure to enforce any provision of these Terms shall not constitute a waiver of 
                        that provision or any other provision.
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div variants={fadeIn}>
                <Card>
                  <CardHeader>
                    <CardTitle>16. Contact Information</CardTitle>
                    <CardDescription>
                      How to reach us with questions about these Terms of Service.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-sm text-muted-foreground">
                      If you have any questions about these Terms of Service, please contact us:
                    </p>
                    <div className="bg-muted/50 p-4 rounded-lg">
                      <p className="text-sm"><strong>Support:</strong> support@404monetizer.com</p>
                      <p className="text-sm"><strong>Address:</strong> Bengaluru, Karnataka, India</p>
                      <p className="text-sm"><strong>Response Time:</strong> We aim to respond within 5 business days</p>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      For urgent matters related to service availability or security issues, please use our 
                      priority support channels available in your account dashboard.
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