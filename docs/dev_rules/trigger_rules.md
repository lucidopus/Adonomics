## Overview

- **Trigger.dev v4** enables long-running, resilient tasks with better self-hosting, warm starts, realtime, and new "waitpoints" primitives.
- All tasks must be declared using the `task()` function from `@trigger.dev/sdk` (v4). Do not import from `@trigger.dev/sdk/v3` in new code.
- This document also includes local conventions for database access, parameter casting, logging, error handling, and other best practices, adapted for v4.

---

## Critical Instructions for AI Language Models

If you are generating code (for example, ChatGPT or other AI LLMs), you must:

1. Never generate the deprecated v3 import paths like `@trigger.dev/sdk/v3` or any `client.defineJob()` pattern.

   ```typescript
   // ❌ DO NOT USE (legacy v3 or deprecated)
   import { task } from "@trigger.dev/sdk/v3";
   // or
   client.defineJob({ ... });
   ```

2. Always generate the following valid v4 pattern:

   ```typescript
   // ✅ ALWAYS USE THIS PATTERN (v4)
   import { task } from "@trigger.dev/sdk";

   export const helloWorld = task({
     id: "hello-world",
     run: async (payload: { message: string }) => {
       // your task logic here
     },
   });
   ```

   IMPORTANT: all code that should execute must be inside the exported `task({ ... })`. Code outside will not run in the worker.

3. Verify your code uses:
   - `import { task } from "@trigger.dev/sdk";`
   - `export const ... = task(...)`
   - No references to `client.defineJob()`

4. Never omit exporting a task. Every task in a file must be exported.

Failing to follow these guidelines will cause deployment failures and break your tasks in production.

---

## Absolute Requirements

1. **Import from `@trigger.dev/sdk` (v4)**  
   Use v4 API imports only. Do not import from `@trigger.dev/sdk/v3` in new or migrated files.

2. **Export every task**  
   Every task, including subtasks, must be exported.

3. **Use a unique `id`**  
   Each task must have a unique `id` within the project.

4. **Use the v4 `logger`**  
   Use `logger` from `@trigger.dev/sdk` for structured logs.

5. **Database access**  
   Follow the SQL usage guidelines below (template literal `sql`, correct casting, centralized env helpers).

6. **Error handling**  
   Use lifecycle hooks (e.g., `onFailure`) or local `try/catch` with full logging.

7. **Configuration**  
   Sensitive values must be stored in environment variables (e.g., `TRIGGER_SECRET_KEY`, DB URL, external API keys). When self-hosting, ensure `TRIGGER_API_URL` points to your instance.

---

## What’s New in v4 (Practical Highlights)

- **Waitpoints**: First-class primitives to pause runs until a condition is met (time-based waits, external signals via tokens, idempotent waits).
- **Idempotency on waits**: Wait functions accept `idempotencyKey` and TTL to skip duplicate waits.
- **Task priority**: Supply priority when triggering to influence scheduling.
- **Warm starts**: Faster start times by reusing warmed machines (typically 100–300ms).
- **Improved self-hosting**: Streamlined Docker Compose; built-in registry/object storage; simpler scaling.
- **Realtime and streams**: Subscribe to run updates and stream metadata from tasks.
- **Telemetry and build extensions**: First-class OpenTelemetry instrumentation and build customization (e.g., `aptGet`, `prisma`, `puppeteer`, `ffmpeg`).
- **MCP integrations**: CLI exposes an MCP server to interact with tasks from agentic IDEs/clients.

---

## Task Definition (v4)

### Basic structure

```typescript
import { task, logger } from "@trigger.dev/sdk";

export const yourTask = task({
  id: "descriptive_task_name",
  maxDuration: 300, // seconds (default can be set in config)
  run: async (payload: any) => {
    logger.info("Task started", { payload });
    // ... your code here ...
    return { success: true };
  },
});
```

- Always `export const <taskName>` so the worker discovers the task.
- Prefer explicit payload types or schemas for safety.

### Type safety

```typescript
interface MyTaskPayload {
  param1: number;
  param2: string;
}

export const myTask = task({
  id: "my-task",
  run: async (payload: MyTaskPayload) => {
    // Type-safe operations
  },
});
```

---

## Database Access

When you need to query Postgres from within a task, use the shared local SQL utility and centralized env helpers.

1. **Local SQL utility**

   ```typescript
   import sql from "./_db";
   ```

   Do not create ad-hoc pools per task. Use the shared helper, which follows our centralized env practices.

2. **Parameterized SQL**

   ```typescript
   const result = await sql`
     select * from your_function(${teamId}::SMALLINT)
   `;
   ```

   - Always cast parameters explicitly to the correct PostgreSQL type.
   - Log inputs and outputs with `logger.info` where useful.

3. **Result handling**
   - Check for empty results when appropriate.
   - Log row counts or key IDs to aid troubleshooting.

