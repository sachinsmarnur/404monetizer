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

export default function CancellationRefundPage() {
  return (
    <div className="min-h-screen pt-16">
      <motion.div
        key="cancellation-refund-page"
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
              <h1 className="text-4xl font-bold mb-6">Cancellation and Refund Policy</h1>
              <p className="text-xl text-muted-foreground mb-8">
                Last updated: 15/06/2025
              </p>
              <p className="text-muted-foreground">
                This policy outlines our cancellation and refund procedures for 404 Monetizer subscriptions and services.
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
                    <CardTitle>1. Subscription Cancellation</CardTitle>
                    <CardDescription>
                      How to cancel your 404 Monetizer subscription and what happens next.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div>
                      <h4 className="font-semibold mb-3">How to Cancel</h4>
                      <ul className="list-disc pl-6 space-y-2 text-sm text-muted-foreground">
                        <li>Log into your 404 Monetizer dashboard</li>
                        <li>Navigate to Account Settings or Billing section</li>
                        <li>Click "Cancel Subscription" or contact our support team</li>
                        <li>Follow the cancellation confirmation process</li>
                        <li>You will receive email confirmation of the cancellation</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-3">Cancellation Timing</h4>
                      <ul className="list-disc pl-6 space-y-2 text-sm text-muted-foreground">
                        <li>You can cancel your subscription at any time during your billing cycle</li>
                        <li>Cancellation takes effect at the end of your current billing period</li>
                        <li>You will retain access to Pro features until the end of your paid period</li>
                        <li>No additional charges will occur after cancellation</li>
                        <li>You can reactivate your subscription at any time</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-3">What Happens After Cancellation</h4>
                      <ul className="list-disc pl-6 space-y-2 text-sm text-muted-foreground">
                        <li>Your account will be downgraded to the free plan</li>
                        <li>Pages beyond the free plan limit will be disabled but not deleted</li>
                        <li>You can access one (1) 404 page with basic features</li>
                        <li>Premium features and analytics will be restricted</li>
                        <li>All your data will be preserved for potential reactivation</li>
                      </ul>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div variants={fadeIn}>
                <Card>
                  <CardHeader>
                    <CardTitle>2. Refund Policy</CardTitle>
                    <CardDescription>
                      Our approach to refunds and when they may be applicable.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div>
                      <h4 className="font-semibold mb-3">General Refund Policy</h4>
                      <p className="text-sm text-muted-foreground mb-4">
                        Due to the nature of our digital services and immediate access provided upon subscription, 
                        all payments are generally non-refundable. However, we may consider refunds in specific circumstances:
                      </p>
                      <ul className="list-disc pl-6 space-y-2 text-sm text-muted-foreground">
                        <li>Technical issues preventing service usage within the first 7 days</li>
                        <li>Duplicate payments or billing errors</li>
                        <li>Service outages lasting more than 48 hours</li>
                        <li>Unauthorized transactions (subject to investigation)</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-3">Pro-rated Refunds</h4>
                      <ul className="list-disc pl-6 space-y-2 text-sm text-muted-foreground">
                        <li>We do not offer pro-rated refunds for partial usage periods</li>
                        <li>Annual subscriptions are not eligible for partial refunds</li>
                        <li>Downgrading mid-cycle does not qualify for refunds</li>
                        <li>Service usage, even minimal, constitutes acceptance of charges</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-3">Refund Request Process</h4>
                      <ul className="list-disc pl-6 space-y-2 text-sm text-muted-foreground">
                        <li>Contact our support team within 7 days of the charge</li>
                        <li>Provide your account email and transaction details</li>
                        <li>Explain the reason for your refund request</li>
                        <li>Allow 5-10 business days for review and processing</li>
                        <li>Approved refunds will be processed to the original payment method</li>
                      </ul>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div variants={fadeIn}>
                <Card>
                  <CardHeader>
                    <CardTitle>3. Billing and Payment Issues</CardTitle>
                    <CardDescription>
                      Handling payment failures, disputes, and billing corrections.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div>
                      <h4 className="font-semibold mb-3">Failed Payments</h4>
                      <ul className="list-disc pl-6 space-y-2 text-sm text-muted-foreground">
                        <li>We will attempt to process failed payments multiple times</li>
                        <li>You will receive email notifications about payment failures</li>
                        <li>Update your payment method to avoid service interruption</li>
                        <li>Accounts with failed payments may be suspended after 7 days</li>
                        <li>Suspended accounts can be reactivated by updating payment information</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-3">Dispute Resolution</h4>
                      <ul className="list-disc pl-6 space-y-2 text-sm text-muted-foreground">
                        <li>Contact us directly before initiating chargebacks</li>
                        <li>We work to resolve billing disputes quickly and fairly</li>
                        <li>Chargebacks may result in immediate account suspension</li>
                        <li>Account access will be restored upon dispute resolution</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-3">Billing Corrections</h4>
                      <ul className="list-disc pl-6 space-y-2 text-sm text-muted-foreground">
                        <li>We will correct legitimate billing errors promptly</li>
                        <li>Overcharges will be refunded or credited to your account</li>
                        <li>Tax calculations may be adjusted based on location changes</li>
                        <li>Contact support immediately if you notice billing discrepancies</li>
                      </ul>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div variants={fadeIn}>
                <Card>
                  <CardHeader>
                    <CardTitle>4. Free Plan and Trial Limitations</CardTitle>
                    <CardDescription>
                      Understanding the limitations and transitions between plan types.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div>
                      <h4 className="font-semibold mb-3">Free Plan Restrictions</h4>
                      <ul className="list-disc pl-6 space-y-2 text-sm text-muted-foreground">
                        <li>Limited to one (1) active 404 page</li>
                        <li>Basic monetization features only</li>
                        <li>Limited analytics and reporting</li>
                        <li>Standard support response times</li>
                        <li>404 Monetizer branding may be displayed</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-3">Plan Downgrade Effects</h4>
                      <ul className="list-disc pl-6 space-y-2 text-sm text-muted-foreground">
                        <li>Excess pages beyond free plan limits will be disabled</li>
                        <li>Premium features will become inaccessible</li>
                        <li>Data will be preserved but may not be editable</li>
                        <li>Pages can be reactivated by upgrading to Pro</li>
                      </ul>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div variants={fadeIn}>
                <Card>
                  <CardHeader>
                    <CardTitle>5. Data Retention and Account Deletion</CardTitle>
                    <CardDescription>
                      How we handle your data when you cancel or delete your account.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div>
                      <h4 className="font-semibold mb-3">Data Retention</h4>
                      <ul className="list-disc pl-6 space-y-2 text-sm text-muted-foreground">
                        <li>Your 404 pages and settings are preserved after cancellation</li>
                        <li>Analytics data is retained for potential reactivation</li>
                        <li>Account data remains accessible for easy resubscription</li>
                        <li>No data is automatically deleted upon plan cancellation</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-3">Account Deletion</h4>
                      <ul className="list-disc pl-6 space-y-2 text-sm text-muted-foreground">
                        <li>Complete account deletion must be requested explicitly</li>
                        <li>All data will be permanently deleted within 30 days</li>
                        <li>Account deletion is irreversible</li>
                        <li>Outstanding balances must be settled before deletion</li>
                        <li>Confirmation required for account deletion requests</li>
                      </ul>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div variants={fadeIn}>
                <Card>
                  <CardHeader>
                    <CardTitle>6. Contact Information</CardTitle>
                    <CardDescription>
                      How to reach us regarding cancellations, refunds, or billing questions.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-sm text-muted-foreground">
                      If you have any questions about our Cancellation and Refund Policy, or need assistance with 
                      your subscription, please contact us:
                    </p>
                    <div className="space-y-2 text-sm text-muted-foreground">
                      <p><strong>Email:</strong> support@404monetizer.com</p>
                      <p><strong>Support Hours:</strong> Monday - Friday, 9:00 AM - 5:00 PM EST</p>
                      <p><strong>Response Time:</strong> Within 24-48 hours for billing inquiries</p>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      For urgent billing issues or disputes, please mark your email as "URGENT - BILLING" 
                      in the subject line.
                    </p>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div variants={fadeIn}>
                <Card>
                  <CardHeader>
                    <CardTitle>7. Policy Updates</CardTitle>
                    <CardDescription>
                      How we handle changes to this Cancellation and Refund Policy.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-sm text-muted-foreground">
                      We may update this Cancellation and Refund Policy from time to time. When we make changes:
                    </p>
                    <ul className="list-disc pl-6 space-y-2 text-sm text-muted-foreground">
                      <li>We will update the "Last updated" date at the top of this policy</li>
                      <li>Significant changes will be communicated via email</li>
                      <li>Changes will be posted on our website</li>
                      <li>Continued use of our services constitutes acceptance of updated terms</li>
                    </ul>
                    <p className="text-sm text-muted-foreground">
                      We recommend reviewing this policy periodically to stay informed about our 
                      cancellation and refund procedures.
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