import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { AdSense } from "@/types/page";

interface Props {
  settings: AdSense;
  onChange: (settings: AdSense) => void;
}

export function AdSenseSection({ settings, onChange }: Props) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Google AdSense</CardTitle>
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
              <Label htmlFor="adsense-code">AdSense Code</Label>
              <Textarea
                id="adsense-code"
                value={settings.code}
                onChange={(e) =>
                  onChange({ ...settings, code: e.target.value })
                }
                placeholder="Paste your AdSense code here..."
                className="font-mono"
              />
              <p className="text-sm text-muted-foreground">
                Paste your AdSense code snippet from Google AdSense dashboard.
              </p>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="placement">Ad Placement</Label>
              <Select
                value={settings.placement}
                onValueChange={(value: 'top' | 'bottom' | 'custom') =>
                  onChange({ ...settings, placement: value })
                }
              >
                <SelectTrigger id="placement">
                  <SelectValue placeholder="Select ad placement" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="top">Top of Page</SelectItem>
                  <SelectItem value="bottom">Bottom of Page</SelectItem>
                  <SelectItem value="custom">Custom Position</SelectItem>
                </SelectContent>
              </Select>
              {settings.placement === 'custom' && (
                <p className="text-sm text-muted-foreground">
                  For custom placement, you'll need to add a div with id="adsense-container" in your custom HTML where you want the ad to appear.
                </p>
              )}
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
} 