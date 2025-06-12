import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ContentLock } from "@/types/page";

interface Props {
  settings: ContentLock;
  onChange: (settings: ContentLock) => void;
}

export function ContentLockSection({ settings, onChange }: Props) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Content Locker</CardTitle>
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
              <Label htmlFor="content">Locked Content</Label>
              <Textarea
                id="content"
                value={settings.content}
                onChange={(e) =>
                  onChange({ ...settings, content: e.target.value })
                }
                placeholder="Enter the content you want to lock..."
                className="min-h-[100px]"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="unlock-type">Unlock Method</Label>
              <Select
                value={settings.unlockType}
                onValueChange={(value: 'email' | 'click' | 'social') =>
                  onChange({ ...settings, unlockType: value })
                }
              >
                <SelectTrigger id="unlock-type">
                  <SelectValue placeholder="Select unlock method" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="email">Email Subscription</SelectItem>
                  <SelectItem value="click">Click Through</SelectItem>
                  <SelectItem value="social">Social Share</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {settings.unlockType !== 'social' && (
              <div className="grid gap-2">
                <Label htmlFor="redirect-url">Redirect URL (Optional)</Label>
                <Input
                  id="redirect-url"
                  value={settings.redirectUrl || ''}
                  onChange={(e) =>
                    onChange({ ...settings, redirectUrl: e.target.value })
                  }
                  placeholder="https://..."
                />
                <p className="text-sm text-muted-foreground">
                  Where to send users after they unlock the content.
                </p>
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
} 