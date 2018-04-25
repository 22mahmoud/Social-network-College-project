import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  BaseEntity,
  Column
} from "typeorm";
import { User } from "./User";

@Entity()
export class FriendRequest extends BaseEntity {
  @PrimaryGeneratedColumn() id: number;

  @ManyToOne(() => User, user => user.requestsSent)
  sender: User;

  @ManyToOne(() => User, user => user.requestsReceived)
  receiver: User;

  @Column({ type: "tinyint", default: false })
  isAccepted: boolean;
}
