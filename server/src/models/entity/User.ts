import {
  Entity,
  Column,
  BaseEntity,
  // PrimaryColumn,
  BeforeInsert,
  PrimaryGeneratedColumn,
  OneToMany
} from "typeorm";
import { hashSync, compareSync } from "bcrypt-nodejs";
import { IsNotEmpty, IsEmail, MinLength } from "class-validator";
import * as jwt from "jsonwebtoken";

import { Unique } from "../../helpers/uniqueUser.validate";
import constants from "../../config/constants";
import { Post } from "./Post";

@Entity()
export class User extends BaseEntity {
  @PrimaryGeneratedColumn() id: number;

  @IsEmail()
  @IsNotEmpty()
  @Unique({
    message: "$value already exists. Choose another email."
  })
  @Column({ type: "varchar", unique: true, length: "200" })
  email: string;

  @IsNotEmpty()
  @Column({ type: "varchar", length: "230" })
  firstName: string;

  @IsNotEmpty()
  @Column({ type: "varchar", length: "230" })
  lastName: string;

  @IsNotEmpty()
  @MinLength(5)
  @Column({ type: "text" })
  password: string;

  @OneToMany(() => Post, post => post.user)
  posts: Post[];

  @BeforeInsert()
  hashPassword() {
    this.password = hashSync(this.password);
  }

  createToken() {
    return jwt.sign({ id: this.id }, constants.JWT_SECRET);
  }

  authanticateUser(password) {
    return compareSync(password, this.password);
  }
}
