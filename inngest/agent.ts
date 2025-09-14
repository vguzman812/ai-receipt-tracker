import {
  anthropic,
  createNetwork,
  getDefaultRoutingAgent,
} from "@inngest/agent-kit";
import { createServer } from "@inngest/agent-kit/server";
import { inngest } from "./client";
import Events from "./constants";
import { databaseAgent } from "./agents/databaseAgent";
import { receiptScanningAgent } from "./agents/receiptScanningAgent";

// https://agentkit.inngest.com/getting-started/quick-start

const agentNetwork = createNetwork({
  name: "Agent Team",
  agents: [databaseAgent, receiptScanningAgent],
  defaultModel: anthropic({
    model: "claude-3-7-sonnet-latest",
    defaultParameters: { max_tokens: 1000 },
  }),
  defaultRouter: ({ network }) => {
    const savedToDatabase = network.state.kv.get("saved-to-database");
    if (savedToDatabase !== undefined) {
      // Terminate the agent process if the data has been saved to the database
      return undefined;
    }

    return getDefaultRoutingAgent();
  },
});

export const server = createServer({
  agents: [databaseAgent, receiptScanningAgent],
  networks: [agentNetwork],
});

export const extractAndSavePDF = inngest.createFunction(
  {
    id: "Extract PDF and Save in Database",
    concurrency: 1,
  },
  {
    event: Events.EXTRACT_DATA_FROM_PDF_AND_SAVE_TO_DATABASE,
  },
  async ({ event }) => {

    const result = await agentNetwork.run(
      `extract the key data from this pdf: ${event.data.pdfUrl}.
      Once the data is extracted, save it to the database using the receiptId:${event.data.receiptId}.
      Once the receipt is successfully saved to the database, you can terminate the agent process.
      Start with the Supervisor agent.`,
    );

    return result.state.kv.get("receipt");
  },
);
