import { setupServer } from "msw/node";
import { handlers } from "@/mocks/handlers";

// Node-side MSW server for Vitest
export const server = setupServer(...handlers);
