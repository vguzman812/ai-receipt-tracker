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

function PDFDropzone({ children }: { children: React.ReactNode }) {
  const [isDraggingOver, setIsDraggingOver] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);

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
        const newUploadedFiles: string[] = [];
        for (const file of pdfFiles) {
          // create a formData object to use with the server action
          // emulating a 'submit'
          const formData = new FormData();
          formData.append("file", file);
          const result = await uploadPDF(formData);
          if (!result.success) {
            throw new Error(result.error);
          }
          newUploadedFiles.push(file.name);
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

  // const canUpload = isUserSignedIn && isFeatureEnabled
  const canUpload = true;

  return (
    <DndContext sensors={sensors}>
      <div className="w-full max-w-md mx-auto bg-red-400">
        <div
          onDragOver={canUpload ? handleDragOver : undefined}
          onDragLeave={canUpload ? handleDragLeave : undefined}
          onDrop={canUpload ? handleDrop : (e) => e.preventDefault()}
          className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
            isDraggingOver ? "border-blue-500 bg-blue-50" : "border-gray-300"
          } ${!canUpload ? "opacity-70 cursor-not-allowed" : ""}`}
        ></div>
      </div>
    </DndContext>
  );
}
export default PDFDropzone;
