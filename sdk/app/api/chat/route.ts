import { connectToDatabase } from "@/lib/db";
import Movie from "@/model/movie";
import User from "@/model/user";
import { openai } from "@ai-sdk/openai";
import {
  streamText,
  UIMessage,
  convertToModelMessages,
  tool,
  stepCountIs,
} from "ai";
import { z } from "zod";

export async function POST(req: Request) {
  const { messages }: { messages: UIMessage[] } = await req.json();
  await connectToDatabase();

  const response = streamText({
    model: openai("gpt-4.1-mini"),
    messages: convertToModelMessages(messages),
    stopWhen: stepCountIs(2),
    tools: {
      dbQuery: tool({
        description: "Query movies, users, and reviews from MongoDB",
        inputSchema: z.object({ query: z.any() }),
        execute: async ({ query }) => {
          try {
            if (typeof query === "object" && !Array.isArray(query)) {
              if (query.age) {
                const users = await User.find(query);
                return { type: "user", users };
              }
              if (query.rating) {
                const movies = await Movie.find(query);
                return { type: "movie", movies };
              }
            }
            if (typeof query === "string") {
              const q = query.toLowerCase();
              if (
                q.includes("user") &&
                (q.includes("over") || q.includes("older") || q.includes("greater"))
              ) {
                const age = parseInt(q.match(/\d+/)?.[0] || "0");
                const users = await User.find({ age: { $gt: age } });
                return { type: "user", users };
              }
              if (q.includes("movie") && q.includes("rating above")) {
                const rating = parseFloat(q.match(/\d+(\.\d+)?/)?.[0] || "0");
                const movies = await Movie.find({ rating: { $gt: rating } });
                return { type: "movie", movies };
              } 
            }
            return { type: "error", error: "Invalid query" };
          } catch (err: any) {
            console.error("dbQuery error:", err);
            return { type: "error", error: err.message };
          }
        },
      }),
      movie: tool({
        description: "Get information about a movie",
        inputSchema: z.object({ title: z.string(), year: z.number().optional() }),
        execute: async ({ title, year }) => {
          try {
            const apiKey = process.env.OMDB_API_KEY;
            const response =await fetch(`http://www.omdbapi.com/?t=${encodeURIComponent(title)}&y=${year || ""}&apikey=${apiKey}`)
            const movie = await response.json();
            if (movie.Error) {
              return { type: "error", error: movie.Error };
            }
            return { type: "movie", movie };
          } catch (err: any) {
            console.error("movie error:", err);
            return { type: "error", error: err.message };
          }
        },
      }),
      dadJoke: tool({
        description: "Get a dad joke",
        inputSchema: z.object({}),
        execute: async () => {
          try {
            const response = await fetch("https://icanhazdadjoke.com/", {
              headers: { Accept: "application/json" },
            });
            const joke = await response.json();
            return { type: "joke", joke };
          } catch (err: any) {
            console.error("dadJoke error:", err);
            return { type: "error", error: err.message };
          }
        },
      })
    },
  });

  return response.toUIMessageStreamResponse();
}
