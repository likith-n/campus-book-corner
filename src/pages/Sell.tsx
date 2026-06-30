import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { ArrowLeft, ArrowRight, Upload, Check, Loader2, X } from "lucide-react";
import { toast } from "sonner";
import { listingsAPI } from "@/services/api";
import { useAuth } from "@/hooks/useAuth";

type Step = 1 | 2 | 3 | 4;

interface FormData {
  title: string;
  author: string;
  isbn: string;
  edition: string;
  subject: string;
  publicationYear: string;
  publisher: string;
  price: string;
  originalPrice: string;
  condition: string;
  conditionDetails: string;
  description: string;
  isNegotiable: boolean;
  images: File[];
}

const Sell = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const [currentStep, setCurrentStep] = useState<Step>(1);
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState<FormData>({
    title: "",
    author: "",
    isbn: "",
    edition: "",
    subject: "",
    publicationYear: "",
    publisher: "",
    price: "",
    originalPrice: "",
    condition: "",
    conditionDetails: "",
    description: "",
    isNegotiable: true,
    images: [],
  });

  const [errors, setErrors] = useState<Partial<FormData>>({});

  const subjects = [
    "Computer Science",
    "Chemistry",
    "Physics",
    "Mathematics",
    "Biology",
    "Mechanical Engineering",
    "Electrical Engineering",
    "Civil Engineering",
    "Electronics",
    "Other"
  ];

  const conditions = [
    { value: "new", label: "New - Never used" },
    { value: "like-new", label: "Like New - Minimal use" },
    { value: "good", label: "Good - Minor wear, all pages intact" },
    { value: "fair", label: "Fair - Some wear and marks" },
    { value: "acceptable", label: "Acceptable - Heavily used but functional" }
  ];

  // Check authentication
  if (!isAuthenticated) {
    toast.error("Please login to create a listing");
    navigate('/login');
    return null;
  }

  const handleNext = () => {
    if (validateCurrentStep()) {
      setCurrentStep((currentStep + 1) as Step);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep((currentStep - 1) as Step);
    }
  };

  const validateCurrentStep = (): boolean => {
    const newErrors: Partial<FormData> = {};
    
    switch (currentStep) {
      case 1:
        if (!formData.title.trim()) newErrors.title = "Title is required";
        if (!formData.author.trim()) newErrors.author = "Author is required";
        if (!formData.subject) newErrors.subject = "Subject is required";
        break;
      case 2:
        if (formData.images.length === 0) {
          toast.error("Please upload at least one image");
          return false;
        }
        break;
      case 3:
        if (!formData.condition) newErrors.condition = "Condition is required";
        if (!formData.price || parseFloat(formData.price) <= 0) {
          newErrors.price = "Valid price is required";
        }
        break;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    
    if (files.length > 5) {
      toast.error("Maximum 5 images allowed");
      return;
    }

    // Validate file sizes (max 5MB per file)
    const oversizedFiles = files.filter(file => file.size > 5 * 1024 * 1024);
    if (oversizedFiles.length > 0) {
      toast.error("Each image must be less than 5MB");
      return;
    }

    setFormData({ ...formData, images: files });
    toast.success(`${files.length} image(s) selected`);
  };

  const removeImage = (index: number) => {
    const newImages = formData.images.filter((_, i) => i !== index);
    setFormData({ ...formData, images: newImages });
  };

  const handleSubmit = async () => {
    if (!validateCurrentStep()) return;
    
    setLoading(true);

    try {
      // Prepare data with images
      const submitData = {
        title: formData.title,
        author: formData.author,
        isbn: formData.isbn || undefined,
        edition: formData.edition || undefined,
        subject: formData.subject,
        publication_year: formData.publicationYear || undefined,
        publisher: formData.publisher || undefined,
        price: parseFloat(formData.price),
        original_price: formData.originalPrice ? parseFloat(formData.originalPrice) : undefined,
        condition: formData.condition,
        description: formData.description || undefined,
        condition_details: formData.conditionDetails || undefined,
        is_negotiable: formData.isNegotiable,
        images: formData.images // Include the File array
      };

      console.log('📤 Submitting listing with', formData.images.length, 'images');
      
      const result = await listingsAPI.create(submitData);
      
      console.log('📥 Create listing result:', result);
      
      if (result.success) {
        toast.success("Listing created successfully! Your book is now live.");
        setTimeout(() => {
          navigate('/listings');
        }, 1500);
      } else {
        throw new Error(result.message || 'Failed to create listing');
      }
    } catch (error: any) {
      console.error('❌ Error creating listing:', error);
      
      // Show detailed error message
      if (error.message) {
        toast.error(error.message);
      } else {
        toast.error("Failed to create listing. Please try again.");
      }
      
      // If there are validation errors, show them
      if (error.errors) {
        error.errors.forEach((err: any) => {
          toast.error(`${err.path}: ${err.msg}`);
        });
      }
    } finally {
      setLoading(false);
    }
  };

  const isStepValid = () => {
    switch (currentStep) {
      case 1:
        return formData.title && formData.author && formData.subject;
      case 2:
        return formData.images.length > 0;
      case 3:
        return formData.condition && formData.price && parseFloat(formData.price) > 0;
      case 4:
        return true;
      default:
        return false;
    }
  };

  return (
    <div className="container mx-auto max-w-3xl px-4 py-8 animate-fade-in">
      <Button 
        variant="ghost" 
        className="mb-6"
        onClick={() => navigate(-1)}
        disabled={loading}
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Cancel
      </Button>

      <div className="mb-8">
        <h1 className="mb-2 text-3xl font-bold">List Your Book</h1>
        <p className="text-muted-foreground">
          Fill in the details to create your listing • Step {currentStep} of 4
        </p>
      </div>

      {/* Progress Steps */}
      <div className="mb-8 flex items-center justify-between">
        {[1, 2, 3, 4].map((step) => (
          <div key={step} className="flex flex-1 items-center">
            <div
              className={`flex h-10 w-10 items-center justify-center rounded-full border-2 font-semibold transition-colors ${
                currentStep >= step
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border bg-background text-muted-foreground"
              }`}
            >
              {currentStep > step ? <Check className="h-5 w-5" /> : step}
            </div>
            {step < 4 && (
              <div
                className={`h-0.5 flex-1 transition-colors ${
                  currentStep > step ? "bg-primary" : "bg-border"
                }`}
              />
            )}
          </div>
        ))}
      </div>

      {/* Step Content */}
      <Card>
        <CardHeader>
          <CardTitle>
            {currentStep === 1 && "Book Details"}
            {currentStep === 2 && "Upload Photos"}
            {currentStep === 3 && "Pricing & Condition"}
            {currentStep === 4 && "Review & Publish"}
          </CardTitle>
          <CardDescription>
            {currentStep === 1 && "Tell us about your book"}
            {currentStep === 2 && "Add clear photos of your book (max 5 images, 5MB each)"}
            {currentStep === 3 && "Set your price and describe condition"}
            {currentStep === 4 && "Review your listing before publishing"}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Step 1: Book Details */}
          {currentStep === 1 && (
            <>
              <div className="space-y-2">
                <Label htmlFor="title">Book Title *</Label>
                <Input
                  id="title"
                  placeholder="e.g., Organic Chemistry"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className={errors.title ? "border-red-500" : ""}
                />
                {errors.title && <p className="text-sm text-red-500">{errors.title}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="author">Author(s) *</Label>
                <Input
                  id="author"
                  placeholder="e.g., Paula Yurkanis Bruice"
                  value={formData.author}
                  onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                  className={errors.author ? "border-red-500" : ""}
                />
                {errors.author && <p className="text-sm text-red-500">{errors.author}</p>}
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="isbn">ISBN </Label>
                  <Input
                    id="isbn"
                    placeholder="e.g., 9876534267278"
                    value={formData.isbn}
                    onChange={(e) => setFormData({ ...formData, isbn: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="edition">Edition (optional)</Label>
                  <Input
                    id="edition"
                    placeholder="e.g., 7th Edition"
                    value={formData.edition}
                    onChange={(e) => setFormData({ ...formData, edition: e.target.value })}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="subject">Subject *</Label>
                <Select value={formData.subject} onValueChange={(value) => setFormData({ ...formData, subject: value })}>
                  <SelectTrigger id="subject" className={errors.subject ? "border-red-500" : ""}>
                    <SelectValue placeholder="Select subject" />
                  </SelectTrigger>
                  <SelectContent>
                    {subjects.map(subject => (
                      <SelectItem key={subject} value={subject}>{subject}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.subject && <p className="text-sm text-red-500">{errors.subject}</p>}
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="publisher">Publisher (optional)</Label>
                  <Input
                    id="publisher"
                    placeholder="e.g., Pearson"
                    value={formData.publisher}
                    onChange={(e) => setFormData({ ...formData, publisher: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="year">Publication Year (optional)</Label>
                  <Input
                    id="year"
                    type="number"
                    placeholder="e.g., 2020"
                    value={formData.publicationYear}
                    onChange={(e) => setFormData({ ...formData, publicationYear: e.target.value })}
                    min="1900"
                    max={new Date().getFullYear()}
                  />
                </div>
              </div>
            </>
          )}

          {/* Step 2: Photos */}
          {currentStep === 2 && (
            <div className="space-y-4">
              <div className="flex min-h-[200px] items-center justify-center rounded-lg border-2 border-dashed border-border bg-muted/50 p-12">
                <div className="text-center">
                  <Upload className="mx-auto mb-4 h-12 w-12 text-muted-foreground" />
                  <Label htmlFor="images" className="cursor-pointer">
                    <span className="text-primary hover:underline">Click to upload</span> or drag and drop
                  </Label>
                  <p className="mt-1 text-sm text-muted-foreground">
                    PNG, JPG up to 5MB each (max 5 photos)
                  </p>
                  <Input
                    id="images"
                    type="file"
                    multiple
                    accept="image/*"
                    className="hidden"
                    onChange={handleImageUpload}
                  />
                </div>
              </div>
              
              {formData.images.length > 0 && (
                <div className="space-y-2">
                  <p className="text-sm font-medium">{formData.images.length} file(s) selected</p>
                  <div className="grid gap-2">
                    {formData.images.map((file, idx) => (
                      <div 
                        key={idx} 
                        className="flex items-center justify-between p-2 bg-muted rounded-md"
                      >
                        <span className="text-sm truncate flex-1">{file.name}</span>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => removeImage(idx)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Step 3: Pricing */}
          {currentStep === 3 && (
            <>
              <div className="space-y-2">
                <Label htmlFor="condition">Condition *</Label>
                <Select value={formData.condition} onValueChange={(value) => setFormData({ ...formData, condition: value })}>
                  <SelectTrigger id="condition" className={errors.condition ? "border-red-500" : ""}>
                    <SelectValue placeholder="Select condition" />
                  </SelectTrigger>
                  <SelectContent>
                    {conditions.map(cond => (
                      <SelectItem key={cond.value} value={cond.value}>
                        {cond.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.condition && <p className="text-sm text-red-500">{errors.condition}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="conditionDetails">Condition Details (optional)</Label>
                <Textarea
                  id="conditionDetails"
                  placeholder="Describe specific wear, marks, or damage..."
                  rows={2}
                  value={formData.conditionDetails}
                  onChange={(e) => setFormData({ ...formData, conditionDetails: e.target.value })}
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="price">Selling Price (₹) *</Label>
                  <Input
                    id="price"
                    type="number"
                    placeholder="e.g., 450"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    className={errors.price ? "border-red-500" : ""}
                    min="1"
                  />
                  {errors.price && <p className="text-sm text-red-500">{errors.price}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="originalPrice">Original Price (₹, optional)</Label>
                  <Input
                    id="originalPrice"
                    type="number"
                    placeholder="e.g., 1200"
                    value={formData.originalPrice}
                    onChange={(e) => setFormData({ ...formData, originalPrice: e.target.value })}
                    min="1"
                  />
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="negotiable"
                  checked={formData.isNegotiable}
                  onCheckedChange={(checked) => 
                    setFormData({ ...formData, isNegotiable: checked as boolean })
                  }
                />
                <Label htmlFor="negotiable" className="font-normal cursor-pointer">
                  Price is negotiable
                </Label>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Additional Description (optional)</Label>
                <Textarea
                  id="description"
                  placeholder="Add any additional information about the book..."
                  rows={4}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                />
              </div>
            </>
          )}

          {/* Step 4: Review */}
          {currentStep === 4 && (
            <div className="space-y-4">
              <div className="rounded-lg border border-border bg-muted/50 p-6 space-y-3">
                <h3 className="font-semibold text-lg">{formData.title}</h3>
                <p className="text-muted-foreground">by {formData.author}</p>
                
                <div className="grid grid-cols-2 gap-2 text-sm">
                  {formData.edition && <div><strong>Edition:</strong> {formData.edition}</div>}
                  {formData.isbn && <div><strong>ISBN:</strong> {formData.isbn}</div>}
                  <div><strong>Subject:</strong> {formData.subject}</div>
                  {formData.publisher && <div><strong>Publisher:</strong> {formData.publisher}</div>}
                </div>

                <div className="flex gap-4 text-sm pt-2 border-t">
                  <span><strong>Condition:</strong> <span className="capitalize">{formData.condition}</span></span>
                  <span><strong>Price:</strong> ₹{formData.price}</span>
                  {formData.isNegotiable && <span className="text-muted-foreground">(Negotiable)</span>}
                </div>

                {formData.description && (
                  <p className="text-sm pt-2 border-t">{formData.description}</p>
                )}
                
                <p className="text-sm text-muted-foreground pt-2 border-t">
                  📷 {formData.images.length} photo(s) uploaded
                </p>
              </div>

              <div className="rounded-lg bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 p-4 text-sm">
                <p className="font-medium mb-2 text-blue-900 dark:text-blue-100">Before you publish:</p>
                <ul className="list-disc list-inside space-y-1 text-blue-800 dark:text-blue-200">
                  <li>Make sure your photos clearly show the book's condition</li>
                  <li>Price should be fair based on condition</li>
                  <li>You'll be notified when someone requests your book</li>
                  <li>Meet buyers safely on campus in public areas</li>
                  <li>You can edit or remove your listing anytime</li>
                </ul>
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex justify-between pt-4">
            <Button
              variant="outline"
              onClick={handleBack}
              disabled={currentStep === 1 || loading}
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back
            </Button>

            {currentStep < 4 ? (
              <Button onClick={handleNext} disabled={!isStepValid() || loading}>
                Next
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            ) : (
              <Button onClick={handleSubmit} disabled={loading}>
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Publishing...
                  </>
                ) : (
                  "Publish Listing"
                )}
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Sell;
