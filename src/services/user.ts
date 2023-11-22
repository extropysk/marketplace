import { UserService as MedusaUserService } from "@medusajs/medusa";
import { CreateUserInput as MedusaCreateUserInput } from "@medusajs/medusa/dist/types/user";
import { Lifetime } from "awilix";
import { Store } from "src/models/store";
import { User } from "../models/user";
import StoreRepository from "../repositories/store";

type CreateUserInput = {
  store_id?: string;
} & MedusaCreateUserInput;

class UserService extends MedusaUserService {
  static LIFE_TIME = Lifetime.SCOPED;
  protected readonly _store: Store | null;
  protected readonly storeRepository_: typeof StoreRepository;

  constructor(container, options) {
    // @ts-expect-error prefer-rest-params
    super(...arguments);
    this.storeRepository_ = container.storeRepository;

    try {
      this._store = container.store;
    } catch (e) {
      // avoid errors when backend first runs
    }
  }

  async create(user: CreateUserInput, password: string): Promise<User> {
    if (!user.store_id) {
      const storeRepo = this.manager_.withRepository(this.storeRepository_);
      let newStore = storeRepo.create();
      newStore = await storeRepo.save(newStore);
      user.store_id = newStore.id;
    }

    return await super.create(user, password);
  }
}

export default UserService;
