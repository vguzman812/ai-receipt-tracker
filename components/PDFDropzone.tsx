"use client";

/* If you need more context about what things mean (sensors, droppable, draggable, etc),
Besides the official documentation, I found this medium article helpful:
https://medium.com/@anish_ali/how-to-use-dnd-kit-in-react-js-833cc6866c6d */

import {
  DndContext,
  useSensor,
  useSensors,
  PointerSensor,
} from "@dnd-kit/core";
import { useCallback, useState, useRef } from "react";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useSchematicEntitlement } from "@schematichq/schematic-react";
import { uploadPDF } from "@/actions/uploadPDF";
import { AlertCircle, CheckCircle, CloudUpload } from "lucide-react";
import { Button } from "@/components/ui/button";

type UploadedFile = {
  id: string;
  file: File;
};

function PDFDropzone() {
  const [isDraggingOver, setIsDraggingOver] = useState(false);

  const [isUploading, setIsUploading] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const user = useUser();
  const router = useRouter();

  // `key` parameter in `useSchematicEntitlement` is the feature flag key (scans, ai-summary, etc...) for the feature you want to check for
  // i.e. does the user have enough 'scans' left to upload a PDF?
  const {
    value: isFeatureEnabled,
    featureUsageExceeded,
    featureAllocation,
  } = useSchematicEntitlement("scans");
  // Set up sensors for drag detection
  const sensors = useSensors(useSensor(PointerSensor));

  // Handle file drop via native browser events for better PDF support
  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDraggingOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDraggingOver(false);
  }, []);

  const handleUpload = useCallback(
    async (files: FileList | File[]) => {
      if (!user) {
        alert("Please sign in to upload PDFs");
        return;
      }

      const fileArray = Array.from(files);
      const pdfFiles = fileArray.filter(
        (file) =>
          file.type === "application/pdf" ||
          file.name.toLowerCase().endsWith("pdf"),
      );

      if (pdfFiles.length === 0) {
        alert("Please drop only PDF files.");
        return;
      }

      // TODO: implement transition state
      setIsUploading(true);

      try {
        // Upload files
        const newUploadedFiles: UploadedFile[] = [];

        for (const file of pdfFiles) {
          // create a formData object to use with the server action
          // emulating a 'submit'
          const formData = new FormData();
          formData.append("file", file);

          const result = await uploadPDF(formData);

          if (!result.success) {
            throw new Error(result.error);
          }

          newUploadedFiles.push({ id: crypto.randomUUID(), file });
        }

        setUploadedFiles((prev) => [...prev, ...newUploadedFiles]);

        // Clear uploaded files list after 5 seconds
        setTimeout(() => {
          setUploadedFiles([]);
        }, 5000);
        router.push("/receipts");
      } catch (error) {
        console.error("Upload failed:", error);
        alert(
          `Upload failed: ${error instanceof Error ? error.message : "Unknown error"}`,
        );
      } finally {
        setIsUploading(false);
      }
    },
    [user, router],
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDraggingOver(false);

      if (!user) {
        alert("Please sign in to upload PDFs");
        return;
      }
      // if user has dropped a file, handle the upload
      if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
        handleUpload(e.dataTransfer.files);
      }
    },
    [user, handleUpload],
  );

  const triggerFileInput = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  const handleFileInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files && e.target.files.length > 0) {
        handleUpload(e.target.files);
      }
    },
    [handleUpload],
  );

  const isUserSignedIn = !!user;
  const canUpload = isUserSignedIn && isFeatureEnabled;

  return (
    <DndContext sensors={sensors}>
      <div className="w-full max-w-md mx-auto">
        <div
          onDragOver={canUpload ? handleDragOver : undefined}
          onDragLeave={canUpload ? handleDragLeave : undefined}
          onDrop={canUpload ? handleDrop : (e) => e.preventDefault()}
          className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
            isDraggingOver ? "border-blue-500 bg-blue-50" : "border-gray-300"
          } ${!canUpload ? "opacity-70 cursor-not-allowed" : ""}`}
        >
          {isUploading ? (
            <div className="flex flex-col items-center">
              <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500 mb-2">
              </div>
                <p>Uploading...</p>
            </div>
          ) : !isUserSignedIn ? (
            <>
              <CloudUpload className="mx-auto h-12 w-12 text-gray-400" />
              <p className="mt-2 text-sm text-gray-600">
                Please sign in to upload files
              </p>
            </>
          ) : (
            <>
              <CloudUpload className="mx-auto h-12 w-12 text-gray-400" />
              <p className="mt-2 text-sm text-gray-600">
                Drag and drop your PDF files here or click to select files to
                upload
              </p>
              <input
                type="file"
                ref={fileInputRef}
                accept="application/pdf,.pdf"
                multiple
                onChange={handleFileInputChange}
                className="hidden"
              />
              <Button
                disabled={!isFeatureEnabled}
                onClick={triggerFileInput}
                className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isFeatureEnabled ? "Select Files" : "Upgrade to upload"}
              </Button>
            </>
          )}
        </div>

        <div className="mt-4">
          {featureUsageExceeded && (
            <div className="flex items-center p-3 bg-red-50 border border-red-200 rounded-md text-red-600">
              <AlertCircle className="h-5 w-5 mr-2 flex-shrink-0" />
              <span>
                You've reached your limit of {featureAllocation} scans. Please
                upgrade your plan to continue.
              </span>
            </div>
          )}
        </div>

        {uploadedFiles.length > 0 && (
          <div className="mt-4">
            <h3 className="font-medium">Uploaded Files</h3>
            <ul className="mt-2 text-sm text-gray-600 space-y-1">
              {uploadedFiles.map(({ id, file }) => (
                <li key={id} className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                  {file.name}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </DndContext>
  );
}
export default PDFDropzone;
