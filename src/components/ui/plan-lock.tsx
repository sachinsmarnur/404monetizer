import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Lock, Crown } from "lucide-react";
import { useRazorpay } from "@/hooks/useRazorpay";
import { useAuth } from "@/contexts/auth-context";
import { isPlanExpired } from "@/lib/plan-utils";

interface PlanLockProps {
  title: string;
  description: string;
  features?: string[];
}

export function PlanLock({ title, description, features }: PlanLockProps) {
  const { processPayment, loading } = useRazorpay();
  const { user } = useAuth();
  
  const isExpiredPlan = user && isPlanExpired(user);
  const buttonText = isExpiredPlan ? 'Renew Pro Plan' : 'Upgrade to Pro';
  const lockTitle = isExpiredPlan ? 'Pro Plan Expired' : title;
  const lockDescription = isExpiredPlan 
    ? 'Your Pro plan has expired. Renew to access these features again.'
    : description;

  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <Card className="max-w-2xl mx-auto border-2 border-dashed border-muted-foreground/30 bg-muted/30">
        <CardHeader className="text-center">
          <div className="mx-auto w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
            <Lock className="h-8 w-8 text-muted-foreground" />
          </div>
          <CardTitle className="text-2xl mb-2">{lockTitle}</CardTitle>
          <CardDescription className="text-base">{lockDescription}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {features && features.length > 0 && (
            <div className="space-y-3">
              <p className="font-medium text-sm text-center">Unlock these Pro features:</p>
              <ul className="space-y-2 text-sm text-muted-foreground">
                {features.map((feature, index) => (
                  <li key={index} className="flex items-center justify-start gap-2">
                    <Crown className="h-4 w-4 text-amber-500 flex-shrink-0" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
          <div className="text-center">
            <Button
              onClick={() => processPayment()}
              disabled={loading}
              size="lg"
              className="bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600 text-black font-semibold"
            >
              <Crown className="h-4 w-4 mr-2" />
              {loading ? 'Processing...' : buttonText}
            </Button>
            <p className="text-xs text-muted-foreground mt-2">
              Secure payment powered by Razorpay
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 