import { defineAgent } from "eve";

export default defineAgent({
  model: "openai/gpt-5.4-nano",
  modelOptions: {
    providerOptions: {
      gateway: {
        models: [
          "deepseek/deepseek-v4.1-flash",
          "deepseek/deepseek-v4-flash",
          "deepseek/deepseek-v4-flash-0731",
          "deepseek/deepseek-v4-pro",
          "deepseek/deepseek-v4-pro-0813",
          "deepseek/deepseek-v3.2",
          "deepseek/deepseek-r1",
        ],
      },
    },
  },
});
