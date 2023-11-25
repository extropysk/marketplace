import {
  FindConfig,
  ProductCollectionService as MedusaProductCollectionService,
  Selector,
} from "@medusajs/medusa";
import { CreateProductCollection as MedusaCreateProductCollection } from "@medusajs/medusa/dist/types/product-collection";
import { Lifetime } from "awilix";
import { ProductCollection } from "src/models/product-collection";
import { Store } from "src/models/store";

type ListSelector = Selector<ProductCollection> & {
  q?: string;
  discount_condition_id?: string;
  store_id?: string;
};

type ListConfig = {
  skip: number;
  take: number;
};

type CreateProductCollection = {
  store_id?: string;
} & MedusaCreateProductCollection;

class ProductService extends MedusaProductCollectionService {
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

  list(
    selector?: ListSelector,
    config?: ListConfig
  ): Promise<ProductCollection[]> {
    if (!selector.store_id && this._store?.id) {
      selector.store_id = this._store?.id;
    }

    return super.list(selector, config);
  }

  listAndCount(
    selector?: ListSelector,
    config?: FindConfig<ProductCollection>
  ): Promise<[ProductCollection[], number]> {
    if (!selector.store_id && this._store?.id) {
      selector.store_id = this._store?.id;
    }

    return super.listAndCount(selector, config);
  }

  async retrieve(
    collectionId: string,
    config?: FindConfig<ProductCollection>
  ): Promise<ProductCollection> {
    const collection = await super.retrieve(collectionId, config);

    if (collection.store_id !== this._store?.id) {
      throw new Error("Collection does not exist in store.");
    }

    return collection;
  }

  async retrieveByHandle(
    collectionHandle: string,
    config?: FindConfig<ProductCollection>
  ): Promise<ProductCollection> {
    const collection = await super.retrieveByHandle(collectionHandle, config);
    if (collection.store_id !== this._store?.id) {
      throw new Error("Collection does not exist in store.");
    }

    return collection;
  }

  async create(
    productCollectionObject: CreateProductCollection
  ): Promise<ProductCollection> {
    if (!productCollectionObject.store_id && this._store?.id) {
      productCollectionObject.store_id = this._store?.id;
    }

    return await super.create(productCollectionObject);
  }
}

export default ProductService;
