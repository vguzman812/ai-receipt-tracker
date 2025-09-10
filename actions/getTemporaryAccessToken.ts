"use server";

import { currentUser } from "@clerk/nextjs/server";

// For component usage: https://docs.schematichq.com/components/set-up
// Initialize Schematic SDK
import { SchematicClient } from "@schematichq/schematic-typescript-node";
const apiKey = process.env.SCHEMATIC_API_KEY;
const client = new SchematicClient({ apiKey });

// Get a temporary access token
export async function getTemporaryAccessToken(companyId: string) {
  const user = await currentUser();
  if (!user) {
    return null
  }
  const resp = await client.accesstokens.issueTemporaryAccessToken({
    resource_type: "company",
    lookup: { id: user.id },
  });
  return resp.data?.token;
}