4. **Error handling**
   - Wrap DB calls in `try/catch`.
   - Log errors fully (message + stack + context) and rethrow as needed.

---

## Logging

Use `logger` from `@trigger.dev/sdk` for structured, level-based logs:

```typescript
import { task, logger } from "@trigger.dev/sdk";

export const loggingExample = task({
  id: "logging-example",
  run: async (payload: { data: Record<string, string> }) => {
    logger.debug("Debug message", payload.data);
    logger.log("Log message", payload.data);
    logger.info("Info message", payload.data);
    logger.warn("You've been warned", payload.data);
    logger.error("Error message", payload.data);
  },
});
```

Operation logging tips:

- Log start/end of major operations with parameters and summaries.
- Avoid logging secrets or PII.

---

## Error Handling

1. **Input validation**

   ```typescript
   if (!payload.param1) {
     const error = new Error("Missing `param1` in payload");
     logger.error("Validation error", { error });
     throw error;
   }
   ```

2. **Try/catch around risky operations**

   ```typescript
   try {
     // DB/API operation
   } catch (error) {
     logger.error("Operation failed", {
       message: (error as Error).message,
       stack: (error as Error).stack,
       context: payload,
     });
     throw error;
   }
   ```

3. **Lifecycle hooks**

   ```typescript
   export const myTask = task({
     id: "my-task",
     onFailure: async (payload, error) => {
       logger.error("Task ultimately failed", { error, payload });
       // send alerts/notifications if needed
     },
     run: async (payload) => {
       // main logic
     },
   });
   ```

---

## Waitpoints (v4)

Time-based waits and external-signal waits are first-class in v4 and support idempotency.

- **Time-based waits**

  ```typescript
  import { wait } from "@trigger.dev/sdk";

  await wait.for({ seconds: 30 });
  // or
  await wait.until({ date: new Date(Date.now() + 60_000) });
  ```

- **Tokens for external signals (human-in-the-loop)**

  ```typescript
  import { wait } from "@trigger.dev/sdk";

  const token = await wait.createToken({ timeout: "10m" });
  // Share token.id out-of-band, then later:
  const result = await wait.forToken<{ status: "approved" | "rejected" }>(
    token.id,
  );
  if (!result.ok) {
    // timed out or cancelled
  }
  // elsewhere, complete the token
  // await wait.completeToken(token.id, { status: "approved" });
  ```

- **Idempotency on waits**

  ```typescript
  await wait.for(
    { seconds: 10 },
    { idempotencyKey: "unique-key", idempotencyKeyTTL: "1h" },
  );
  ```

---

## Scheduling (Cron)

v4 continues to support scheduled tasks.

```typescript
import { schedules } from "@trigger.dev/sdk";

export const firstScheduledTask = schedules.task({
  id: "first-scheduled-task",
  cron: "0 */2 * * *", // every two hours (UTC)
  run: async (payload) => {
    // ...
  },
});
```

- Timezone can be specified via `cron: { pattern, timezone }`.
- You can also create schedules imperatively via the SDK or dashboard.

---

## Schema Tasks (Payload Validation)

```typescript
import { schemaTask, logger } from "@trigger.dev/sdk";
import { z } from "zod";

export const mySchemaTask = schemaTask({
  id: "my-schema-task",
  schema: z.object({
    name: z.string(),
    age: z.number(),
  }),
  run: async (payload) => {
    logger.info("Validated user info", payload);
  },
});
```

Invalid payloads throw before `run` executes.

---

## Triggering Tasks Externally (Server → Trigger.dev)

1. Set `TRIGGER_SECRET_KEY` to match your Trigger.dev project.
2. Use the v4 `tasks` API to trigger tasks by `id`.

```typescript
import { tasks } from "@trigger.dev/sdk";
import type { myTask } from "~/trigger/myTask";

export async function POST(request: Request) {
  const data = await request.json();
  const handle = await tasks.trigger<typeof myTask>("my-task", {
    param1: data.param1,
    param2: data.param2,
  });
  return Response.json(handle);
}
```

Other methods:

- `tasks.batchTrigger()` for multiple payloads
- `tasks.triggerAndPoll()` for synchronous polling (avoid in HTTP handlers)

---

## Triggering Tasks Internally (Task → Task)

Inside one task, you can trigger another task. You can also wait for completion.

```typescript
import { task } from "@trigger.dev/sdk";
import { childTask } from "./child-task";

export const parentTask = task({
  id: "parent-task",
  run: async (payload) => {
    const handle = await childTask.trigger({ foo: "some data" });
    // Optionally wait
    // const result = await childTask.triggerAndWait({ foo: "some data" });
  },
});
```

Batch APIs are also available for advanced scenarios.

---

## Metadata and Realtime

Attach or stream structured metadata from tasks and subscribe to runs in realtime.

