import { createTool } from "@inngest/agent-kit";
import { z } from "zod";
export const searchPriceTool = createTool({
  name: "search_product_prices",
  description: "Search the internet for product prices (Amazon, eBay, websites)",

  parameters: z.object({
    input: z.string().describe("Name of the product, e.g., 'iPhone 15 Pro Max'"),
  }),

  handler: async (input, {network, step }) => {
    const runId = network?.state.data?.runId;
    if (!runId) throw new Error("runId not found in network state");

    console.log(`[searchPriceTool] Running search for: ${input.input}, runId: ${runId}`);

    // Call Serper API
    const response = await step?.run('serper_api_call', async () => {
      const res = await fetch("https://google.serper.dev/search", {
        method: "POST",
        headers: {
          "X-API-KEY": process.env.SERPER_API_KEY!,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ q: input.input, page: 1 }),
      });

      if (!res.ok) throw new Error(`Serper API request failed with status ${res.status}`);
      return await res.json();
    });

    // Extract products
    const products: any[] = [];

    // Organic results
    if (response.organic) {
      response.organic.forEach((item: any) => {
        products.push({
          title: item.title,
          link: item.link,
          snippet: item.snippet,
          position: item.position,
          sitelinks: item.sitelinks || [],
        });
      });
    }

    // Knowledge graph (optional)
    if (response.knowledgeGraph) {
      products.push({
        title: response.knowledgeGraph.title,
        link: response.knowledgeGraph.descriptionLink || "",
        snippet: response.knowledgeGraph.description,
        source: response.knowledgeGraph.descriptionSource || "Knowledge Graph",
        imageUrl: response.knowledgeGraph.imageUrl,
      });
    }

    // News fallback
    if (products.length === 0 && response.news) {
      response.news.forEach((item: any) => {
        products.push({
          title: item.title,
          link: item.link,
          snippet: item.snippet,
          source: item.source,
        });
      });
    }

    // Store products in workflow state
    if (!network.state.data) network.state.data = {};
    network.state.data.products = products;

    // Save to MongoDB
    await step?.run(`save_database_products_${runId}`, async () => {
      const { getDb } = await import("@/lib/db");
      const db = await getDb();

      await db.collection("results").updateOne(
        { runId, status: "running" },
        {
          $set: {
            "state.products": products,
            "progress.searchPriceTool": "completed",
            updatedAt: new Date(),
          },
        },
        { upsert: true }
      );

      console.log(`[searchPriceTool] Saved ${products.length} products for runId ${runId}`);
    });

    return { success: true, count: products.length };
  },
});
