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

export default function ShippingDeliveryPage() {
  return (
    <div className="min-h-screen pt-16">
      <motion.div
        key="shipping-delivery-page"
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
              <h1 className="text-4xl font-bold mb-6">Shipping and Delivery Policy</h1>
              <p className="text-xl text-muted-foreground mb-8">
                Last updated: 15/06/2025
              </p>
              <p className="text-muted-foreground">
                Information about service delivery for 404 Monetizer digital services.
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
                    <CardTitle>Digital Service Delivery</CardTitle>
                    <CardDescription>
                      How 404 Monetizer services are delivered to users.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div>
                      <h4 className="font-semibold mb-3">Service Nature</h4>
                      <p className="text-sm text-muted-foreground mb-4">
                        404 Monetizer is a Software-as-a-Service (SaaS) platform that provides digital services. 
                        No physical products are shipped or delivered.
                      </p>
                      <ul className="list-disc pl-6 space-y-2 text-sm text-muted-foreground">
                        <li>All services are delivered digitally through our web platform</li>
                        <li>Access is provided immediately upon successful payment</li>
                        <li>No physical shipping or handling is required</li>
                        <li>Services are accessible 24/7 through your web browser</li>
                      </ul>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div variants={fadeIn}>
                <Card>
                  <CardHeader>
                    <CardTitle>Instant Access</CardTitle>
                    <CardDescription>
                      Immediate service activation and delivery process.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div>
                      <h4 className="font-semibold mb-3">Service Activation</h4>
                      <ul className="list-disc pl-6 space-y-2 text-sm text-muted-foreground">
                        <li>Account access is granted immediately upon registration</li>
                        <li>Pro features are activated instantly after successful payment</li>
                        <li>No waiting period or delivery time required</li>
                        <li>All features are available through your dashboard</li>
                        <li>Technical support is available for setup assistance</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-3">Access Requirements</h4>
                      <ul className="list-disc pl-6 space-y-2 text-sm text-muted-foreground">
                        <li>Internet connection required for service access</li>
                        <li>Modern web browser (Chrome, Firefox, Safari, Edge)</li>
                        <li>Valid email address for account communications</li>
                        <li>JavaScript enabled for full functionality</li>
                      </ul>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div variants={fadeIn}>
                <Card>
                  <CardHeader>
                    <CardTitle>Service Availability</CardTitle>
                    <CardDescription>
                      Information about service uptime and accessibility.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div>
                      <h4 className="font-semibold mb-3">Service Uptime</h4>
                      <ul className="list-disc pl-6 space-y-2 text-sm text-muted-foreground">
                        <li>We aim for 99.9% service uptime</li>
                        <li>Planned maintenance is scheduled during low-usage periods</li>
                        <li>Users are notified in advance of scheduled maintenance</li>
                        <li>Service status updates are provided during any outages</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-3">Geographic Availability</h4>
                      <ul className="list-disc pl-6 space-y-2 text-sm text-muted-foreground">
                        <li>Services are available globally via the internet</li>
                        <li>No geographic restrictions on service access</li>
                        <li>Cloud-based infrastructure ensures reliable delivery</li>
                        <li>Local regulations may apply in certain jurisdictions</li>
                      </ul>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div variants={fadeIn}>
                <Card>
                  <CardHeader>
                    <CardTitle>Support and Assistance</CardTitle>
                    <CardDescription>
                      Getting help with service setup and usage.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-sm text-muted-foreground">
                      Since our services are delivered digitally, traditional shipping terms do not apply. 
                      However, we provide comprehensive support to ensure smooth service delivery:
                    </p>
                    <ul className="list-disc pl-6 space-y-2 text-sm text-muted-foreground">
                      <li>Email support for technical assistance</li>
                      <li>Documentation and tutorials for service setup</li>
                      <li>FAQ section addressing common questions</li>
                      <li>Account management tools for self-service</li>
                    </ul>
                    <div className="mt-6 p-4 bg-muted/30 rounded-lg">
                      <p className="text-sm text-muted-foreground">
                        <strong>Need Help?</strong> Contact our support team at support@404monetizer.com 
                        for assistance with service access or technical issues.
                      </p>
                    </div>
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