import { defineAgent } from "eve";

export default defineAgent({
  // Model selection is handled by the Puter AI layer at runtime.
  // Do not route requests through Seed 1.8 or OpenRouter.
  model: "puter/auto",
});
