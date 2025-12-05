import { productPriceNetwork } from "@/lib/network"; // your Inngest network
import { inngest } from "./client";
import { getDb } from "@/lib/db";

export const productPriceWorkFlow = inngest.createFunction(
  { id: "product-price-workflow" },
  { event: "workflow/start" },
  async ({ event }) => {
    const input = event.data.input;
    const runId = event.data.runId;
    const productQuery = input.productQuery;

    console.log("Starting workflow for:", productQuery, runId);

    try {
      // Run the network (this will automatically execute search, scrape, sort)
      const result = await productPriceNetwork.run(input, {
        state: { data: { runId, productQuery } },
      });

      // Save final state to DB
      const db = await getDb();
      await db.collection("results").updateOne(
        { runId },
        {
          $set: {
            "state.products": result.state.data.products,
            "state.prices": result.state.data.prices,
            "state.mergedProducts": result.state.data.mergedProducts,
            "state.sortedProducts": result.state.data.sortedPrices,
            "progress.workflow": "completed",
            updatedAt: new Date(),
          },
        },
        { upsert: true }
      );

      console.log(`[Workflow] Completed runId: ${runId}`);
      return { success: true, result: result.state.data };
    } catch (error) {
      console.error("Workflow failed for:", productQuery, runId, error);

      try {
        const db = await getDb();
        await db.collection("results").updateOne(
          { runId },
          {
            $set: {
              status: "failed",
              error: error instanceof Error ? error.message : "Unknown error",
              failedAt: new Date(),
            },
          }
        );
      } catch (dbError) {
        console.error("Failed to update workflow status to failed:", dbError);
      }

      throw error;
    }
  }
);
