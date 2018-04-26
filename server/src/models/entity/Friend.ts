import { BaseEntity, PrimaryColumn, BeforeInsert } from "typeorm";

import uuiv4 from "uuid/v4";

export default class Friend extends BaseEntity {
  @PrimaryColumn("uuid") id: string;

  @BeforeInsert()
  addId() {
    this.id = uuiv4();
  }
}
