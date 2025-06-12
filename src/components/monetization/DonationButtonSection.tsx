import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DonationButton } from "@/types/page";
import { Heart, CreditCard, Coffee, UserCheck, Globe } from "lucide-react";

interface Props {
  settings: DonationButton;
  onChange: (settings: DonationButton) => void;
}

const platformIcons = {
  paypal: CreditCard,
  stripe: CreditCard,
  kofi: Coffee,
  patreon: UserCheck,
  custom: Globe
};

const platformColors = {
  paypal: "#0070BA",
  stripe: "#635BFF",
  kofi: "#FF5F5F",
  patreon: "#FF424D",
  custom: "#6B7280"
};

const currencies = [
  { value: "USD", label: "$", name: "US Dollar" },
  { value: "EUR", label: "€", name: "Euro" },
  { value: "GBP", label: "£", name: "British Pound" },
  { value: "CAD", label: "C$", name: "Canadian Dollar" },
  { value: "AUD", label: "A$", name: "Australian Dollar" },
  { value: "JPY", label: "¥", name: "Japanese Yen" }
];

export function DonationButtonSection({ settings, onChange }: Props) {
  const PlatformIcon = platformIcons[settings.platform] || Heart;
  const selectedCurrency = currencies.find(c => c.value === settings.currency);

  // Dynamic placeholder based on platform
  const getDonationUrlPlaceholder = (platform: string) => {
    switch (platform) {
      case 'paypal':
        return 'https://paypal.me/yourlink';
      case 'stripe':
        return 'https://buy.stripe.com/your-payment-link';
      case 'kofi':
        return 'https://ko-fi.com/yourname';
      case 'patreon':
        return 'https://patreon.com/yourname';
      case 'custom':
        return 'https://your-donation-page.com/donate';
      default:
        return 'https://your-donation-url.com';
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center space-x-2">
          <Heart className="h-5 w-5 text-primary" />
          <CardTitle>Donation Button</CardTitle>
        </div>
        <CardDescription>
          Add a donation button to accept contributions from visitors who appreciate your content.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label className="text-base">Enable Donations</Label>
            <p className="text-sm text-muted-foreground">
              Accept donations to support your work
            </p>
          </div>
          <Switch
            checked={settings.enabled}
            onCheckedChange={(enabled) => onChange({ ...settings, enabled })}
          />
        </div>

        {settings.enabled && (
          <div className="space-y-6 pt-4 border-t">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="donationTitle">Title</Label>
                <Input
                  id="donationTitle"
                  placeholder="Support Our Work"
                  value={settings.title}
                  onChange={(e) => onChange({ ...settings, title: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="platform">Platform</Label>
                <Select
                  value={settings.platform}
                  onValueChange={(value: DonationButton['platform']) => onChange({ ...settings, platform: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select platform" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="paypal">
                      <div className="flex items-center">
                        <CreditCard className="mr-2 h-4 w-4" />
                        PayPal
                      </div>
                    </SelectItem>
                    <SelectItem value="stripe">
                      <div className="flex items-center">
                        <CreditCard className="mr-2 h-4 w-4" />
                        Stripe
                      </div>
                    </SelectItem>
                    <SelectItem value="kofi">
                      <div className="flex items-center">
                        <Coffee className="mr-2 h-4 w-4" />
                        Ko-fi
                      </div>
                    </SelectItem>
                    <SelectItem value="patreon">
                      <div className="flex items-center">
                        <UserCheck className="mr-2 h-4 w-4" />
                        Patreon
                      </div>
                    </SelectItem>
                    <SelectItem value="custom">
                      <div className="flex items-center">
                        <Globe className="mr-2 h-4 w-4" />
                        Custom
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="donationDescription">Description</Label>
              <Textarea
                id="donationDescription"
                placeholder="Help us continue creating amazing content..."
                value={settings.description}
                onChange={(e) => onChange({ ...settings, description: e.target.value })}
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="donationUrl">Donation URL</Label>
              <Input
                id="donationUrl"
                placeholder={getDonationUrlPlaceholder(settings.platform)}
                value={settings.donationUrl}
                onChange={(e) => onChange({ ...settings, donationUrl: e.target.value })}
                type="url"
              />
              <p className="text-xs text-muted-foreground">
                {settings.platform === 'paypal' && "Your PayPal.me link or donation button URL"}
                {settings.platform === 'stripe' && "Your Stripe payment link"}
                {settings.platform === 'kofi' && "Your Ko-fi page URL (e.g., https://ko-fi.com/yourname)"}
                {settings.platform === 'patreon' && "Your Patreon page URL"}
                {settings.platform === 'custom' && "Your custom donation page URL"}
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="buttonText">Button Text</Label>
                <Input
                  id="buttonText"
                  placeholder="Donate Now"
                  value={settings.buttonText}
                  onChange={(e) => onChange({ ...settings, buttonText: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="currency">Currency</Label>
                <Select
                  value={settings.currency}
                  onValueChange={(value) => onChange({ ...settings, currency: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Currency" />
                  </SelectTrigger>
                  <SelectContent>
                    {currencies.map((currency) => (
                      <SelectItem key={currency.value} value={currency.value}>
                        <div className="flex items-center">
                          <span className="mr-2 font-mono">{currency.label}</span>
                          {currency.name}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="targetAmount">Target Amount (Optional)</Label>
                <Input
                  id="targetAmount"
                  placeholder="100"
                  type="number"
                  value={settings.targetAmount || ''}
                  onChange={(e) => onChange({ ...settings, targetAmount: e.target.value ? Number(e.target.value) : undefined })}
                />
              </div>
            </div>

            {/* Preview */}
            <div className="mt-6 p-4 border rounded-lg bg-muted/50">
              <h4 className="text-sm font-medium mb-3 flex items-center">
                <Heart className="mr-2 h-4 w-4" />
                Preview
              </h4>
              <div className="space-y-4 p-6 bg-background border rounded-lg text-center">
                <div className="flex items-center justify-center">
                  <PlatformIcon 
                    className="h-6 w-6 mr-2" 
                    style={{ color: platformColors[settings.platform] }}
                  />
                  <div className="font-medium text-lg">{settings.title || "Support Our Work"}</div>
                </div>
                <div className="text-sm text-muted-foreground max-w-sm mx-auto">
                  {settings.description || "Your support helps us continue creating amazing content."}
                </div>
                {settings.targetAmount && (
                  <div className="text-sm">
                    <span className="text-muted-foreground">Goal: </span>
                    <span className="font-medium">
                      {selectedCurrency?.label}{settings.targetAmount}
                    </span>
                  </div>
                )}
                <div 
                  className="inline-flex items-center px-6 py-3 rounded-lg text-white font-medium text-sm transition-all hover:shadow-lg"
                  style={{ backgroundColor: platformColors[settings.platform] }}
                >
                  <Heart className="mr-2 h-4 w-4" />
                  {settings.buttonText || "Donate Now"}
                </div>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
} 