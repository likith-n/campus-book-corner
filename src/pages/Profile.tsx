import { useParams, Link } from "react-router-dom";
import { mockUsers, mockBooks } from "@/data/mockData";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ListingCard from "@/components/common/ListingCard";
import { Star, MapPin, BookOpen, Calendar, Edit } from "lucide-react";

const Profile = () => {
  const { userId } = useParams();
  const user = mockUsers.find((u) => u.id === userId);
  const userListings = mockBooks.filter((b) => b.ownerId === userId);

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

  const isOwnProfile = userId === "1"; // Mock: assuming user 1 is the logged-in user

  return (
    <div className="container mx-auto max-w-6xl px-4 py-8 animate-fade-in">
      {/* Profile Header */}
      <Card className="mb-8">
        <CardContent className="pt-6">
          <div className="flex flex-col items-start gap-6 sm:flex-row">
            <Avatar className="h-24 w-24">
              <AvatarFallback className="bg-primary text-primary-foreground text-3xl">
                {user.name.split(" ").map(n => n[0]).join("")}
              </AvatarFallback>
            </Avatar>

            <div className="flex-1">
              <div className="mb-4 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <h1 className="text-3xl font-bold">{user.name}</h1>
                  <p className="mt-1 text-muted-foreground">
                    {user.year}, {user.department}
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
                    <p className="font-semibold">{user.rating}</p>
                    <p className="text-xs text-muted-foreground">Rating</p>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-sm">
                  <BookOpen className="h-5 w-5 text-primary" />
                  <div>
                    <p className="font-semibold">{userListings.length}</p>
                    <p className="text-xs text-muted-foreground">Active Listings</p>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-sm">
                  <MapPin className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="font-semibold">{user.location}</p>
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
          <TabsTrigger value="listings">Active Listings ({userListings.length})</TabsTrigger>
          <TabsTrigger value="sold">Sold (0)</TabsTrigger>
          <TabsTrigger value="reviews">Reviews (0)</TabsTrigger>
        </TabsList>

        <TabsContent value="listings" className="mt-6">
          {userListings.length === 0 ? (
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
              {userListings.map((book) => (
                <ListingCard key={book.id} book={book} />
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="sold" className="mt-6">
          <Card>
            <CardContent className="py-16 text-center">
              <Calendar className="mx-auto mb-4 h-12 w-12 text-muted-foreground" />
              <h3 className="mb-2 font-semibold">No sold items yet</h3>
              <p className="text-sm text-muted-foreground">
                Completed transactions will appear here
              </p>
            </CardContent>
          </Card>
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
