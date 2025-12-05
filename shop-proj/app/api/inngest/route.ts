import { inngest } from "@/inngest/client";
import { productPriceWorkFlow } from "@/inngest/functions";
import { serve } from "inngest/next";

export const{POST,GET,PUT}=serve({
    client:inngest,
    functions:[
        productPriceWorkFlow
    ]
})