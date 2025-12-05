import { createTool } from "@inngest/agent-kit";
import { z } from "zod";

// Tool to scrape prices using Serper Shopping API for each link
export const scrapePriceTool = createTool({
  name: "scrape_product_prices_webpage",
  description: "Use Serper Shopping API to extract price from every product link (first shopping result).",

  parameters: z.object({
    productLinks: z.array(z.string()).describe("Array of product links or product names"),
  }),

  handler: async (input, { network, step }) => {
    const runId = network?.state.data?.runId;
    if (!runId) throw new Error("runId not found in workflow state");

    const prices: {
      input: string;
      title: string;
      price: string;
      link: string;
      seller?: string;
      thumbnail?: string;
    }[] = [];

    for (const product of input.productLinks) {
      try {
        const res = await fetch("https://google.serper.dev/shopping", {
          method: "POST",
          headers: {
            "X-API-KEY": process.env.SERPER_API_KEY!,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            q: product, // use product link or name as query
            num: 1,
          }),
        });

        const data = await res.json();
        const first = data?.shopping?.[0]; // FIRST INDEX

        if (!first) {
          prices.push({
            input: product,
            title: "Not found",
            price: "Not found",
            link: product,
          });
          continue;
        }

        prices.push({
          input: product,
          title: first.title || "No title",
          price: first.price || "No price",
          link: first.link || product,
          seller: first.source || "",
          thumbnail: first.thumbnail || "",
        });
      } catch (error) {
        prices.push({
          input: product,
          title: "Error",
          price: "Error",
          link: product,
        });
      }
    }

    // Save to workflow state
    network.state.data = {
      ...network.state.data,
      prices,
    };

    // Save to DB
    await step?.run("save_prices", async () => {
      const { getDb } = await import("@/lib/db");
      const db = await getDb();
      await db.collection("results").updateOne(
        { runId, status: "running" },
        {
          $set: {
            "state.prices": prices,
            "progress.scrapePriceTool": "completed",
            updatedAt: new Date(),
          },
        },
        { upsert: true }
      );
    });

    return { success: true, count: prices.length };
  },
});
