import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import SearchBar from "@/components/common/SearchBar";
import ListingCard from "@/components/common/ListingCard";
import { mockBooks } from "@/data/mockData";
import { ArrowRight, BookOpen, Users, Zap } from "lucide-react";
import heroImage from "@/assets/hero-books.jpg";

const Index = () => {
  const featuredBooks = mockBooks.slice(0, 4);

  const handleSearch = (query: string) => {
    console.log("Search query:", query);
    // Navigate to listings page with query
    window.location.href = `/listings?q=${encodeURIComponent(query)}`;
  };

  return (
    <div className="animate-fade-in">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary via-primary-hover to-purple-700 text-primary-foreground">
        <div className="absolute inset-0 opacity-10">
          <img 
            src={heroImage} 
            alt="" 
            className="h-full w-full object-cover"
          />
        </div>
        <div className="container relative mx-auto px-4 py-20 md:py-32">
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="mb-6 text-4xl font-bold tracking-tight md:text-6xl">
              Buy & Sell Academic Books,{" "}
              <span className="text-secondary">Save Money</span>
            </h1>
            <p className="mb-8 text-lg md:text-xl opacity-90">
              Connect with fellow students. Exchange used textbooks. Get the books you need at prices you'll love.
            </p>
            <div className="mx-auto max-w-2xl">
              <SearchBar onSearch={handleSearch} />
            </div>
            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <Button asChild size="lg" variant="secondary" className="gap-2">
                <Link to="/listings">
                  Browse Books <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="border-white/20 bg-white/10 text-white hover:bg-white/20">
                <Link to="/sell">List Your Books</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 md:py-24 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-3xl font-bold md:text-4xl">How BookShare Works</h2>
            <p className="text-lg text-muted-foreground">Three simple steps to start saving</p>
          </div>
          
          <div className="grid gap-8 md:grid-cols-3">
            <div className="text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary text-primary-foreground">
                <BookOpen className="h-8 w-8" />
              </div>
              <h3 className="mb-2 text-xl font-semibold">1. List Your Books</h3>
              <p className="text-muted-foreground">
                Upload photos, set your price, and describe the condition. Takes less than 2 minutes!
              </p>
            </div>
            
            <div className="text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-secondary text-secondary-foreground">
                <Users className="h-8 w-8" />
              </div>
              <h3 className="mb-2 text-xl font-semibold">2. Connect & Negotiate</h3>
              <p className="text-muted-foreground">
                Students contact you directly. Chat, negotiate, and arrange a meetup on campus.
              </p>
            </div>
            
            <div className="text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-success text-success-foreground">
                <Zap className="h-8 w-8" />
              </div>
              <h3 className="mb-2 text-xl font-semibold">3. Exchange & Save</h3>
              <p className="text-muted-foreground">
                Meet safely on campus, exchange books, and save money. Rate each other to build trust.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Listings */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="mb-8 flex items-center justify-between">
            <div>
              <h2 className="text-3xl font-bold md:text-4xl">Featured Books</h2>
              <p className="mt-2 text-muted-foreground">Recently listed by students near you</p>
            </div>
            <Button asChild variant="outline">
              <Link to="/listings">View All</Link>
            </Button>
          </div>
          
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {featuredBooks.map((book) => (
              <ListingCard key={book.id} book={book} />
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-primary text-primary-foreground py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="mb-4 text-3xl font-bold md:text-4xl">
            Can't find your book? Request it!
          </h2>
          <p className="mb-8 text-lg opacity-90">
            We'll notify owners who have the book you're looking for.
          </p>
          <Button asChild size="lg" variant="secondary">
            <Link to="/listings">Start Searching</Link>
          </Button>
        </div>
      </section>
    </div>
  );
};

export default Index;
