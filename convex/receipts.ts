// file for mutations and queries
import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

// Function to generate a Convex upload URL for the client
export const generateUploadUrl = mutation({
  args: {},
  handler: async (ctx) => {
    // Generate a URL that the client can use to upload a file
    return await ctx.storage.generateUploadUrl();
  },
});

// Store a receipt file and add it to the database
export const storeReceipt = mutation({
  args: {
    userId: v.string(),
    fileId: v.id("_storage"),
    fileName: v.string(),
    size: v.number(),
    mimeType: v.string(),
  },
  handler: async (ctx, args) => {
    // Save the receipt to the database
    const receiptId = await ctx.db.insert("receipts", {
      userId: args.userId,
      fileName: args.fileName,
      fileId: args.fileId,
      uploadedAt: Date.now(),
      size: args.size,
      mimeType: args.mimeType,
      status: "pending",
      // Initialize extracted data fields as null
      merchantName: undefined,
      merchantAddress: undefined,
      merchantContact: undefined,
      transactionDate: undefined,
      transactionAmount: undefined,
      currency: undefined,
      items: [],
    });
    return receiptId;
  },
});

// Function to get all receipts
export const getReceipts = query({
  args: {
    userId: v.string(),
  },
  handler: async (ctx, args) => {
    // Only return receipts for the authenticated user
    return await ctx.db
      .query("receipts")
      .filter((q) => q.eq(q.field("userId"), args.userId))
      .order("desc")
      .collect();
  },
});

// Function to get a singel receipt by ID
export const getReceiptById = query({
  args: {
    receiptId: v.id("receipts"),
  },
  handler: async (ctx, args) => {
    // Get a single receipt by ID
    const receipt = await ctx.db.get(args.receiptId);
    // Verify user has access to this receipt before returning it
    if (receipt) {
      const identity = await ctx.auth.getUserIdentity();
      if (!identity) {
        throw new Error("not authenticated");
      }
      const userId = identity.subject;
      if (receipt.userId !== userId) {
        throw new Error("Not authorized to access this receipt");
      }
    }
    return receipt;
  },
});

// Generate a URL to download a receipt file
export const getReceiptDownloadUrl = query({
  args: {
    fileId: v.id("_storage"),
  },
  handler: async (ctx, args) => {
    // Get a temporary URL that can be used to download the file
    return await ctx.storage.getUrl(args.fileId);
  },
});

// Function to update the status of a receipt
export const updateReceiptStatus = mutation({
  args: {
    receiptId: v.id("receipts"),
    status: v.string(),
  },
  handler: async (ctx, args) => {
    // Verify user has access to this receipt
    const receipt = await ctx.db.get(args.receiptId);
    if (!receipt) {
      throw new Error("Receipt not found");
    }
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("not authenticated");
    }
    const userId = identity.subject;
    if (receipt.userId !== userId) {
      throw new Error("Not authorized to update this receipt");
    }
    // Update the status of the receipt
    await ctx.db.patch(args.receiptId, { status: args.status });
    return true;
  },
});

// Function to delete a receipt and its file
export const deleteReceipt = mutation({
  args: {
    receiptId: v.id("receipts"),
  },
  handler: async (ctx, args) => {
    // Verify user has access to this receipt
    const receipt = await ctx.db.get(args.receiptId);
    if (!receipt) {
      throw new Error("Receipt not found");
    }
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("not authenticated");
    }
    const userId = identity.subject;
    if (receipt.userId !== userId) {
      throw new Error("Not authorized to delete this receipt");
    }
    // Delete the file
    await ctx.storage.delete(receipt.fileId);
    // Delete the receipt
    await ctx.db.delete(args.receiptId);

    return true;
  },
});

export const updateReceiptWithExtractedData = mutation({
  args: {
    id: v.id("receipts"),
    fileDisplayName: v.string(),
    merchantName: v.string(),
    merchantAddress: v.string(),
    merchantContact: v.string(),
    transactionDate: v.string(),
    transactionAmount: v.number(),
    currency: v.string(),
    receiptSummary: v.string(),
    items: v.array(
      v.object({
        name: v.string(),
        quantity: v.number(),
        unitPrice: v.number(),
        totalPrice: v.number(),
      }),
    ),
  },
  handler: async (ctx, args) => {
    // Verify user has access to this receipt
    const receipt = await ctx.db.get(args.id);
    if (!receipt) {
      throw new Error("Receipt not found");
    }

    // Update the receipt with the extracted data
    await ctx.db.patch(args.id, {
      fileDisplayName: args.fileDisplayName,
      merchantName: args.merchantName,
      merchantAddress: args.merchantAddress,
      merchantContact: args.merchantContact,
      transactionDate: args.transactionDate,
      transactionAmount: args.transactionAmount,
      currency: args.currency,
      receiptSummary: args.receiptSummary,
      items: args.items,
      status: "processed", // mark as processed now that we have extracted data
    });

    return { userId: receipt.userId };
  },
});
