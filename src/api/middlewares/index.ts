import { MiddlewaresConfig } from "@medusajs/medusa";
import { registerStoreOrigin } from "./store-origin";
import { registerStoreSession } from "./store-session";

export const config: MiddlewaresConfig = {
  routes: [
    {
      matcher: /\/admin\/[^(auth)].*/,
      middlewares: [registerStoreSession],
    },
    {
      matcher: "/store/*",
      middlewares: [registerStoreOrigin],
    },
  ],
};
