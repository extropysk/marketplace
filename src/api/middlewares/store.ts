import type {
  MedusaNextFunction,
  MedusaRequest,
  MedusaResponse,
} from "@medusajs/medusa";
import { Store } from "src/models/store";
import StoreService from "src/services/store";

export const registerStore = async (
  req: MedusaRequest,
  res: MedusaResponse,
  next: MedusaNextFunction
) => {
  let store: Store | null = null;

  const origin = req.headers.origin;
  if (origin) {
    const storeService = req.scope.resolve("storeService") as StoreService;
    store = await storeService.retrieveByOrigin(origin);
  }

  req.scope.register({
    store: {
      resolve: () => store,
    },
  });

  next();
};
