import type {
  MedusaNextFunction,
  MedusaRequest,
  MedusaResponse,
  User,
  UserService,
} from "@medusajs/medusa";

interface Request extends MedusaRequest {
  session?: {
    user_id?: string;
  };
}

export const registerLoggedInUser = async (
  req: Request,
  res: MedusaResponse,
  next: MedusaNextFunction
) => {
  let loggedInUser: User | null = null;

  const userId = req.user?.userId ?? req.session?.user_id;
  if (userId) {
    const userService = req.scope.resolve("userService") as UserService;
    loggedInUser = await userService.retrieve(userId);
  }

  req.scope.register({
    loggedInUser: {
      resolve: () => loggedInUser,
    },
  });

  next();
};