```typescript
import { task, metadata } from "@trigger.dev/sdk";

export type STREAMS = { openai: unknown };

export const myTask = task({
  id: "my-task",
  run: async (payload: { prompt: string }) => {
    metadata.set("progress", 0.1);
    const stream = await metadata.stream("openai", someReadableStream);
    for await (const chunk of stream) {
      // process chunks
    }
    return { ok: true };
  },
});
```

Subscribing to runs:

```typescript
import { runs, tasks } from "@trigger.dev/sdk";

async function observe() {
  const handle = await tasks.trigger("my-task", { some: "data" });
  for await (const run of runs.subscribeToRun(handle.id)) {
    console.log(run);
  }
}
```

You can also subscribe by tag, by batch, or with typed streams.

---

## Idempotency (v4)

Ensure operations run once per key. Keys can be used for child triggers and waits.

```typescript
import { task, idempotencyKeys, wait } from "@trigger.dev/sdk";

export const myTask = task({
  id: "my-task",
  run: async (payload) => {
    const key = await idempotencyKeys.create("my-task-key");
    await wait.for(
      { seconds: 10 },
      { idempotencyKey: key, idempotencyKeyTTL: "60s" },
    );
  },
});
```

Payload-based keys can be created by hashing the payload if needed.

---

## Project Configuration (`trigger.config.ts`)

Define global settings, telemetry, and build customizations for v4.

```typescript
import { defineConfig } from "@trigger.dev/sdk";
import { PrismaInstrumentation } from "@trigger.dev/sdk/instrumentation";

export default defineConfig({
  project: "<project-ref>",
  dirs: ["./trigger"],

  // Global lifecycle hooks
  onStart: async (payload, { ctx }) => {
    console.log("Task started", ctx.task.id);
  },
  onSuccess: async (payload, output, { ctx }) => {
    console.log("Task succeeded", ctx.task.id);
  },
  onFailure: async (payload, error, { ctx }) => {
    console.log("Task failed", ctx.task.id);
  },

  // Telemetry
  telemetry: {
    instrumentations: [new PrismaInstrumentation()],
    // exporters: [axiomExporter], // optional
  },

  // Runtime and defaults
  runtime: "node",
  defaultMachine: "large-1x",
  maxDuration: 60,
  logLevel: "info",

  // Build customizations (extensions)
  build: {
    external: ["header-generator"],
    extensions: [
      // e.g., aptGet({ packages: ["ffmpeg"] }),
      // prismaExtension(),
      // puppeteer(),
      // ffmpeg(),
    ],
  },
});
```

Notes:

- Use `dirs` to point to task directories.
- Prefer OpenTelemetry instrumentations for DB/LLM libraries.
- Use build extensions for system packages or bundler tweaks.

---

## Self-Hosting (v4)

- Use the provided Docker Compose with built-in registry and object storage.
- Horizontally scale by adding worker containers; v4 supports warm starts to reduce task latency.
- Ensure `TRIGGER_API_URL` points to your self-hosted instance. Do not call the cloud `api.trigger.dev` from this project.
- Best practices:
  - Pin Docker images to explicit versions.
  - Verify `.env` and magic link email flow early.
  - Secure the dashboard/registry; avoid public exposure without auth.

---

## Security

1. **Data handling**
   - Validate inputs (types or schemas).
   - Never log secrets or PII.
   - Always use parameterized SQL.

2. **Authentication**
   - Ensure `TRIGGER_SECRET_KEY` is set and correct per environment.
   - Use environment-scoped configs; leverage v4’s environment-first dashboard.

3. **Observability**
   - Use telemetry and log levels to monitor performance.
   - Track run failures and retries; alert on anomalies.

---

## Upgrading from v3 → v4 (Repo Conventions)

When migrating existing tasks:

1. Replace imports:
   - `import { task, ... } from "@trigger.dev/sdk/v3";` → `import { task, ... } from "@trigger.dev/sdk";`
2. Keep exported task structure intact (`export const x = task({ id, run })`).
3. If using waits, migrate to v4 `wait` APIs and consider idempotency on waits.
4. Confirm any `tasks.trigger()` and `task.trigger()` calls compile with v4 types (minor option name changes may apply).
5. Review `trigger.config.ts` for v4 options (telemetry, build extensions, default machine, warm starts are automatic on platform).
6. Validate self-hosting URLs (use `TRIGGER_API_URL`).

---

## MCP and Tooling

The v4 CLI can expose an MCP server for IDEs/agents (e.g., Cursor) to:

- List possible tasks, trigger tasks, and stream logs
- Query runs and cancel in-flight runs

Use this only in trusted dev environments; do not expose outside your network.

---

## Node.js Runtime

- v4 workers run on a modern Node.js runtime. Keep your code compatible with current LTS/active versions. If you rely on specific Node APIs or versions, document them in `trigger.config.ts` and our project README.

---

## API Requests (Self-Hosted Only)

If making direct API requests to Trigger.dev from this repo (e.g., list runs, cancel runs), always use `TRIGGER_API_URL` as the base URL. Because we self-host, never point requests to the cloud service domain.
