import { SchematicClient } from "@schematichq/schematic-typescript-node";

if (!process.env.SCHEMATIC_API_KEY) {
  throw new Error("SCHEMATIC_API_KEY is not set");
}

const client = new SchematicClient({
  apiKey: process.env.SCHEMATIC_API_KEY,
  // disable any cache
  cacheProviders: {
    flagChecks: [],
  },
});

export default client;
