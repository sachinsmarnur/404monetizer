import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { NewsletterSignup } from "@/types/page";
import { Mail, Send, Zap, Globe } from "lucide-react";

interface Props {
  settings: NewsletterSignup;
  onChange: (settings: NewsletterSignup) => void;
}

const providerIcons = {
  mailchimp: Zap,
  convertkit: Send,
  sendinblue: Mail,
  custom: Globe
};

const providerColors = {
  mailchimp: "#FFE01B",
  convertkit: "#FB7DA7",
  sendinblue: "#0092DF",
  custom: "#6B7280"
};

export function NewsletterSignupSection({ settings, onChange }: Props) {
  const ProviderIcon = providerIcons[settings.provider] || Mail;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center space-x-2">
          <Mail className="h-5 w-5 text-primary" />
          <CardTitle>Newsletter Signup</CardTitle>
        </div>
        <CardDescription>
          Integrate with your email marketing platform to capture subscribers directly from your 404 page.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label className="text-base">Enable Newsletter Signup</Label>
            <p className="text-sm text-muted-foreground">
              Connect with your email service provider
            </p>
          </div>
          <Switch
            checked={settings.enabled}
            onCheckedChange={(enabled) => onChange({ ...settings, enabled })}
          />
        </div>

        {settings.enabled && (
          <div className="space-y-4 pt-4 border-t">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="newsletterTitle">Title</Label>
                <Input
                  id="newsletterTitle"
                  placeholder="Subscribe to our newsletter"
                  value={settings.title}
                  onChange={(e) => onChange({ ...settings, title: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="provider">Email Provider</Label>
                <Select
                  value={settings.provider}
                  onValueChange={(value: NewsletterSignup['provider']) => onChange({ ...settings, provider: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select provider" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="mailchimp">
                      <div className="flex items-center">
                        <Zap className="mr-2 h-4 w-4" />
                        Mailchimp
                      </div>
                    </SelectItem>
                    <SelectItem value="convertkit">
                      <div className="flex items-center">
                        <Send className="mr-2 h-4 w-4" />
                        ConvertKit
                      </div>
                    </SelectItem>
                    <SelectItem value="sendinblue">
                      <div className="flex items-center">
                        <Mail className="mr-2 h-4 w-4" />
                        Sendinblue
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
              <Label htmlFor="newsletterDescription">Description</Label>
              <Textarea
                id="newsletterDescription"
                placeholder="Get the latest updates and exclusive content..."
                value={settings.description}
                onChange={(e) => onChange({ ...settings, description: e.target.value })}
                rows={3}
              />
            </div>

            {settings.provider !== 'custom' && (
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="apiKey">API Key</Label>
                  <Input
                    id="apiKey"
                    placeholder="Enter your API key"
                    type="password"
                    value={settings.apiKey || ''}
                    onChange={(e) => onChange({ ...settings, apiKey: e.target.value })}
                  />
                  <p className="text-xs text-muted-foreground">
                    {settings.provider === 'mailchimp' && "Found in Account > Extras > API Keys"}
                    {settings.provider === 'convertkit' && "Found in Account Settings > API"}
                    {settings.provider === 'sendinblue' && "Found in Account > SMTP & API"}
                  </p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="listId">List/Form ID</Label>
                  <Input
                    id="listId"
                    placeholder="Enter list or form ID"
                    value={settings.listId || ''}
                    onChange={(e) => onChange({ ...settings, listId: e.target.value })}
                  />
                </div>
              </div>
            )}

            {settings.provider === 'custom' && (
              <div className="space-y-2">
                <Label htmlFor="webhookUrl">Webhook URL</Label>
                <Input
                  id="webhookUrl"
                  placeholder="https://your-server.com/webhook"
                  type="url"
                  value={settings.webhookUrl || ''}
                  onChange={(e) => onChange({ ...settings, webhookUrl: e.target.value })}
                />
                <p className="text-xs text-muted-foreground">
                  POST request will be sent with email data to this URL
                </p>
              </div>
            )}

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="buttonText">Button Text</Label>
                <Input
                  id="buttonText"
                  placeholder="Subscribe"
                  value={settings.buttonText}
                  onChange={(e) => onChange({ ...settings, buttonText: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="emailPlaceholder">Email Placeholder</Label>
                <Input
                  id="emailPlaceholder"
                  placeholder="Enter your email"
                  value={settings.emailPlaceholder}
                  onChange={(e) => onChange({ ...settings, emailPlaceholder: e.target.value })}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="successMessage">Success Message</Label>
              <Input
                id="successMessage"
                placeholder="Thank you for subscribing!"
                value={settings.successMessage}
                onChange={(e) => onChange({ ...settings, successMessage: e.target.value })}
              />
            </div>

            {/* Preview */}
            <div className="mt-6 p-4 border rounded-lg bg-muted/50">
              <h4 className="text-sm font-medium mb-2 flex items-center">
                <ProviderIcon 
                  className="mr-2 h-4 w-4" 
                  style={{ color: providerColors[settings.provider] }}
                />
                Preview
              </h4>
              <div className="space-y-3 p-4 bg-background border rounded-lg text-center">
                <div className="font-medium">{settings.title || "Newsletter Signup Title"}</div>
                <div className="text-sm text-muted-foreground">
                  {settings.description || "Newsletter description goes here..."}
                </div>
                <div className="flex items-center space-x-2 max-w-sm mx-auto">
                  <div className="flex-1 px-3 py-2 bg-muted border rounded text-xs">
                    {settings.emailPlaceholder || "Email placeholder"}
                  </div>
                  <div 
                    className="px-3 py-2 text-white rounded text-xs font-medium"
                    style={{ backgroundColor: providerColors[settings.provider] }}
                  >
                    {settings.buttonText || "Subscribe"}
                  </div>
                </div>
                <div className="text-xs text-muted-foreground">
                  Powered by {settings.provider.charAt(0).toUpperCase() + settings.provider.slice(1)}
                </div>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
} 