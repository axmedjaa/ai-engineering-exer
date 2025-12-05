import { createAgent, openai } from "@inngest/agent-kit";
import { searchPriceTool } from "./tool/searchPriceTool";
import { scrapePriceTool } from "./tool/scrapePriceTool";
import { sortPricesTool } from "./tool/sortPricesTool";
import { approveContentTool } from "./tool/approveContentTool";

export const priceFind = createAgent({
  name: "price-find",
  description: "Find the price of a product by name",
  system: `
    You search for product prices online using the tool.
    ALWAYS use search_product_prices tool with the user's product name.
    Example: iPhone 14 Pro Max, Samsung S24 Ultra, Macbook Air.
  `,
  tools: [searchPriceTool],
  model: openai({ model: "gpt-5-mini" }),
});

export const priceScraperAgent = createAgent({
  name: "price-scraper",
  description: "Visits product links collected by the search agent and extracts price information from each page.",
  system: ({ network }) => {
    const products = network?.state.data.products || [];
    return `
      You are a price extraction assistant.
      Your job is to:
      1. Visit each product link collected from the previous search.
      2. Extract the price of the product (if available).
      3. Save the price along with the link.
      
      Products to check: ${JSON.stringify(products, null, 2)}
      
      ALWAYS use the scrape_product_prices_webpage tool to extract prices.
    `;
  },
  tools: [scrapePriceTool],
  tool_choice: "scrape_product_prices_webpage",
  model: openai({ model: "gpt-5-mini" }),
});


export const priceSorterAgent = createAgent({
  name: "price-sorter",
  description: "Sorts the scraped product prices from low to high for easy display.",
  system: ({ network }) => {
    const prices = network?.state.data.prices || [];
    return `
      You are a price sorting assistant.
      Take these products and sort them from lowest price to highest:
      ${JSON.stringify(prices, null, 2)}

      Always use the sort_product_prices tool.
    `;
  },
  tools: [sortPricesTool],
  tool_choice: "sort_product_prices",
  model: openai({ model: "gpt-5-mini" }),
});

export const moderatorAgent = createAgent({
  name: "product-moderator",
  description: "Reviews products and approves them for display on the website.",
  system: ({ network }) => {
    const sortedProducts = network?.state.data.sortedPrices || [];
    return `
      You are a product moderator. Review the following products:
      ${JSON.stringify(sortedProducts, null, 2)}

      Approve products with valid prices. Reject invalid or missing prices.
      Use the approve_content tool.
    `;
  },
  tools: [approveContentTool],
  tool_choice: "approve_content",
  model: openai({ model: "gpt-5-mini" }),
});
