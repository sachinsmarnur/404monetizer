import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { EmailCollection } from "@/types/page";

interface Props {
  settings: EmailCollection;
  onChange: (settings: EmailCollection) => void;
}

export function EmailCollectionSection({ settings, onChange }: Props) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Email Collection</CardTitle>
          <Switch
            checked={settings.enabled}
            onCheckedChange={(checked) =>
              onChange({ ...settings, enabled: checked })
            }
          />
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {settings.enabled && (
          <>
            <div className="grid gap-2">
              <Label htmlFor="title">Form Title</Label>
              <Input
                id="title"
                value={settings.title}
                onChange={(e) =>
                  onChange({ ...settings, title: e.target.value })
                }
                placeholder="Enter form title..."
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="description">Form Description</Label>
              <Textarea
                id="description"
                value={settings.description}
                onChange={(e) =>
                  onChange({ ...settings, description: e.target.value })
                }
                placeholder="Enter form description..."
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="button-text">Button Text</Label>
              <Input
                id="button-text"
                value={settings.buttonText}
                onChange={(e) =>
                  onChange({ ...settings, buttonText: e.target.value })
                }
                placeholder="Subscribe"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="email-placeholder">Email Placeholder</Label>
              <Input
                id="email-placeholder"
                value={settings.emailPlaceholder}
                onChange={(e) =>
                  onChange({ ...settings, emailPlaceholder: e.target.value })
                }
                placeholder="Enter your email..."
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="webhook-url">Webhook URL (Optional)</Label>
              <Input
                id="webhook-url"
                value={settings.webhookUrl || ''}
                onChange={(e) =>
                  onChange({ ...settings, webhookUrl: e.target.value })
                }
                placeholder="https://..."
              />
              <p className="text-sm text-muted-foreground">
                Collected emails will be sent to this webhook URL.
              </p>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="success-message">Success Message</Label>
              <Input
                id="success-message"
                value={settings.successMessage}
                onChange={(e) =>
                  onChange({ ...settings, successMessage: e.target.value })
                }
                placeholder="Thank you for subscribing!"
              />
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
} 