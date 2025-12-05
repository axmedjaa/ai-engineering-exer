// supervisorNetwork.ts
import { createNetwork, createRoutingAgent, openai } from "@inngest/agent-kit";
import { doneTool, routeToAgentTool } from "./tool/routes";
import { moderatorAgent, priceFind, priceScraperAgent, priceSorterAgent } from "./agent";

const supervisorAgent = createRoutingAgent({
  name: "supervisor",
  description: "AI supervisor that orchestrates the product price workflow",
  system: ({ network }) => {
    const state = network?.state.data;
    const agents = Array.from(network?.agents.values() || []);

    return `You are an intelligent supervisor managing a product price workflow.
**Current State:**
- Products found: ${state?.products?.length || 0}
- Prices scraped: ${state?.prices?.length || 0}
- Prices sorted: ${state?.sortedPrices?.length || 0}
- Products approved: ${state?.approvedProducts?.length || 0}

**Available Agents:**
${agents.map(a => `- ${a.name}: ${a.description}`).join('\n')}

**Your Job:**
1. Analyze the current state
2. Decide which agent should run next to progress the workflow
3. Use route_to_agent tool to select the next agent
4. Use done tool when all steps are complete and products are approved

**Workflow Logic:**
- If no products: route to "price-find"
- If products exist but no prices: route to "price-scraper"
- If prices scraped but not sorted: route to "price-sorter"
- If prices sorted but not approved: route to "product-moderator"
- If approvedProducts exist: call done

Think step by step and make the best decision!`;
  },
  model: openai({ model: "gpt-5-mini" }),
  tools: [routeToAgentTool, doneTool],
  tool_choice: "auto",
  lifecycle: {
    onRoute: ({ result, network }) => {
      if (!result.toolCalls || result.toolCalls.length === 0) return undefined;

      const tool = result.toolCalls[0];

      if (tool.tool.name === "done") return undefined;

      if (tool.tool.name === "route_to_agent") {
        const agentName = (tool.content as any)?.data || (tool.content as string);
        return [agentName];
      }
      return undefined;
    },
  },
});

export const productPriceNetwork = createNetwork({
  name: "product_price_workflow",
  description: "Multi-agent system for searching, scraping, sorting, and approving product prices",
  agents: [
    priceFind,
    priceScraperAgent,
    priceSorterAgent,
    moderatorAgent,
  ],
  router: supervisorAgent,
  maxIter: 20,
});
