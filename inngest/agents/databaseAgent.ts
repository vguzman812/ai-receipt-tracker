import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import convex from "@/lib/convexClient";
import client from "@/lib/schematic";
import {
  createAgent,
  openai,
  createTool,
  type AnyZodType,
} from "@inngest/agent-kit";
import { z } from "zod";

const receiptSchema = z.object({
  fileDisplayName: z
    .string()
    .describe(
      "The readable display name of the receipt to show in the UI. If the file name is not human readable, use this to give it a more readable name.",
    ),
  receiptId: z.string().describe("The ID of the receipt to update"),
  merchantName: z.string(),
  merchantAddress: z.string(),
  merchantContact: z.string(),
  transactionDate: z.string(),
  transactionAmount: z
    .string()
    .describe(
      "The total amount of the transaction, summing all the items on the receipt.",
    ),
  receiptSummary: z.string().describe("A summary of the receipt ..."),
  currency: z.string(),
  items: z.array(
    z
      .object({
        name: z.string(),
        quantity: z.number(),
        unitPrice: z.number(),
        totalPrice: z.number(),
      })
      .describe(
        "An array of items on the receipt. Include the name, quantity, unit price, and total price of each item.",
      ),
  ),
});

const saveToDatabaseTool = createTool({
  name: "saveToDatabase",
  description: "save the given data regarding receipts to the convex database.",
  // There's some mismatch of zod typying happening here, so as unknown as AnyZodType is the best option I can be bothered with atm.
  // Turns out it's because inngest uses zod ^3.25 and newest zod is ^4.1, so there was an issue with type compatability between the two.
  // Fixed by using the same version of zod inngest uses.
  parameters: receiptSchema as unknown as AnyZodType,
  handler: async (params, context) => {
    const {
      fileDisplayName,
      receiptId,
      merchantName,
      merchantAddress,
      merchantContact,
      transactionDate,
      transactionAmount,
      currency,
      receiptSummary,
      items,
    } = params;
    const result = await context.step?.run(
      "save-receipt-to-database",
      async () => {
        try {
          // Call the Convex mutation to update the receipt with the extracted data
          const { userId } = await convex.mutation(
            api.receipts.updateReceiptWithExtractedData,
            {
              id: receiptId as Id<"receipts">,
              fileDisplayName,
              merchantName,
              merchantAddress,
              merchantContact,
              transactionDate,
              transactionAmount,
              currency,
              receiptSummary,
              items,
            },
          );

          // Track event in schematic
          await client.track({
            event: "scan",
            company: { id: userId },
            user: { id: userId },
          });

          return {
            addedToDb: true,
            receiptId,
            fileDisplayName,
            merchantName,
            merchantAddress,
            merchantContact,
            transactionDate,
            transactionAmount,
            currency,
            receiptSummary,
            items,
          };
        } catch (error) {
          return {
            addedToDb: false,
            error: error instanceof Error ? error.message : "Unknown error",
          };
        }
      },
    );
    if (result?.addedToDb) {
      // Only set KV values if the receipt was successfully saved to the database
      context.network?.state.kv.set("saveed-to-database", true);
      context.network?.state.kv.set("receipt", receiptId);
    }
    return result;
  },
});

export const databaseAgent = createAgent({
  name: "Database Agent",
  description:
    "responsible for taking key information regarding receipts and saving it to the convex database.",
  system:
    "You are a helpful assistant that takes key information regarding receipts and saves it to the convex database.",
  model: openai({
    model: "gpt-4o-mini",
    defaultParameters: {
      max_completion_tokens: 1000,
    },
  }),
  tools: [saveToDatabaseTool],
});
