import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, ArrowRight, Upload, Check } from "lucide-react";
import { toast } from "sonner";
import { Link } from "react-router-dom";

type Step = 1 | 2 | 3 | 4;

const Sell = () => {
  const [currentStep, setCurrentStep] = useState<Step>(1);
  const [formData, setFormData] = useState({
    title: "",
    author: "",
    edition: "",
    subject: "",
    condition: "",
    price: "",
    description: "",
    images: [] as File[],
  });

  const handleNext = () => {
    if (currentStep < 4) {
      setCurrentStep((currentStep + 1) as Step);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep((currentStep - 1) as Step);
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setFormData({ ...formData, images: files });
  };

  const handleSubmit = () => {
    toast.success("Listing created successfully! Your book is now live.");
    // Reset form and redirect
    setTimeout(() => {
      window.location.href = "/listings";
    }, 1500);
  };

  const isStepValid = () => {
    switch (currentStep) {
      case 1:
        return formData.title && formData.author && formData.edition && formData.subject;
      case 2:
        return formData.images.length > 0;
      case 3:
        return formData.condition && formData.price;
      case 4:
        return true;
      default:
        return false;
    }
  };

  return (
    <div className="container mx-auto max-w-3xl px-4 py-8 animate-fade-in">
      <Button asChild variant="ghost" className="mb-6">
        <Link to="/">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Cancel
        </Link>
      </Button>

      <div className="mb-8">
        <h1 className="mb-2 text-3xl font-bold">List Your Book</h1>
        <p className="text-muted-foreground">Fill in the details to create your listing</p>
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
            {currentStep === 2 && "Add clear photos of your book"}
            {currentStep === 3 && "Set your price and condition"}
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
                  placeholder="e.g., Organic Chemistry — 2nd Edition"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="author">Author(s) *</Label>
                <Input
                  id="author"
                  placeholder="e.g., Solomon & Fryhle"
                  value={formData.author}
                  onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="edition">Edition *</Label>
                  <Input
                    id="edition"
                    placeholder="e.g., 2nd"
                    value={formData.edition}
                    onChange={(e) => setFormData({ ...formData, edition: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="subject">Subject *</Label>
                  <Select value={formData.subject} onValueChange={(value) => setFormData({ ...formData, subject: value })}>
                    <SelectTrigger id="subject">
                      <SelectValue placeholder="Select subject" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Computer Science">Computer Science</SelectItem>
                      <SelectItem value="Chemistry">Chemistry</SelectItem>
                      <SelectItem value="Physics">Physics</SelectItem>
                      <SelectItem value="Mathematics">Mathematics</SelectItem>
                      <SelectItem value="Biology">Biology</SelectItem>
                      <SelectItem value="Mechanical Engineering">Mechanical Engineering</SelectItem>
                      <SelectItem value="Electrical Engineering">Electrical Engineering</SelectItem>
                      <SelectItem value="Other">Other</SelectItem>
                    </SelectContent>
                  </Select>
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
                  <p className="mt-1 text-sm text-muted-foreground">PNG, JPG up to 10MB (max 5 photos)</p>
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
                  <div className="text-sm text-muted-foreground">
                    {formData.images.map((file, idx) => (
                      <div key={idx}>{file.name}</div>
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
                  <SelectTrigger id="condition">
                    <SelectValue placeholder="Select condition" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="new">New - Never used</SelectItem>
                    <SelectItem value="good">Good - Minor wear, all pages intact</SelectItem>
                    <SelectItem value="fair">Fair - Some wear and marks</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="price">Price (₹) *</Label>
                <Input
                  id="price"
                  type="number"
                  placeholder="e.g., 450"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="Describe the book's condition, any highlights, missing pages, etc."
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
                <div className="flex gap-4 text-sm">
                  <span><strong>Edition:</strong> {formData.edition}</span>
                  <span><strong>Subject:</strong> {formData.subject}</span>
                </div>
                <div className="flex gap-4 text-sm">
                  <span><strong>Condition:</strong> <span className="capitalize">{formData.condition}</span></span>
                  <span><strong>Price:</strong> ₹{formData.price}</span>
                </div>
                {formData.description && (
                  <p className="text-sm">{formData.description}</p>
                )}
                <p className="text-sm text-muted-foreground">
                  {formData.images.length} photo(s) uploaded
                </p>
              </div>

              <div className="rounded-lg bg-muted/50 border border-border p-4 text-sm">
                <p className="font-medium mb-2">Before you publish:</p>
                <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                  <li>Make sure your photos are clear and show the book's condition</li>
                  <li>Price should be fair based on condition</li>
                  <li>You'll be notified when someone requests your book</li>
                  <li>Meet buyers safely on campus</li>
                </ul>
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex justify-between pt-4">
            <Button
              variant="outline"
              onClick={handleBack}
              disabled={currentStep === 1}
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back
            </Button>

            {currentStep < 4 ? (
              <Button onClick={handleNext} disabled={!isStepValid()}>
                Next
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            ) : (
              <Button onClick={handleSubmit}>
                Publish Listing
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Sell;
