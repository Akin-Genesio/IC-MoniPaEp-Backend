import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm"
import { Patient } from "./Patient"
import { USM } from "./USM"

@Entity("vaccines")
class Vaccine{
  @PrimaryGeneratedColumn("uuid")
  id:string

  @Column()
  date: Date


  @Column()
  type:string


  @Column()
  patient_id: string

  @ManyToOne(() => Patient)
  @JoinColumn({ name: "patient_id" })
  patient: Patient

  @Column()
  usm_name: string

  @ManyToOne(() => USM)
  @JoinColumn({ name: "usm_name" })
  usm: USM
}

export { Vaccine }