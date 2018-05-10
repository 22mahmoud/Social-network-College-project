import {
  Entity,
  BaseEntity,
  PrimaryColumn,
  BeforeInsert,
  ManyToOne
} from "typeorm";
import uuidv4 from "uuid/v4";

import Post from "../Post/Post.entity";
import User from "../User/User.entity";

@Entity()
export default class LikePost extends BaseEntity {
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
