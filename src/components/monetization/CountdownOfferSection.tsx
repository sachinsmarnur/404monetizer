import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { DateTimePicker } from "@/components/ui/date-time-picker";
import { CountdownOffer } from "@/types/page";

interface Props {
  settings: CountdownOffer;
  onChange: (settings: CountdownOffer) => void;
}

export function CountdownOfferSection({ settings, onChange }: Props) {
  const handleDateTimeChange = (date: Date | undefined) => {
    if (date) {
      onChange({ ...settings, expiryDate: date.toISOString() });
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Countdown Offer</CardTitle>
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
              <Label htmlFor="title">Offer Title</Label>
              <Input
                id="title"
                value={settings.title}
                onChange={(e) =>
                  onChange({ ...settings, title: e.target.value })
                }
                placeholder="Enter offer title..."
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="description">Offer Description</Label>
              <Textarea
                id="description"
                value={settings.description}
                onChange={(e) =>
                  onChange({ ...settings, description: e.target.value })
                }
                placeholder="Enter offer description..."
              />
            </div>
            <div className="grid gap-2">
              <Label>Expiry Date & Time</Label>
              <DateTimePicker
                value={settings.expiryDate ? new Date(settings.expiryDate) : undefined}
                onChange={handleDateTimeChange}
                placeholder="Select offer expiry date and time"
              />
              <p className="text-sm text-muted-foreground">
                Set when this offer will expire and the countdown will end.
              </p>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="button-text">Button Text</Label>
              <Input
                id="button-text"
                value={settings.buttonText}
                onChange={(e) =>
                  onChange({ ...settings, buttonText: e.target.value })
                }
                placeholder="Claim Offer"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="redirect-url">Redirect URL</Label>
              <Input
                id="redirect-url"
                value={settings.redirectUrl}
                onChange={(e) =>
                  onChange({ ...settings, redirectUrl: e.target.value })
                }
                placeholder="https://..."
              />
              <p className="text-sm text-muted-foreground">
                Where to send users when they click the offer button.
              </p>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
} 