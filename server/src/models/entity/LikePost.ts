import {
  Entity,
  BaseEntity,
  PrimaryColumn,
  BeforeInsert,
  ManyToOne
} from "typeorm";
import uuidv4 from "uuid/v4";

import { User } from "./User";
import { Post } from "./Post";

@Entity()
export class LikePost extends BaseEntity {
  @PrimaryColumn("uuid") id: string;

  @ManyToOne(() => Post, post => post.likePost)
  post: Post;

  @ManyToOne(() => User, user => user.likePost)
  user: User;

  @BeforeInsert()
  addId() {
    this.id = uuidv4();
  }
}
