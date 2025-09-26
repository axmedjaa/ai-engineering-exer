"use client";

import { useChat } from "@ai-sdk/react";
import { useState } from "react";

export default function DatabaseChat() {
  const [input, setInput] = useState("");
  const { messages, sendMessage } = useChat({
    api: "/api/chat", // your AI endpoint
  });

  return (
    <div className="flex flex-col h-screen">
      {/* Header */}
      <div className="text-center py-6 border-b">
        <h1 className="text-3xl font-bold mb-2">Database Chat</h1>
        <p className="text-gray-600">Ask about movies, users, or reviews</p>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-6">
        <div className="max-w-4xl mx-auto space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-md px-4 py-3 rounded-lg ${
                  message.role === "user"
                    ? "bg-rose-500 text-white"
                    : "bg-gray-100 text-gray-900"
                }`}
              >
                {message.parts.map((part, i) => {
                  // Plain text
                  if (part.type === "text") {
                    return (
                      <div key={i} className="whitespace-pre-wrap">
                        {part.text}
                      </div>
                    );
                  }

                  // DB query tool output
                  if (part.type === "tool-dbQuery" && part.output) {
                    const output = part.output;

                    return (
                      <div
                        key={`${message.id}-${i}`}
                        className="mt-2 p-2 bg-white border border-gray-200 rounded text-sm"
                      >
                        {/* Movies */}
                        {output.type === "movie" &&
                          output.movies?.map((m: any) => (
                            <p key={m._id}>
                              🎬 {m.title} ({m.year}) - {m.genre} - Rating: {m.rating}
                            </p>
                          ))}

                        {/* Users */}
                        {output.type === "user" &&
                          output.users?.map((u: any) => (
                            <p key={u._id}>
                              👤 {u.name}, Age: {u.age}, Favorite Genre: {u.favorite_genre}
                            </p>
                          ))}

                        {/* Reviews */}
                        {output.type === "review" &&
                          output.reviews?.map((r: any) => (
                            <p key={r._id}>
                              💬 {r.comment} - Rating: {r.rating}
                            </p>
                          ))}

                        {/* Errors */}
                        {output.type === "error" && (
                          <p className="text-red-500">{output.error}</p>
                        )}
                      </div>
                    );
                  }

                  // fallback
                  return null;
                })}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Input */}
      <div className="border-t bg-white p-4">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (input.trim() === "") return;
            sendMessage({ text: input });
            setInput("");
          }}
          className="max-w-4xl mx-auto"
        >
          <div className="flex space-x-2">
            <input
              className="flex-1 p-3 border rounded-lg"
              value={input}
              placeholder="Ask something about movies, users, or reviews..."
              onChange={(e) => setInput(e.target.value)}
            />
            <button
              type="submit"
              className="px-4 py-3 bg-rose-500 text-white rounded-lg hover:bg-rose-600"
            >
              Send
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
