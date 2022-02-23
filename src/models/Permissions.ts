import { Column, Entity, JoinColumn, OneToOne, PrimaryColumn } from "typeorm";
import { SystemUser } from "./SystemUser";

@Entity("permissions")
class Permissions {
  @PrimaryColumn()
  userId: string

  @OneToOne(() => SystemUser)
  @JoinColumn({ name: "userId", referencedColumnName: "id"})
  systemUser: SystemUser

  @Column()
  authorized: boolean

  @Column()
  localAdm: boolean

  @Column()
  generalAdm: boolean
}

export { Permissions }