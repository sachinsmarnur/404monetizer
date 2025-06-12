import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { SponsoredContent } from "@/types/page";
import { Star, ExternalLink, ImageIcon } from "lucide-react";

interface Props {
  settings: SponsoredContent;
  onChange: (settings: SponsoredContent) => void;
}

export function SponsoredContentSection({ settings, onChange }: Props) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center space-x-2">
          <Star className="h-5 w-5 text-primary" />
          <CardTitle>Sponsored Content</CardTitle>
        </div>
        <CardDescription>
          Promote sponsored products or services with an attractive banner or card.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label className="text-base">Enable Sponsored Content</Label>
            <p className="text-sm text-muted-foreground">
              Display sponsored content to monetize your 404 page
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
                <Label htmlFor="sponsoredTitle">Title</Label>
                <Input
                  id="sponsoredTitle"
                  placeholder="Amazing Product"
                  value={settings.title}
                  onChange={(e) => onChange({ ...settings, title: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="sponsorName">Sponsor Name</Label>
                <Input
                  id="sponsorName"
                  placeholder="Brand Name"
                  value={settings.sponsorName}
                  onChange={(e) => onChange({ ...settings, sponsorName: e.target.value })}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="sponsoredDescription">Description</Label>
              <Textarea
                id="sponsoredDescription"
                placeholder="Describe the sponsored content and its benefits..."
                value={settings.description}
                onChange={(e) => onChange({ ...settings, description: e.target.value })}
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="imageUrl">Image URL</Label>
              <Input
                id="imageUrl"
                placeholder="https://example.com/image.jpg"
                value={settings.imageUrl}
                onChange={(e) => onChange({ ...settings, imageUrl: e.target.value })}
                type="url"
              />
              <p className="text-xs text-muted-foreground">
                High-quality image for the sponsored content (recommended: 400x200px)
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="redirectUrl">Target URL</Label>
                <Input
                  id="redirectUrl"
                  placeholder="https://sponsor-website.com"
                  value={settings.redirectUrl}
                  onChange={(e) => onChange({ ...settings, redirectUrl: e.target.value })}
                  type="url"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="buttonText">Button Text</Label>
                <Input
                  id="buttonText"
                  placeholder="Learn More"
                  value={settings.buttonText}
                  onChange={(e) => onChange({ ...settings, buttonText: e.target.value })}
                />
              </div>
            </div>

            {/* Preview */}
            <div className="mt-6 p-4 border rounded-lg bg-muted/50">
              <h4 className="text-sm font-medium mb-2 flex items-center">
                <Star className="mr-2 h-4 w-4" />
                Preview
              </h4>
              <div className="flex items-start space-x-4 p-4 bg-background border rounded-lg">
                <div className="w-20 h-12 bg-muted rounded flex items-center justify-center">
                  {settings.imageUrl ? (
                    <img 
                      src={settings.imageUrl} 
                      alt="Preview" 
                      className="w-full h-full object-cover rounded"
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = 'none';
                        (e.target as HTMLImageElement).nextElementSibling?.classList.remove('hidden');
                      }}
                    />
                  ) : (
                    <ImageIcon className="h-6 w-6 text-muted-foreground" />
                  )}
                </div>
                <div className="flex-1 space-y-1">
                  <div className="flex items-center justify-between">
                    <div className="font-medium text-sm">{settings.title || "Sponsored Content Title"}</div>
                    <div className="text-xs text-muted-foreground">
                      Sponsored by {settings.sponsorName || "Brand"}
                    </div>
                  </div>
                  <div className="text-xs text-muted-foreground line-clamp-2">
                    {settings.description || "Description of the sponsored content..."}
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="px-2 py-1 bg-primary text-primary-foreground rounded text-xs">
                      {settings.buttonText || "Learn More"}
                    </div>
                    <ExternalLink className="h-3 w-3 text-muted-foreground" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
} 