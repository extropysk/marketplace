import { MiddlewaresConfig } from "@medusajs/medusa";
import { registerLoggedInUser } from "./logged-in-user";
import { registerStore } from "./store";

export const config: MiddlewaresConfig = {
  routes: [
    {
      matcher: /\/admin\/[^(auth)].*/,
      middlewares: [registerLoggedInUser],
    },
    {
      matcher: "/store/*",
      middlewares: [registerStore],
    },
  ],
};
