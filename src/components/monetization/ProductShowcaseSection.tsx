import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { ProductShowcase } from "@/types/page";
import { ShoppingCart, Package, Star, X, Plus, ExternalLink } from "lucide-react";

interface Props {
  settings: ProductShowcase;
  onChange: (settings: ProductShowcase) => void;
}

export function ProductShowcaseSection({ settings, onChange }: Props) {
  const addProduct = () => {
    const newProduct = {
      id: Math.random().toString(36).substr(2, 9),
      name: "",
      description: "",
      price: "",
      imageUrl: "",
      buyUrl: "",
      featured: false
    };
    onChange({
      ...settings,
      products: [...settings.products, newProduct]
    });
  };

  const updateProduct = (index: number, updates: Partial<typeof settings.products[0]>) => {
    const newProducts = [...settings.products];
    newProducts[index] = { ...newProducts[index], ...updates };
    onChange({ ...settings, products: newProducts });
  };

  const removeProduct = (index: number) => {
    const newProducts = [...settings.products];
    newProducts.splice(index, 1);
    onChange({ ...settings, products: newProducts });
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center space-x-2">
          <ShoppingCart className="h-5 w-5 text-primary" />
          <CardTitle>Product Showcase</CardTitle>
        </div>
        <CardDescription>
          Display your products or services to convert 404 visitors into customers.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label className="text-base">Enable Product Showcase</Label>
            <p className="text-sm text-muted-foreground">
              Turn your 404 page into a sales opportunity
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
                <Label htmlFor="showcaseTitle">Title</Label>
                <Input
                  id="showcaseTitle"
                  placeholder="Our Products"
                  value={settings.title}
                  onChange={(e) => onChange({ ...settings, title: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>Products</Label>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={addProduct}
                  className="w-full"
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Add Product
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="showcaseDescription">Description</Label>
              <Textarea
                id="showcaseDescription"
                placeholder="Check out our amazing products..."
                value={settings.description}
                onChange={(e) => onChange({ ...settings, description: e.target.value })}
                rows={3}
              />
            </div>

            {settings.products.length > 0 && (
              <div className="space-y-4">
                <h4 className="font-medium">Products ({settings.products.length})</h4>
                {settings.products.map((product, index) => (
                  <div key={product.id} className="p-4 border rounded-lg space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Package className="h-4 w-4" />
                        <span className="font-medium">Product #{index + 1}</span>
                        {product.featured && (
                          <Star className="h-4 w-4 text-yellow-500 fill-current" />
                        )}
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => removeProduct(index)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Product Name</Label>
                        <Input
                          placeholder="Product name"
                          value={product.name}
                          onChange={(e) => updateProduct(index, { name: e.target.value })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Price</Label>
                        <Input
                          placeholder="$99.99"
                          value={product.price}
                          onChange={(e) => updateProduct(index, { price: e.target.value })}
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label>Description</Label>
                      <Textarea
                        placeholder="Product description..."
                        value={product.description}
                        onChange={(e) => updateProduct(index, { description: e.target.value })}
                        rows={2}
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Image URL</Label>
                        <Input
                          placeholder="https://example.com/image.jpg"
                          type="url"
                          value={product.imageUrl}
                          onChange={(e) => updateProduct(index, { imageUrl: e.target.value })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Buy URL</Label>
                        <Input
                          placeholder="https://store.com/product"
                          type="url"
                          value={product.buyUrl}
                          onChange={(e) => updateProduct(index, { buyUrl: e.target.value })}
                        />
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Switch
                        checked={product.featured || false}
                        onCheckedChange={(featured) => updateProduct(index, { featured })}
                      />
                      <Label className="text-sm">Featured Product</Label>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Preview */}
            <div className="mt-6 p-4 border rounded-lg bg-muted/50">
              <h4 className="text-sm font-medium mb-2 flex items-center">
                <ShoppingCart className="mr-2 h-4 w-4" />
                Preview
              </h4>
              <div className="p-4 bg-background border rounded-lg">
                <div className="text-center mb-4">
                  <div className="font-medium text-lg">{settings.title || "Our Products"}</div>
                  <div className="text-sm text-muted-foreground">
                    {settings.description || "Check out our amazing products"}
                  </div>
                </div>
                
                {settings.products.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {settings.products.slice(0, 3).map((product, index) => (
                      <div key={product.id} className="border rounded-lg p-3 relative">
                        {product.featured && (
                          <div className="absolute -top-2 -right-2 bg-yellow-500 text-white rounded-full p-1">
                            <Star className="h-3 w-3 fill-current" />
                          </div>
                        )}
                        <div className="aspect-square bg-muted rounded mb-2 flex items-center justify-center">
                          {product.imageUrl ? (
                            <img 
                              src={product.imageUrl} 
                              alt={product.name}
                              className="w-full h-full object-cover rounded"
                              onError={(e) => {
                                (e.target as HTMLImageElement).style.display = 'none';
                                (e.target as HTMLImageElement).nextElementSibling?.classList.remove('hidden');
                              }}
                            />
                          ) : (
                            <Package className="h-8 w-8 text-muted-foreground" />
                          )}
                        </div>
                        <div className="space-y-1">
                          <div className="font-medium text-sm">{product.name || "Product Name"}</div>
                          <div className="text-xs text-muted-foreground line-clamp-2">
                            {product.description || "Product description..."}
                          </div>
                          <div className="flex items-center justify-between">
                            <div className="font-bold text-sm text-primary">
                              {product.price || "$0.00"}
                            </div>
                            <ExternalLink className="h-3 w-3 text-muted-foreground" />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <Package className="h-12 w-12 mx-auto mb-2 opacity-50" />
                    <p className="text-sm">No products added yet</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
} 