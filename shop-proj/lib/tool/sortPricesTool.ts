import { createTool } from "@inngest/agent-kit";
import { z } from "zod";

export const sortPricesTool = createTool({
  name: "sort_product_prices",
  description: "Sort products by price from low to high.",
  parameters: z.object({
    prices: z.array(
      z.object({
        link: z.string(),
        price: z.string(),
      })
    ),
  }),

  handler: async (input, { network, step }) => {
    const sorted = input.prices
      .map((p) => {
        const parsed = parseFloat(
          p.price.replace(/[^0-9.,-]/g, "").replace(",", ".")
        );

        return {
          ...p,
          numericPrice: isNaN(parsed) ? Infinity : parsed,
        };
      })
      .sort((a, b) => a.numericPrice - b.numericPrice)
      .map((p) => ({
        link: p.link,
        price: p.price,
      }));

    if (!network.state.data) network.state.data = {};
    network.state.data.sortedPrices = sorted;

    await step?.run("save_database_sorted", async () => {
      const { getDb } = await import("@/lib/db");
      const db = await getDb();
      const runId = network.state.data?.runId;

      if (runId) {
        await db.collection("results").updateOne(
          { runId, status: "running" },
          {
            $set: {
              "state.sortedPrices": sorted,
              "progress.sortPricesTool": "completed",
              updatedAt: new Date(),
            },
          }
        );
      }
    });

    return { success: true, sortedCount: sorted.length };
  },
});
