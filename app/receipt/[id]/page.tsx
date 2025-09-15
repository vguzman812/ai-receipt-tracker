"use client";

import { useParams, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { Id } from "@/convex/_generated/dataModel";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import Link from "next/link";
import { ChevronLeft, FileText, Lightbulb, Lock, Sparkles } from "lucide-react";
import { useSchematicFlag } from "@schematichq/schematic-react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

function Receipt() {
  const params = useParams<{ id: string }>();
  const [receiptId, setReceiptId] = useState<Id<"receipts"> | null>(null);
  const router = useRouter();
  const isSummariesEnabled = useSchematicFlag("ai-summary");

  // Fetch receipt details
  const receipt = useQuery(
    api.receipts.getReceiptById,
    receiptId ? { receiptId: receiptId } : "skip",
  );

  // Get file download URL for the view button
  const fileId = receipt?.fileId;
  const downloadUrl = useQuery(
    api.receipts.getReceiptDownloadUrl,
    fileId ? { fileId: fileId } : "skip",
  );

  useEffect(() => {
    try {
      setReceiptId(params.id as Id<"receipts">);
    } catch (error) {
      console.error("Error setting receipt ID:", error);
      router.push("/");
    }
  }, [params.id, router]);

  // Loading state
  if (receipt === undefined) {
    return (
      <div className="container mx-auto py-10 px-4">
        <div className="flex flex-col items-center justify-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
        </div>
      </div>
    );
  }
  if (receipt === null) {
    return (
      <div className="container mx-auto py-10 px-4">
        <div className="max-w-2xl mx-auto text-center">
          <h1 className="text-2xl font-bold mb-4">Receipt Not Found</h1>
          <p className="mb-6">
            The receipt you&apos;re looking for doesn&apos;t exist or has been
            removed.
          </p>
        </div>
        <Link
          href="/"
          className="px-6 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Return Home
        </Link>
      </div>
    );
  }
  // Forat upload date
  const uploadDate = new Date(receipt.uploadedAt).toLocaleString();

  // Check if receipt has extracted data
  const hasExtractedData = !!(
    receipt.merchantName ||
    receipt.merchantAddress ||
    receipt.transactionDate ||
    receipt.transactionAmount
  );

  return (
    <div className="container mx-auto py-10 px-4">
      <div className="max-w-4xl mx-auto">
        <nav className="mb-6">
          <Link
            href="/receipts"
            className="text-blue-500 hover:underline flex items-center"
          >
            <ChevronLeft className="h-4 w-4 mr-1" />
            Back to Receipts
          </Link>
        </nav>
        <div className="bg-white shadow-md rounded-lg overflow-hidden mb-6">
          <div className="p-6">
            <div className="flex items-center jusstify-between mb-6">
              <h1 className="text-2xl font-bold text-gray-900 truncate">
                {receipt.fileDisplayName || receipt.fileName}
              </h1>
              <div className="flex items-center">
                {receipt.status === "pending" ? (
                  <div className="mr-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-yellow-800"></div>
                  </div>
                ) : null}
                <span
                  className={`px-3 py-1 rounded-full text-sm ${receipt.status === "pending" ? "bg-yellow-100 text-yellow-800" : receipt.status === "processed" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}
                >
                  {receipt.status.charAt(0).toUpperCase() +
                    receipt.status.slice(1)}
                </span>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Information */}
              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-medium text-gray-500">
                    File Information
                  </h3>
                  <div className="mt-2 bg-gray-50 p-4 rounded-lg">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-gray-500">Uploaded</p>
                        <p className="font-medium">{uploadDate}</p>
                      </div>
                      <div>
                        <p className="text-gray-500">Size</p>
                        <p className="font-medium">
                          {formatFileSize(receipt.size)}
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-500">Type</p>
                        <p className="font-medium">{receipt.mimeType}</p>
                      </div>
                      <div>
                        <p className="text-gray-500">ID</p>
                        <p className="font-medium truncate" title={receipt._id}>
                          {receipt._id.slice(0, 10)}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              {/* Download */}
              <div className="flex items-center justify-center p-8 bg-gray-50 rounded-lg">
                <div className="text-center">
                  <FileText className="h-16 w-16 text-blue-500 mx-auto" />
                  <p className="mt-4 text-sm text-gray-500">PDF Preview</p>
                  {downloadUrl && (
                    <a
                      href={downloadUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-4 inline-block px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                    >
                      View PDF
                    </a>
                  )}
                </div>
              </div>
              {/* Extracted Data */}
              {hasExtractedData && (
                <div className="mt-8">
                  <h3 className="text-lg font-semibold mb-4">
                    Receipt Details
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Merchant Details */}

                    {/* Transaction Details */}
                  </div>
                  {/* Receipt Summary */}
                  {receipt.receiptSummary && (
                    <>
                      {isSummariesEnabled ? (
                        <div className="mt-6 bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-lg border border-blue-100 shodow-sm">
                          <div className="flex items-center mb-4">
                            <h4 className="font-semibold text-blue-700">
                              AI Summary
                            </h4>
                            <div className="ml-2">
                              <Sparkles className="h-3.5 w-3.5 text-yellow-500" />
                              <Sparkles className="h-3 w-3 text-yellow-400 -ml-1" />
                            </div>
                          </div>
                          <div className="bg-white bg-opacity-60 rounded-lg p-4 border border-blue-100">
                            <p className="text-sm whitespace-pre-line leading-relaxed text-gray-700">
                              {receipt.receiptSummary}
                            </p>
                          </div>
                          <div className="mt-3 text-cs text-blue-600 italic flex items-center">
                            <Lightbulb className="h-3 w-3 mr-1" />
                            <span>
                              AI-generated summary based on receipt data
                            </span>
                          </div>
                        </div>
                      ) : (
                        <div className="mt-6 bg-gray-100 p-6 rounded-lg border border-gray-200 shadow-sm">
                          <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center">
                              <h4 className="font-semibold text-gray-500">
                                AI Summary
                              </h4>
                              <div className="ml-2 flex">
                                <Sparkles className="h-3.5 w-3.5 text-gray-400" />
                                <Sparkles className="h-3 w-3 text-gray-300 -ml-1" />
                              </div>
                            </div>
                            <Lock className="h-4 w-4 text-gray-500" />
                          </div>
                          <div className="bg-white bg-opacity-50 rounded-lg p-4 border border-gray-200 flex flex-col items-center justify-center">
                            <Link
                              href="/manage-plan"
                              className="text-center py-4"
                            >
                              <Lock className="h-8 w-8 text-gray-400 mx-auto mb-3" />
                              <p className="text-sm text-gray-500 mb-2">
                                AI summary is a PRO level feature
                              </p>
                              <button className="mt-2 px-4 py-1.5 bg-blue-500 text-white text-sm rounded hover:bg-blue-600 inline-block">
                                Upgrade to Unlock
                              </button>
                            </Link>
                          </div>
                          <div className="mt-3 text-cs text-gray-400 italic flex items-center">
                            <Lightbulb className="h-3 w-3 mr-1" />
                            <span>
                              Get AI-powered insights from your receipts{" "}
                            </span>
                          </div>
                        </div>
                      )}
                    </>
                  )}
                </div>
              )}

              {/* Items section using shadcn table */}
              {receipt?.items && receipt.items.length > 0 ? (
                <div className="mt-10">
                  <h3 className="text-lg font-semibold mb-4">Items</h3>
                  <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="w-[40px]">#</TableHead>
                          <TableHead>Name</TableHead>
                          <TableHead>Quantity</TableHead>
                          <TableHead>Unit Price</TableHead>
                          <TableHead>Total</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {receipt.items.map((item: any, idx: number) => (
                          <TableRow key={idx}>
                            <TableCell className="py-2">{idx + 1}</TableCell>
                            <TableCell className="font-medium">
                              {item.name || "-"}
                            </TableCell>
                            <TableCell>{item.quantity ?? "-"}</TableCell>
                            <TableCell>
                              {typeof item.unitPrice === "number" &&
                              receipt.currency
                                ? formatCurrency(
                                    item.unitPrice,
                                    receipt.currency,
                                  )
                                : "-"}
                            </TableCell>
                            <TableCell>
                              {typeof item.total === "number" &&
                              receipt.currency
                                ? formatCurrency(item.total, receipt.currency)
                                : "-"}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </div>
              ) : ( 
                <div className="mt-10 text-gray-500 italic text-center">
                  No item details found for this receipt.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
export default Receipt;

function formatFileSize(bytes: number): string {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
}

function formatCurrency(amount: number, currency: string): string {
  return `${amount.toFixed(2)}${currency ? ` ${currency}` : ""}`;
}
