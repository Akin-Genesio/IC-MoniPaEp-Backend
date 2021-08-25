import { Column, Entity, JoinColumn, PrimaryColumn } from "typeorm";
import { SystemUser } from "./SystemUser";

@Entity("permissions")
class Permissions {
  @PrimaryColumn()
  userId: string

  @JoinColumn({name: "userId"})
  systemUser: SystemUser

  @Column()
  authorized: boolean

  @Column()
  localAdm: boolean

  @Column()
  generalAdm: boolean
}

export { Permissions }