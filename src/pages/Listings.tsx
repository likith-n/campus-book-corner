import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { SortOption } from "@/types";
import ListingCard from "@/components/common/ListingCard";
import SearchBar from "@/components/common/SearchBar";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Filter, X } from "lucide-react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { listingsAPI } from "@/services/api";
import { getImageUrl } from "@/lib/getImageUrl";
import { toast } from "sonner";

const Listings = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [listings, setListings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  
  const [sortBy, setSortBy] = useState<SortOption>(searchParams.get('sortBy') as SortOption || "newest");
  const [selectedSubjects, setSelectedSubjects] = useState<string[]>([]);
  const [selectedConditions, setSelectedConditions] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState([0, 1000]);
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || "");

  const subjects = ["Computer Science", "Chemistry", "Mechanical Engineering", "Electrical Engineering", "Biology"];
  const conditions = ["new", "good", "fair"];

  // Fetch listings whenever filters change
  useEffect(() => {
    fetchListings();
  }, [sortBy, selectedSubjects, selectedConditions, priceRange, searchQuery]);

  const fetchListings = async () => {
    setLoading(true);
    try {
      const params: any = {
        sortBy,
        limit: 50
      };

      if (searchQuery) params.search = searchQuery;
      if (selectedSubjects.length > 0) params.subject = selectedSubjects[0]; // API accepts one subject
      if (selectedConditions.length > 0) params.condition = selectedConditions[0]; // API accepts one condition
      if (priceRange[0] > 0) params.priceMin = priceRange[0];
      if (priceRange[1] < 1000) params.priceMax = priceRange[1];

      console.log('📚 Fetching listings with params:', params);
      
      const result = await listingsAPI.getAll(params);
      
      if (result.success) {
        setListings(result.data.listings);
        setTotal(result.data.pagination.total);
        console.log('✅ Fetched', result.data.listings.length, 'listings');
      }
    } catch (error: any) {
      console.error('❌ Failed to fetch listings:', error);
      toast.error('Failed to load listings. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const toggleSubject = (subject: string) => {
    setSelectedSubjects(prev =>
      prev.includes(subject) ? prev.filter(s => s !== subject) : [subject] // Only one at a time
    );
  };

  const toggleCondition = (condition: string) => {
    setSelectedConditions(prev =>
      prev.includes(condition) ? prev.filter(c => c !== condition) : [condition] // Only one at a time
    );
  };

  const clearFilters = () => {
    setSelectedSubjects([]);
    setSelectedConditions([]);
    setPriceRange([0, 1000]);
    setSearchQuery("");
    setSortBy("newest");
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    // Update URL params
    if (query) {
      searchParams.set('search', query);
    } else {
      searchParams.delete('search');
    }
    setSearchParams(searchParams);
  };

  const FilterPanel = () => (
    <div className="space-y-6">
      <div>
        <h3 className="mb-3 font-semibold">Subject</h3>
        <div className="space-y-2">
          {subjects.map((subject) => (
            <div key={subject} className="flex items-center space-x-2">
              <Checkbox
                id={`subject-${subject}`}
                checked={selectedSubjects.includes(subject)}
                onCheckedChange={() => toggleSubject(subject)}
              />
              <Label
                htmlFor={`subject-${subject}`}
                className="text-sm font-normal cursor-pointer"
              >
                {subject}
              </Label>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h3 className="mb-3 font-semibold">Condition</h3>
        <div className="space-y-2">
          {conditions.map((condition) => (
            <div key={condition} className="flex items-center space-x-2">
              <Checkbox
                id={`condition-${condition}`}
                checked={selectedConditions.includes(condition)}
                onCheckedChange={() => toggleCondition(condition)}
              />
              <Label
                htmlFor={`condition-${condition}`}
                className="text-sm font-normal cursor-pointer capitalize"
              >
                {condition}
              </Label>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h3 className="mb-3 font-semibold">Price Range</h3>
        <div className="space-y-4">
          <Slider
            value={priceRange}
            onValueChange={setPriceRange}
            max={1000}
            step={50}
            className="w-full"
          />
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <span>₹{priceRange[0]}</span>
            <span>₹{priceRange[1]}</span>
          </div>
        </div>
      </div>

      <Button onClick={clearFilters} variant="outline" className="w-full">
        <X className="mr-2 h-4 w-4" />
        Clear Filters
      </Button>
    </div>
  );

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="mb-4 text-3xl font-bold md:text-4xl">Browse Books</h1>
        <SearchBar onSearch={handleSearch} defaultValue={searchQuery} />
      </div>

      <div className="flex items-center justify-between mb-6">
        <p className="text-sm text-muted-foreground">
          {loading ? 'Loading...' : `Showing ${listings.length} of ${total} books`}
        </p>
        
        <div className="flex items-center gap-4">
          <Select value={sortBy} onValueChange={(value) => setSortBy(value as SortOption)}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="newest">Newest First</SelectItem>
              <SelectItem value="price-low">Price: Low to High</SelectItem>
              <SelectItem value="price-high">Price: High to Low</SelectItem>
              <SelectItem value="popular">Most Popular</SelectItem>
            </SelectContent>
          </Select>

          {/* Mobile Filter Button */}
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon" className="lg:hidden">
                <Filter className="h-4 w-4" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left">
              <SheetHeader>
                <SheetTitle>Filters</SheetTitle>
              </SheetHeader>
              <div className="mt-6">
                <FilterPanel />
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>

      <div className="flex gap-8">
        {/* Desktop Filter Sidebar */}
        <aside className="hidden w-64 shrink-0 lg:block">
          <div className="sticky top-24 rounded-lg border border-border bg-card p-6">
            <h2 className="mb-6 text-lg font-semibold">Filters</h2>
            <FilterPanel />
          </div>
        </aside>

        {/* Listings Grid */}
        <div className="flex-1">
          {loading ? (
            <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="h-96 animate-pulse rounded-lg bg-muted" />
              ))}
            </div>
          ) : listings.length > 0 ? (
            <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
              {listings.map((listing) => {
                let imageUrl = '/placeholder.svg';
                if (listing.image_urls) {
                  try {
                    const images = JSON.parse(listing.image_urls);
                    imageUrl = getImageUrl(images[0]);
                  } catch {
                    imageUrl = '/placeholder.svg';
                  }
                }
                
                return (
                  <ListingCard 
                    key={listing.listing_id} 
                    book={{
                     book_id: listing.listing_id.toString(),
                      title: listing.title,
                      author: listing.author,
                      edition: listing.edition || '',
                      subject: listing.subject,
                      condition: listing.condition_type,
                      price: parseFloat(listing.price),
                      description: listing.listing_description || '',
                      images: [imageUrl],
                      ownerId: listing.owner_id.toString(),
                      ownerName: listing.owner_name,
                      ownerRating: listing.owner_rating || 0,
                      createdAt: listing.created_at
                    }} 
                  />
                );
              })}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-muted-foreground mb-4">No books found matching your filters.</p>
              <Button onClick={clearFilters} variant="outline">
                Clear Filters
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Listings;
