import { Store as MedusaStore } from "@medusajs/medusa";
import { Column, Entity, OneToMany } from "typeorm";
import { Product } from "./product";
import { User } from "./user";

@Entity()
export class Store extends MedusaStore {
  @Column({ nullable: true })
  origin?: string;

  @OneToMany(() => User, (user) => user?.store)
  members?: User[];

  @OneToMany(() => Product, (product) => product?.store)
  products?: Product[];
}
