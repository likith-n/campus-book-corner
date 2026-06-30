import { useParams, Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ListingCard from "@/components/common/ListingCard";
import { Star, MapPin, BookOpen, Calendar, Edit, Loader2 } from "lucide-react";
import { usersAPI, listingsAPI } from "@/services/api";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";

const Profile = () => {
  const { userId } = useParams();
  const { user: currentUser } = useAuth();
  const [user, setUser] = useState<any>(null);
  const [listings, setListings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (userId) {
      fetchUserData();
    }
  }, [userId]);

  const fetchUserData = async () => {
    setLoading(true);
    try {
      console.log('👤 Fetching user profile:', userId);
      
      // Fetch user profile
      const userResult = await usersAPI.getProfile(userId!);
      console.log('📥 User result:', userResult);
      
      if (userResult.success) {
        setUser(userResult.data);
        
        // Fetch user's listings
        const listingsResult = await listingsAPI.getUserListings(userId!, 'all');
        console.log('📚 Listings result:', listingsResult);
        
        if (listingsResult.success) {
          setListings(listingsResult.data || []);
        }
      } else {
        toast.error('User not found');
      }
    } catch (error: any) {
      console.error('❌ Failed to fetch profile:', error);
      toast.error(error.message || 'Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-16 flex justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-bold">User not found</h1>
        <Button asChild className="mt-4">
          <Link to="/">Back to Home</Link>
        </Button>
      </div>
    );
  }

  const isOwnProfile = currentUser?.user_id === parseInt(userId!);
  const activeListings = listings.filter(l => l.status === 'available');
  const soldListings = listings.filter(l => l.status === 'sold');

  return (
    <div className="container mx-auto max-w-6xl px-4 py-8 animate-fade-in">
      {/* Profile Header */}
      <Card className="mb-8">
        <CardContent className="pt-6">
          <div className="flex flex-col items-start gap-6 sm:flex-row">
            <Avatar className="h-24 w-24">
              <AvatarFallback className="bg-primary text-primary-foreground text-3xl">
                {user.name.split(" ").map((n: string) => n[0]).join("")}
              </AvatarFallback>
            </Avatar>

            <div className="flex-1">
              <div className="mb-4 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <h1 className="text-3xl font-bold">{user.name}</h1>
                  <p className="mt-1 text-muted-foreground">
                    {user.year && user.department ? `${user.year}, ${user.department}` : user.email}
                  </p>
                </div>
                
                {isOwnProfile && (
                  <Button variant="outline" size="sm" className="gap-2 sm:mt-0">
                    <Edit className="h-4 w-4" />
                    Edit Profile
                  </Button>
                )}
              </div>

              <div className="grid gap-4 sm:grid-cols-3">
                <div className="flex items-center gap-2 text-sm">
                  <Star className="h-5 w-5 fill-secondary text-secondary" />
                  <div>
                    <p className="font-semibold">{user.rating || 0}</p>
                    <p className="text-xs text-muted-foreground">
                      Rating {user.total_ratings ? `(${user.total_ratings})` : ''}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-sm">
                  <BookOpen className="h-5 w-5 text-primary" />
                  <div>
                    <p className="font-semibold">{user.stats?.active_listings || activeListings.length}</p>
                    <p className="text-xs text-muted-foreground">Active Listings</p>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-sm">
                  <MapPin className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="font-semibold">{user.location || 'Not set'}</p>
                    <p className="text-xs text-muted-foreground">Location</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Profile Tabs */}
      <Tabs defaultValue="listings">
        <TabsList>
          <TabsTrigger value="listings">Active Listings ({activeListings.length})</TabsTrigger>
          <TabsTrigger value="sold">Sold ({soldListings.length})</TabsTrigger>
          <TabsTrigger value="reviews">Reviews (0)</TabsTrigger>
        </TabsList>

        <TabsContent value="listings" className="mt-6">
          {activeListings.length === 0 ? (
            <Card>
              <CardContent className="py-16 text-center">
                <BookOpen className="mx-auto mb-4 h-12 w-12 text-muted-foreground" />
                <h3 className="mb-2 font-semibold">No active listings</h3>
                <p className="mb-4 text-sm text-muted-foreground">
                  {isOwnProfile ? "Start listing your books to help fellow students!" : "This user hasn't listed any books yet."}
                </p>
                {isOwnProfile && (
                  <Button asChild>
                    <Link to="/sell">List a Book</Link>
                  </Button>
                )}
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {activeListings.map((listing) => {
                // Parse image URLs
                let imageUrl = '/placeholder.svg';
                if (listing.image_urls) {
                  try {
                    const images = JSON.parse(listing.image_urls);
                    imageUrl = images[0] || imageUrl;
                  } catch {
                    imageUrl = listing.image_urls.split(',')[0] || imageUrl;
                  }
                }

                return (
                  <ListingCard 
                    key={listing.listing_id} 
                    book={{
                      id: listing.listing_id.toString(),
                      title: listing.title,
                      author: listing.author,
                      edition: listing.edition || '',
                      subject: listing.subject,
                      condition: listing.condition_type,
                      price: parseFloat(listing.price),
                      description: listing.description || '',
                      images: [imageUrl],
                      ownerId: userId!,
                      ownerName: user.name,
                      ownerRating: user.rating || 0,
                      createdAt: listing.created_at
                    }} 
                  />
                );
              })}
            </div>
          )}
        </TabsContent>

        <TabsContent value="sold" className="mt-6">
          {soldListings.length === 0 ? (
            <Card>
              <CardContent className="py-16 text-center">
                <Calendar className="mx-auto mb-4 h-12 w-12 text-muted-foreground" />
                <h3 className="mb-2 font-semibold">No sold items yet</h3>
                <p className="text-sm text-muted-foreground">
                  Completed transactions will appear here
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {soldListings.map((listing) => {
                let imageUrl = '/placeholder.svg';
                if (listing.image_urls) {
                  try {
                    const images = JSON.parse(listing.image_urls);
                    imageUrl = images[0] || imageUrl;
                  } catch {
                    imageUrl = listing.image_urls.split(',')[0] || imageUrl;
                  }
                }

                return (
                  <ListingCard 
                    key={listing.listing_id} 
                    book={{
                      id: listing.listing_id.toString(),
                      title: listing.title,
                      author: listing.author,
                      edition: listing.edition || '',
                      subject: listing.subject,
                      condition: listing.condition_type,
                      price: parseFloat(listing.price),
                      description: listing.description || '',
                      images: [imageUrl],
                      ownerId: userId!,
                      ownerName: user.name,
                      ownerRating: user.rating || 0,
                      createdAt: listing.created_at
                    }} 
                  />
                );
              })}
            </div>
          )}
        </TabsContent>

        <TabsContent value="reviews" className="mt-6">
          <Card>
            <CardContent className="py-16 text-center">
              <Star className="mx-auto mb-4 h-12 w-12 text-muted-foreground" />
              <h3 className="mb-2 font-semibold">No reviews yet</h3>
              <p className="text-sm text-muted-foreground">
                Complete transactions to start receiving reviews
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Profile;
