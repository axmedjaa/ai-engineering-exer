import { createTool } from "@inngest/agent-kit";
import { z } from "zod";
export const approveContentTool=createTool({
    name:"approve_content",
      description: "Approve or reject products for display on the website.",
  parameters: z.object({
    products: z.array(
      z.object({
        link: z.string(),
        price: z.string(),
      })
    ),
  }),
    handler: async (input, {network,step})=>{
        const approvedProducts = input.products.filter(p => p.price && p.price !== "Not found" && p.price !== "Error fetching page");
        if(!network?.state.data)network!.state.data={};
        network.state.data.approvedProducts = approvedProducts;
        await step?.run("save_database_approved", async () => {
            const { getDb } = await import("@/lib/db");
            const db = await getDb();
            const runId = network.state.data?.runId;
            if (runId) {
                await db.collection("results").updateOne(
                { runId, status: "running" },
                {
                    $set: {
                    "state.approvedProducts": approvedProducts,
                    "progress.approveContentTool": "completed",
                    updatedAt: new Date(),
                    }
                }
                )
            }
        })
        return { success: true, approvedProducts};
    }
})