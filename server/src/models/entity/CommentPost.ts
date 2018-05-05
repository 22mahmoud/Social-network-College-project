import {
  Entity,
  BaseEntity,
  PrimaryColumn,
  BeforeInsert,
  ManyToOne,
  Column
} from "typeorm";
import uuidv4 from "uuid/v4";

import { User } from "./User";
import { Post } from "./Post";

@Entity()
export class CommentPost extends BaseEntity {
  @PrimaryColumn("uuid") id: string;

  @Column({ type: "text" })
  content: string;

  @ManyToOne(() => Post, post => post.commentPost)
  post: Post;

  @ManyToOne(() => User, user => user.commentPost)
  user: User;

  @BeforeInsert()
  addId() {
    this.id = uuidv4();
  }
}
