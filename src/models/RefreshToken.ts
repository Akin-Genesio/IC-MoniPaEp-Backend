import { v4 as uuid } from 'uuid'
import { Column, Entity, JoinColumn, OneToOne, PrimaryColumn } from "typeorm";
import { Patient } from './Patient'
import { SystemUser } from "./SystemUser";

@Entity("refresh_token")
class RefreshToken {
    
    @PrimaryColumn()
    readonly id: string

    @Column()
    expiresIn: number

    @Column()
    patientId: string

    @Column()
    systemUserId: string

    @OneToOne(() => Patient)
    @JoinColumn({ name: "patientId" })
    patient: Patient

    @OneToOne(() => SystemUser)
    @JoinColumn({ name: "systemUserId" })
    systemUser: SystemUser

    constructor(){
      if(!this.id){
        this.id = uuid();
      }
  }
}

export { RefreshToken }