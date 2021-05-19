import { Column, Entity, JoinColumn, PrimaryColumn } from "typeorm";
import { SystemUser } from "./SystemUser";

@Entity("permissions")
class Permissions {
    @PrimaryColumn()
    userId: string

    @JoinColumn({name: "userId"})
    systemUser: SystemUser

    @Column()
    localAdm: boolean

    @Column()
    generalAdm: boolean
}

export { Permissions }