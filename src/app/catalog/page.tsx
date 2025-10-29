'use client';

import { Helmet } from 'react-helmet-async';
import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/auth-context';
import { useCart } from '@/lib/cart-context';
import { useWishlist } from '@/lib/wishlist-context';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Heart, Search, ShoppingCart, Star, Grid, List } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { toast } from 'sonner';
import { useCurrency } from '@/lib/use-currency';

interface Product {
  id: string;
  name: string;
  description: string | null;
  price: number;
  stock_quantity: number;
  image_url: string;
  category?: string;
  rating?: number;
  reviews?: number;
}

export default function CatalogPage() {
  const { user } = useAuth();
  const { formatCurrency } = useCurrency();
  const { addToCart, getCartCount } = useCart();
  const { addToWishlist, isInWishlist, getWishlistCount } = useWishlist();
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('name');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [loading, setLoading] = useState(true);

  // Fetch products
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch('/api/products');
        if (response.ok) {
          const result = await response.json();
          if (result.success && Array.isArray(result.data)) {
            setProducts(result.data);
            setFilteredProducts(result.data);
          } else {
            console.error('Invalid response format:', result);
            toast.error('Invalid response format');
          }
        } else {
          toast.error('Failed to load products');
        }
      } catch (error) {
        console.error('Error fetching products:', error);
        toast.error('Failed to load products');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts().then(r => r);
  }, []);

  // Filter and search products
  useEffect(() => {
    let filtered = products;

    if (searchTerm) {
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (product.description && product.description.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    // Sort products
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'price-low':
          return a.price - b.price;
        case 'price-high':
          return b.price - a.price;
        case 'rating':
          return (b.rating || 0) - (a.rating || 0);
        default:
          return 0;
      }
    });

    setFilteredProducts(filtered);
  }, [products, searchTerm, sortBy]);

  const handleAddToWishlist = (productId: string) => {
    if (!user) {
      toast.error('Please login to add to wishlist');
      return;
    }

    const wasInWishlist = isInWishlist(productId);
    addToWishlist(productId);
    toast.success(wasInWishlist ? 'Removed from wishlist' : 'Added to wishlist');
  };

  const handleAddToCart = (productId: string) => {
    if (!user) {
      toast.error('Please login to add to cart');
      return;
    }

    const product = products.find(p => p.id === productId);
    if (product) {
      // Ensure description is not null for cart storage
      const cartProduct = {
        ...product,
        description: product.description || 'No description available'
      };
      addToCart(cartProduct);
      toast.success('Added to cart');
    }
  };

  const formatPrice = (price: number) => {
    return formatCurrency(price);
  };


  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
              <p>Loading products...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>Product Catalog | AdminKit Pro</title>
        <meta name="description" content="Browse our complete product catalog with detailed descriptions and prices" />
        <meta name="keywords" content="products, catalog, shop, ecommerce" />
      </Helmet>

      {/* Header */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-white to-slate-200 bg-clip-text text-transparent">
                Product Catalog
              </h1>
              <p className="text-slate-300 mt-3 text-lg">
                Discover amazing products at great prices
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <Link href="/cart">
                <Button variant="outline" size="sm" className="bg-white/10 border-white/20 text-white hover:bg-white/20">
                  <ShoppingCart className="h-4 w-4 mr-2" />
                  Cart ({getCartCount()})
                </Button>
              </Link>
              <Link href="/wishlist">
                <Button variant="outline" size="sm" className="bg-white/10 border-white/20 text-white hover:bg-white/20">
                  <Heart className="h-4 w-4 mr-2" />
                  Wishlist ({getWishlistCount()})
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Search and Filters */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="flex-1 max-w-md">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search products..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="name">Name</SelectItem>
                  <SelectItem value="price-low">Price: Low to High</SelectItem>
                  <SelectItem value="price-high">Price: High to Low</SelectItem>
                  <SelectItem value="rating">Rating</SelectItem>
                </SelectContent>
              </Select>

              <div className="flex border rounded-md">
                <Button
                  variant={viewMode === 'grid' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('grid')}
                  className="rounded-r-none"
                >
                  <Grid className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === 'list' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('list')}
                  className="rounded-l-none"
                >
                  <List className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Products Grid */}
        {!Array.isArray(filteredProducts) || filteredProducts.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground text-lg">No products found</p>
            <p className="text-muted-foreground">Try adjusting your search or filters</p>
          </div>
        ) : (
          <div className={`grid gap-6 ${
            viewMode === 'grid' 
              ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' 
              : 'grid-cols-1'
          }`}>
            {filteredProducts.map((product) => (
              <Card key={product.id} className="group hover:shadow-lg transition-shadow">
                <CardHeader className="p-0">
                  <div className="relative">
                    <div className="aspect-square overflow-hidden rounded-t-lg">
                      {product.image_url ? (
                        <Image
                          src={product.image_url}
                          alt={product.name}
                          width={300}
                          height={300}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      ) : (
                        <div className="w-full h-full bg-muted flex items-center justify-center">
                          <span className="text-muted-foreground">No Image</span>
                        </div>
                      )}
                    </div>
                    
                    {/* Wishlist Button */}
                    <Button
                      size="sm"
                      variant="secondary"
                      className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={() => handleAddToWishlist(product.id)}
                    >
                      <Heart 
                        className={`h-4 w-4 ${
                          isInWishlist(product.id) ? 'fill-red-500 text-red-500' : ''
                        }`} 
                      />
                    </Button>

                    {/* Stock Badge */}
                    {product.stock_quantity === 0 && (
                      <Badge variant="destructive" className="absolute top-2 left-2">
                        Out of Stock
                      </Badge>
                    )}
                  </div>
                </CardHeader>
                
                <CardContent className="p-4">
                  <div className="space-y-2">
                    <CardTitle className="text-lg line-clamp-2">{product.name}</CardTitle>
                    <CardDescription className="line-clamp-2">
                      {product.description || 'No description available'}
                    </CardDescription>
                    
                    <div className="flex items-center space-x-2">
                      <div className="flex items-center">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`h-4 w-4 ${
                              i < (product.rating || 0) ? 'text-yellow-400 fill-current' : 'text-gray-300'
                            }`}
                          />
                        ))}
                      </div>
                      <span className="text-sm text-muted-foreground">
                        ({product.reviews || 0} reviews)
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="text-2xl font-bold text-primary">
                        {formatPrice(product.price)}
                      </div>
                      <Badge variant={product.stock_quantity > 0 ? 'default' : 'destructive'}>
                        {product.stock_quantity > 0 ? 'In Stock' : 'Out of Stock'}
                      </Badge>
                    </div>

                    <div className="flex space-x-2">
                      <Button
                        className="flex-1"
                        onClick={() => handleAddToCart(product.id)}
                        disabled={product.stock_quantity === 0}
                      >
                        <ShoppingCart className="h-4 w-4 mr-2" />
                        Add to Cart
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleAddToWishlist(product.id)}
                      >
                        <Heart 
                          className={`h-4 w-4 ${
                            isInWishlist(product.id) ? 'fill-red-500 text-red-500' : ''
                          }`} 
                        />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Results Summary */}
        <div className="mt-8 text-center text-muted-foreground">
          Showing {Array.isArray(filteredProducts) ? filteredProducts.length : 0} of {Array.isArray(products) ? products.length : 0} products
        </div>
      </div>
    </div>
  );
}
