import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Trash2, Link, Image, FileText } from "lucide-react";
import { AffiliateLink } from "@/types/page";

interface Props {
  links: AffiliateLink[];
  onChange: (links: AffiliateLink[]) => void;
}

export function AffiliateLinksSection({ links, onChange }: Props) {
  const isEnabled = links.length > 0;

  const addLink = () => {
    const newLink: AffiliateLink = {
      id: Date.now().toString(),
      title: "",
      url: "",
      imageUrl: "",
      description: ""
    };
    onChange([...links, newLink]);
  };

  const updateLink = (id: string, updates: Partial<AffiliateLink>) => {
    onChange(links.map(link => 
      link.id === id ? { ...link, ...updates } : link
    ));
  };

  const removeLink = (id: string) => {
    onChange(links.filter(link => link.id !== id));
  };

  const toggleEnabled = () => {
    if (isEnabled) {
      onChange([]);
    } else {
      addLink();
    }
  };

  return (
    <div className="space-y-6">
      {/* Header with toggle */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-2">
            <Label htmlFor="affiliate-enabled" className="text-base font-medium">
              Enable Affiliate Links
            </Label>
            <Switch
              id="affiliate-enabled"
              checked={isEnabled}
              onCheckedChange={toggleEnabled}
            />
          </div>
          {isEnabled && (
            <Badge variant="default" className="ml-2">
              {links.length} link{links.length !== 1 ? 's' : ''}
            </Badge>
          )}
        </div>
        
        {isEnabled && (
          <Button
            onClick={addLink}
            size="sm"
            className="gap-2"
          >
            <Plus className="h-4 w-4" />
            Add Link
          </Button>
        )}
      </div>

      {/* Description */}
      <div className="text-sm text-muted-foreground">
        {isEnabled 
          ? "Create affiliate links that will be displayed as attractive cards on your 404 page."
          : "Promote affiliate products and earn commissions by displaying attractive product cards."
        }
      </div>

      {/* Links configuration */}
      <AnimatePresence>
        {isEnabled && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="space-y-4"
          >
            {links.length === 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-8 border-2 border-dashed border-muted rounded-lg"
              >
                <Link className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">No affiliate links yet</h3>
                <p className="text-muted-foreground mb-4">
                  Add your first affiliate link to start monetizing your 404 page
                </p>
                <Button onClick={addLink} variant="default">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Your First Link
                </Button>
              </motion.div>
            )}

            {links.map((link, index) => (
              <motion.div
                key={link.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.2, delay: index * 0.1 }}
              >
                <Card className="relative">
                  <CardHeader className="pb-4">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">
                        Affiliate Link {index + 1}
                      </CardTitle>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeLink(link.id)}
                        className="text-muted-foreground hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                    <CardDescription>
                      Configure your affiliate link details and appearance
                    </CardDescription>
                  </CardHeader>
                  
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor={`link-title-${link.id}`} className="flex items-center gap-2">
                          <FileText className="h-4 w-4" />
                          Title
                        </Label>
                        <Input
                          id={`link-title-${link.id}`}
                          value={link.title}
                          onChange={(e) => updateLink(link.id, { title: e.target.value })}
                          placeholder="Product or service name"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor={`link-url-${link.id}`} className="flex items-center gap-2">
                          <Link className="h-4 w-4" />
                          Affiliate URL
                        </Label>
                        <Input
                          id={`link-url-${link.id}`}
                          value={link.url}
                          onChange={(e) => updateLink(link.id, { url: e.target.value })}
                          placeholder="https://your-affiliate-link.com"
                          type="url"
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor={`link-image-${link.id}`} className="flex items-center gap-2">
                        <Image className="h-4 w-4" />
                        Image URL (optional)
                      </Label>
                      <Input
                        id={`link-image-${link.id}`}
                        value={link.imageUrl || ""}
                        onChange={(e) => updateLink(link.id, { imageUrl: e.target.value })}
                        placeholder="https://image-url.com/product.jpg"
                        type="url"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor={`link-description-${link.id}`}>
                        Description (optional)
                      </Label>
                      <Textarea
                        id={`link-description-${link.id}`}
                        value={link.description || ""}
                        onChange={(e) => updateLink(link.id, { description: e.target.value })}
                        placeholder="Brief description of the product or service"
                        rows={3}
                      />
                    </div>

                    {/* Preview */}
                    {(link.title || link.description || link.imageUrl) && (
                      <div className="mt-4 p-4 bg-muted/50 rounded-lg">
                        <Label className="text-sm font-medium text-muted-foreground mb-2 block">
                          Preview
                        </Label>
                        <div className="bg-background border rounded-lg p-4 max-w-sm">
                          {link.imageUrl && (
                            <img
                              src={link.imageUrl}
                              alt={link.title}
                              className="w-full h-32 object-cover rounded-md mb-3"
                              onError={(e) => {
                                e.currentTarget.style.display = 'none';
                              }}
                            />
                          )}
                          {link.title && (
                            <h4 className="font-medium mb-2">{link.title}</h4>
                          )}
                          {link.description && (
                            <p className="text-sm text-muted-foreground mb-3">
                              {link.description}
                            </p>
                          )}
                          <div className="text-xs text-muted-foreground">
                            Click to visit affiliate link
                          </div>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
} 