import { inngest } from "@/inngest/client";
import { approvalWorkflow, dataProcceser, emailSender } from "@/inngest/functions";
import { serve } from "inngest/next";

export const {GET,POST,PUT}=serve({
    client:inngest,
    functions:[
        dataProcceser,
        emailSender,
        approvalWorkflow    
    ]
})