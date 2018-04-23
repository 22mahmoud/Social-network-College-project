import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  BaseEntity,
  CreateDateColumn
} from "typeorm";
import { User } from "./User";

@Entity()
export class Post extends BaseEntity {
  @PrimaryGeneratedColumn() id: number;

  @Column({ default: null })
  imageUrl: string;

  @Column() caption: string;

  @CreateDateColumn() createdAt: Date;

  @ManyToOne(() => User, user => user.photos)
  user: User;
}
