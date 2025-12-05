// Home.tsx
"use client";
import Status from "@/components/Status";
import SearchInput from "@/components/ui/SearchInput";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import axios from "axios";

export default function Home() {
  const [input, setInput] = useState("");
  const [limit, setLimit] = useState(1);
  const [runId, setRunId] = useState<string | null>(null);

  const { data: result, isLoading } = useQuery({
    queryKey: ["results", runId],
    queryFn: async () => {
      if (!runId) return null;
      const response = await axios.get(`/api/result/${runId}`);
      if (response.status !== 200) throw new Error("Failed to fetch result");
      return response.data;
    },
    enabled: !!runId,
    refetchInterval: (query) => {
      const data = query.state?.data;
      if (data?.status === "completed" || data?.status === "failed") {
        return false;
      }
      return 2000;
    },
  });

  const handleRun = async () => {
    if (!input.trim()) {
      alert("Please enter a search query");
      return;
    }

    try {
      const res = await fetch("/api/run", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ input, limit }),
      });

      const data = await res.json();
      setRunId(data.runId);
    } catch (error) {
      console.error("Error running agents:", error);
      alert("Failed to run agents. Please try again.");
    }
  };

  // Provide a safe default so state is never null
  const state = result?.state ?? {};
  const isRunning = result?.status === "running";
  return (
    <div style={{ padding: 20 }}>
      <h1>Welcome to the Shop Project</h1>
      <div style={{ marginTop: 20 }}>
        <SearchInput
          input={input}
          limit={limit}
          onInputChange={setInput}
          onLimitChange={setLimit}
          onRun={handleRun}
          isLoading={isRunning}
        />
        {result && (
          <>
            <Status
              status={result?.progress?.workflow ?? "running"}
              products={state.products?.length ?? 0}
              prices={state.prices?.length ?? 0}
              sortedPrices={state.sortedPrices?.length ?? 0}
              approvedProducts={state.approvedProducts?.length ?? 0}
            />
            <div className="grid md:grid-cols-3 gap-6">
              <div>
                <h2 className="text-lg font-semibold">Products</h2>
              <div className="space-y-4 p-4 h-[500px] overflow-auto">
                {state.products?.map((product: any, index: number) => (
                  <div
                    key={index}
                    className="border p-4 rounded shadow hover:shadow-lg transition"
                  >
                    <h3 className="text-lg font-semibold">{product.title}</h3>
                    <p className="text-gray-600">{product.snippet}</p>
                    <a
                      href={product.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-2 inline-block text-blue-600 hover:underline"
                    >
                      View Product
                    </a>
                  </div>
                ))}
                </div>
              </div>
              {/* prices */}
              <div className="">
                <h2 className="text-lg font-semibold">Prices</h2>
                <div className="space-y-4 p-4 h-[500px] overflow-auto">
                  {state.prices?.map((item: any, index: number) => (
                    <div
                      key={index}
                      className="border p-4 rounded shadow hover:shadow-lg transition "
                    >
                      <h3 className="text-lg font-semibold">Link:</h3>
                      <a
                        href={item.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline break-all"
                      >
                        {item.link}
                      </a>
                      <p className="mt-2">
                        <span className="font-semibold">Price:</span> {item.price}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
              {/* sortedPrices */}
              <div>
                <div>
                  <h2 className="text-lg font-semibold">Sorted Prices</h2>
                  <div className="space-y-4 p-4 h-[500px] overflow-auto">
                    {state.sortedPrices?.map((item: any, index: number) => (
                      <div
                        key={index}
                        className="border p-4 rounded shadow hover:shadow-lg transition "
                      >
                        <h3 className="text-lg font-semibold">Link:</h3>
                        <a
                          href={item.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:underline break-all"
                        >
                          {item.link}
                        </a>
                        <p className="mt-2">
                          <span className="font-semibold">Price:</span> {item.price}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
