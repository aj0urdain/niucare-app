import React, { useRef, useState } from "react";
import SignatureCanvas from "react-signature-canvas";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Pen, RotateCcw, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { Label } from "@/components/ui/label";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { uploadFileToS3 } from "@/lib/aws-upload";

interface SignatureUploadProps {
  value?: string;
  onUpload: (url: string) => void;
  title?: string;
  ptype: string;
}

const SignatureUpload: React.FC<SignatureUploadProps> = ({
  onUpload,
  title = "Upload Signature",
  ptype,
}) => {
  const sigCanvasRef = useRef<SignatureCanvas>(null);
  const [error, setError] = useState<string | null>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [hasSignature, setHasSignature] = useState(false);
  const [clearHover, setClearHover] = useState(false);

  const handleClear = () => {
    sigCanvasRef.current?.clear();
    setError(null);
    setHasSignature(false);
  };

  const handleDone = async () => {
    if (!sigCanvasRef.current || sigCanvasRef.current.isEmpty()) {
      setError("Please provide a signature before uploading.");
      return;
    }
    setError(null);
    try {
      const dataUrl = sigCanvasRef.current
        .getTrimmedCanvas()
        .toDataURL("image/png");
      // Convert dataURL to File
      const res = await fetch(dataUrl);
      const blob = await res.blob();
      const timestamp = Date.now();
      const filename = `${ptype}-registration-signature-${timestamp}.png`;
      const file = new File([blob], filename, {
        type: "image/png",
      });
      // Upload file using the correct folder and filename
      await uploadFileToS3(file, "private", filename);
      // Save just the filename instead of the full URL
      onUpload(filename);
    } catch {
      setError("Failed to upload signature.");
    }
  };

  // Set hasSignature to true when user draws
  const handleEnd = () => {
    if (sigCanvasRef.current && !sigCanvasRef.current.isEmpty()) {
      setHasSignature(true);
    }
  };

  return (
    <div className="flex flex-col gap-2 items-start w-full">
      <Label className="text-sm font-medium pl-2 text-muted-foreground">
        {title}
      </Label>
      <Card className="w-full max-w-md">
        <CardContent className="p-4">
          <div
            className={cn(
              "flex flex-col items-center justify-center h-32 w-full rounded-md p-2 transition-colors relative",
              hasSignature
                ? "border-2 border-blue-500 bg-blue-50"
                : isHovered
                ? "border-2 border-dashed border-blue-500 bg-blue-50"
                : "border-2 border-dashed border-gray-300 bg-muted"
            )}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            {hasSignature ? (
              <>
                <TooltipProvider>
                  <div className="absolute right-12 top-6 -translate-y-1/2 z-20 flex flex-col gap-2">
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={handleClear}
                          className="p-2 rounded text-foreground hover:bg-muted cursor-pointer animate-slide-right-fade-in"
                          onMouseEnter={() => setClearHover(true)}
                          onMouseLeave={() => setClearHover(false)}
                        >
                          <RotateCcw
                            className={cn(
                              "w-5 h-5",
                              clearHover && "animate-spin-slow"
                            )}
                          />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent side="left" className="text-xs">
                        Clear canvas
                      </TooltipContent>
                    </Tooltip>
                  </div>
                  <div className="absolute right-2 top-6 -translate-y-1/2 z-20 flex flex-col gap-2">
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          type="button"
                          variant="outline"
                          size="icon"
                          onClick={handleDone}
                          className="p-2 rounded hover:bg-green-200 cursor-pointer animate-slide-right-fade-in"
                        >
                          <Check className="w-5 h-5 text-green-500" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent side="right" className="text-xs">
                        Submit
                      </TooltipContent>
                    </Tooltip>
                  </div>
                </TooltipProvider>
                <SignatureCanvas
                  ref={sigCanvasRef}
                  penColor="black"
                  canvasProps={{
                    width: 350,
                    height: 150,
                    className: "w-full h-full",
                    style: {
                      cursor: "crosshair",
                    },
                  }}
                  backgroundColor="transparent"
                  onEnd={handleEnd}
                />
              </>
            ) : (
              <>
                {!isHovered && (
                  <>
                    <div className="animate-slide-up-fade-in">
                      <Pen className="h-10 w-10 mb-2 text-gray-400 transition-transform" />
                    </div>
                    <p className="text-sm text-muted-foreground text-center animate-slide-right-fade-in">
                      Click or draw here to sign
                    </p>
                  </>
                )}
                <SignatureCanvas
                  ref={sigCanvasRef}
                  penColor="black"
                  canvasProps={{
                    width: 350,
                    height: 150,
                    className: cn(
                      "absolute inset-0 w-full h-full",
                      isHovered ? "opacity-100" : "opacity-0"
                    ),
                    style: {
                      cursor: "crosshair",
                    },
                  }}
                  backgroundColor="transparent"
                  onEnd={handleEnd}
                />
              </>
            )}
          </div>
          {error && <div className="text-xs text-red-600 mt-2">{error}</div>}
        </CardContent>
      </Card>
    </div>
  );
};

export default SignatureUpload;
