import { MiddlewaresConfig } from "@medusajs/medusa";
import { registerLoggedInUser } from "./logged-in-user";

export const config: MiddlewaresConfig = {
  routes: [
    {
      matcher: /\/admin\/[^(auth)].*/,
      middlewares: [registerLoggedInUser],
    },
  ],
};
