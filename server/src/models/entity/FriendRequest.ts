import {
  Entity,
  ManyToOne,
  BaseEntity,
  Column,
  PrimaryColumn,
  BeforeInsert
} from "typeorm";
import uuidv4 from "uuid/v4";

import { User } from "./User";

@Entity()
export class FriendRequest extends BaseEntity {
  @PrimaryColumn() id: string;

  @ManyToOne(() => User, user => user.requestsSent)
  sender: User;

  @ManyToOne(() => User, user => user.requestsReceived)
  receiver: User;

  @Column({ type: "tinyint", default: false })
  isAccepted: boolean;

  @BeforeInsert()
  addId() {
    this.id = uuidv4();
  }
}
