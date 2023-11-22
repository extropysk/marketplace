import {
  FindConfig,
  StoreService as MedusaStoreService,
} from "@medusajs/medusa";
import { Lifetime } from "awilix";
import { Store } from "src/models/store";
import { Repository } from "typeorm";

class StoreService extends MedusaStoreService {
  static LIFE_TIME = Lifetime.SCOPED;
  protected readonly _store: Store | null;

  constructor(container, options) {
    // @ts-expect-error prefer-rest-params
    super(...arguments);

    try {
      this._store = container.store;
    } catch (e) {
      // avoid errors when backend first runs
    }
  }

  async retrieveByOrigin(
    origin: string,
    config?: FindConfig<Store>
  ): Promise<Store> {
    const storeRepo = this.manager_.withRepository<Store, Repository<Store>>(
      this.storeRepository_
    );
    const store = await storeRepo.findOne({
      ...config,
      where: {
        origin: origin,
      },
    });

    return store;
  }

  async retrieve(config?: FindConfig<Store>): Promise<Store> {
    if (!this._store?.id) {
      return super.retrieve(config);
    }

    return this.retrieveForLoggedInUser(config);
  }

  async retrieveForLoggedInUser(config?: FindConfig<Store>) {
    const storeRepo = this.manager_.withRepository<Store, Repository<Store>>(
      this.storeRepository_
    );
    const store = await storeRepo.findOne({
      ...config,
      relations: [...config.relations, "members"],
      where: {
        id: this._store?.id,
      },
    });

    if (!store) {
      throw new Error("Unable to find the user store");
    }

    return store;
  }
}

export default StoreService;
