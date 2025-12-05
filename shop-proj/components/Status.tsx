"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";

type StatusProps = {
  status: "running" | "completed" | "failed";
    products?: number;
    prices?: number;
    sortedPrices?: number;
    approvedProducts?: number;
};

const Status = ({ status, products, prices, sortedPrices, approvedProducts }: StatusProps) => {
  const productsFound = products || 0;
  const pricesScraped = prices || 0;
  const pricesSorted = sortedPrices || 0;
  const approvedProductsCount = approvedProducts || 0;
  const allApproved = approvedProductsCount === productsFound && productsFound > 0;

  return (
    <Card className="mb-6">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Status</CardTitle>
          <span
            className={`text-sm font-medium px-3 py-1 rounded ${
              status === "running"
                ? "bg-blue-100 text-blue-700"
                : status === "completed"
                ? "bg-green-100 text-green-700"
                : "bg-red-100 text-red-700"
            }`}
          >
            {status === "running"
              ? "🔄 Running"
              : status === "completed"
              ? "✅ Complete"
              : "❌ Failed"}
          </span>
        </div>
      </CardHeader>

      <CardContent>
        <div className="space-y-2 text-sm text-gray-600">
          <div className="flex justify-between">
            <span>Products Found:</span>
            <span className="font-medium">{productsFound}</span>
          </div>
          <div className="flex justify-between">
            <span>Prices Scraped:</span>
            <span className="font-medium">{pricesScraped}</span>
          </div>
          <div className="flex justify-between">
            <span>Prices Sorted:</span>
            <span className="font-medium">{pricesSorted}</span>
          </div>
          <div className="flex justify-between">
            <span>Products Approved:</span>
            <span className="font-medium">{approvedProducts}</span>
          </div>
          <div className="mt-3 pt-3 border-t">
            <div className="flex items-center justify-between">
              <span className="font-medium">All Approved:</span>
              <span className={allApproved ? "text-green-600" : "text-red-600"}>
                {allApproved ? "✓ Yes" : "✗ No"}
              </span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default Status;
