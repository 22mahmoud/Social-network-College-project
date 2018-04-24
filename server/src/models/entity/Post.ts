import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  BaseEntity,
  CreateDateColumn
} from "typeorm";
import { User } from "./User";
import { IsNotEmpty } from "class-validator";

@Entity()
export class Post extends BaseEntity {
  @PrimaryGeneratedColumn() id: number;

  @Column({ default: null, type: "varchar", length: "200" })
  imageUrl: string;

  @IsNotEmpty()
  @Column({ type: "varchar", length: "200" })
  caption: string;

  @CreateDateColumn() createdAt: Date;

  @ManyToOne(() => User, user => user.posts)
  user: User;
}
