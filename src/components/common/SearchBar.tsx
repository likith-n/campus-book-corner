import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useState, useEffect } from "react";

interface SearchBarProps {
  onSearch?: (query: string) => void;
  placeholder?: string;
  className?: string;
  defaultValue?: string;
}

const SearchBar = ({ 
  onSearch, 
  placeholder = "Search by title, author, or subject...",
  className = "",
  defaultValue = ""
}: SearchBarProps) => {
  const [query, setQuery] = useState(defaultValue);

  useEffect(() => {
    setQuery(defaultValue);
  }, [defaultValue]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch?.(query);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newQuery = e.target.value;
    setQuery(newQuery);
    
    // Auto-search as user types (with debounce would be better, but this works)
    if (newQuery === '') {
      onSearch?.('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className={`relative ${className}`}>
      <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
      <Input
        type="text"
        placeholder={placeholder}
        value={query}
        onChange={handleChange}
        className="pl-10 h-12 text-base bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
        aria-label="Search books"
      />
    </form>
  );
};

export default SearchBar;
