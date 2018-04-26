import {
  Entity,
  Column,
  ManyToOne,
  BaseEntity,
  CreateDateColumn,
  PrimaryColumn,
  BeforeInsert
} from "typeorm";
import { IsNotEmpty } from "class-validator";
import uuidv4 from "uuid/v4";

import { User } from "./User";

@Entity()
export class Post extends BaseEntity {
  @PrimaryColumn("uuid") id: string;

  @Column({ default: null, type: "varchar", length: "200" })
  imageUrl: string;

  @IsNotEmpty()
  @Column({ type: "varchar", length: "200" })
  caption: string;

  @CreateDateColumn() createdAt: Date;

  @ManyToOne(() => User, user => user.posts)
  user: User;

  @BeforeInsert()
  addId() {
    this.id = uuidv4();
  }
}
