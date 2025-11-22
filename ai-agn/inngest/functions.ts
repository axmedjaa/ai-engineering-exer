import { inngest } from "./client";

export const dataProcceser = inngest.createFunction(
  { id: "data-procceser" },
  { event: "data/proccess" },
  async ({ event, step }) => {
    // st1
    const{ users } = event.data
    const rawData = await step.run("fetch-data", async () => {
      console.log("Fetching data...");
      await new Promise((resolve) => setTimeout(resolve, 1000));
      return { users: users };
    });
    // st2
    const transformedData = await step.run("transform-data", async () => {
         console.log("Transforming data...");
      return rawData.users.map((user: any) => ({
        name: user,
        email: `${user.toLowerCase()}@example.com`
      }));
    });
    // st3
    const result = await step.run("save-data", async () => {
      console.log("Saving data...");
      // Simulate database save
      await new Promise(resolve => setTimeout(resolve, 500));
      return { saved: transformedData.length, data: transformedData };
    });
    return result;
  }
);
// app/inngest/functions/email-sender.ts
export const emailSender = inngest.createFunction(
  { id: "email-sender" },
  { event: "email/send" },
  async ({ event, step }) => {
    const { emails } = event.data;
    const results = [];

    for (const email of emails) {
      // Send email
      const result = await step.run(`send-email-${email}`, async () => {
        console.log(`Sending email to ${email}...`);
        // Simulate email API call
        await new Promise(resolve => setTimeout(resolve, 200));
        return { email, status: "sent", timestamp: new Date().toISOString() };
      });

      results.push(result);

      // Wait 2 seconds between emails (rate limiting)
      if (email !== emails[emails.length - 1]) {
        await step.sleep("rate-limit-delay", "2s");
      }
    }

    return { sent: results.length, results };
  }
);
// app/inngest/functions/approval-workflow.ts
export const approvalWorkflow = inngest.createFunction(
  { id: "approval-workflow" },
  { event: "workflow/start" },
  async ({ event, step }) => {
    const { requestId, action } = event.data;

    // Step 1: Process the request
    const processed = await step.run("process-request", async () => {
      console.log(`Processing request: ${action}`);
      return { requestId, action, status: "pending_approval" };
    });

    // Step 2: Wait for approval (up to 1 hour)
    const approval = await step.waitForEvent("wait-for-approval", {
      event: "workflow/approval",
      timeout: "1h",
      match: "data.requestId", // Match on requestId
    });

    if (!approval) {
      return {
        requestId,
        status: "timeout",
        message: "Approval not received within 1 hour"
      };
    }

    // Step 3: Execute approved action
    const result = await step.run("execute-action", async () => {
      if (approval.data.approved) {
        console.log(`Executing approved action: ${action}`);
        return { requestId, status: "completed", action };
      } else {
        return { requestId, status: "rejected", reason: approval.data.reason };
      }
    });

    return result;
  }
);
