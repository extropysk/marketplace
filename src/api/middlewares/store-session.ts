import type {
  MedusaNextFunction,
  MedusaRequest,
  MedusaResponse,
  UserService,
} from "@medusajs/medusa";
import { Store } from "src/models/store";

interface Request extends MedusaRequest {
  session?: {
    user_id?: string;
  };
}

export const registerStoreSession = async (
  req: Request,
  res: MedusaResponse,
  next: MedusaNextFunction
) => {
  let store: Store | null = null;

  const userId = req.user?.userId ?? req.session?.user_id;
  if (userId) {
    const userService = req.scope.resolve("userService") as UserService;
    const user = await userService.retrieve(userId, {
      relations: ["store"],
    });
    store = user?.store;
  }

  req.scope.register({
    store: {
      resolve: () => store,
    },
  });

  next();
};
