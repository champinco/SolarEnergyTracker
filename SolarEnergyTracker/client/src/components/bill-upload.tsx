import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import { Upload, AlertCircle, Info } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import {
  isValidFileSize,
  isValidFileType,
  getErrorMessage,
  formatCurrency,
} from "@/lib/utils";

interface BillUploadProps {
  onBillAmountSubmit: (billAmount: number) => void;
}

export function BillUpload({ onBillAmountSubmit }: BillUploadProps) {
  const [file, setFile] = useState<File | null>(null);
  const [billAmount, setBillAmount] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [uploadMethod, setUploadMethod] = useState<"manual" | "upload">("manual");

  const acceptedFileTypes = ["application/pdf", "image/png", "image/jpeg", "image/jpg"];
  const maxFileSize = 5; // in MB

  // Handle file upload
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    setError(null);

    if (!selectedFile) return;

    if (!isValidFileType(selectedFile, acceptedFileTypes)) {
      setError("Invalid file type. Please upload PDF, PNG, or JPG.");
      return;
    }

    if (!isValidFileSize(selectedFile, maxFileSize)) {
      setError(`File size exceeds ${maxFileSize}MB limit.`);
      return;
    }

    setFile(selectedFile);
  };

  // Process bill mutation
  const processBillMutation = useMutation({
    mutationFn: async (formData: FormData) => {
      const response = await apiRequest(
        "POST",
        "/api/billing/extract",
        formData
      );
      return response.json();
    },
    onSuccess: (data) => {
      if (data.billAmount) {
        setBillAmount(data.billAmount.toString());
      } else {
        setError("Could not extract bill amount from the uploaded document.");
      }
    },
    onError: (error) => {
      setError(getErrorMessage(error));
    },
  });

  // Handle file upload submission
  const handleUpload = () => {
    if (!file) {
      setError("Please select a file to upload.");
      return;
    }

    const formData = new FormData();
    formData.append("bill", file);

    processBillMutation.mutate(formData);
  };

  // Handle manual bill amount submission
  const handleSubmit = () => {
    const amount = parseFloat(billAmount);
    
    if (isNaN(amount) || amount <= 0) {
      setError("Please enter a valid bill amount.");
      return;
    }
    
    onBillAmountSubmit(amount);
  };

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="space-y-4">
          <div className="flex space-x-4 mb-6">
            <Button
              variant={uploadMethod === "manual" ? "default" : "outline"}
              className="flex-1"
              onClick={() => setUploadMethod("manual")}
            >
              Enter Manually
            </Button>
            <Button
              variant={uploadMethod === "upload" ? "default" : "outline"}
              className="flex-1"
              onClick={() => setUploadMethod("upload")}
            >
              Upload Bill
            </Button>
          </div>

          {uploadMethod === "manual" ? (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="billAmount">Monthly Bill Amount (KSh)</Label>
                <Input
                  id="billAmount"
                  type="number"
                  placeholder="e.g. 5000"
                  value={billAmount}
                  onChange={(e) => {
                    setBillAmount(e.target.value);
                    setError(null);
                  }}
                />
              </div>

              <Alert className="bg-neutral-50 border border-neutral-200">
                <Info className="h-4 w-4" />
                <AlertDescription>
                  We'll use your bill amount to estimate your daily energy usage
                  based on current Kenya Power tariffs.
                </AlertDescription>
              </Alert>

              {error && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <Button
                className="w-full"
                onClick={handleSubmit}
                disabled={!billAmount}
              >
                Calculate Based on Bill
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="billUpload">Upload KPLC Bill</Label>
                <div className="grid w-full max-w-sm items-center gap-1.5">
                  <Input
                    id="billUpload"
                    type="file"
                    accept=".pdf,.png,.jpg,.jpeg"
                    onChange={handleFileChange}
                  />
                </div>
                <p className="text-xs text-neutral-500">
                  Accepts PDF, PNG, JPG (max {maxFileSize}MB)
                </p>
              </div>

              {file && (
                <div className="text-sm">
                  Selected file: <span className="font-medium">{file.name}</span>
                </div>
              )}

              {processBillMutation.data?.billAmount && (
                <Alert className="bg-neutral-50 border-primary text-primary">
                  <Info className="h-4 w-4" />
                  <AlertDescription>
                    Extracted bill amount:{" "}
                    <span className="font-bold">
                      {formatCurrency(processBillMutation.data.billAmount)}
                    </span>
                  </AlertDescription>
                </Alert>
              )}

              {error && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <div className="space-y-2">
                <Button
                  className="w-full gap-2"
                  onClick={handleUpload}
                  disabled={!file || processBillMutation.isPending}
                >
                  <Upload className="h-4 w-4" />
                  {processBillMutation.isPending
                    ? "Processing..."
                    : "Upload & Extract"}
                </Button>

                {processBillMutation.data?.billAmount && (
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() =>
                      onBillAmountSubmit(processBillMutation.data.billAmount)
                    }
                  >
                    Continue with This Amount
                  </Button>
                )}
              </div>
            </div>
          )}

          <Separator />

          <p className="text-sm text-neutral-600">
            For more accurate results, please consider using the appliance selection
            method instead, especially if your bill includes additional charges or
            adjustments.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
