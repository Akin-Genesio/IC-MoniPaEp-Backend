import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm"
import { Patient } from "./Patient"

@Entity("appointments")
class Appointment{
  @PrimaryGeneratedColumn("uuid")
  id:string

  @Column()
  date: Date

  @Column()
  whenRemember: Date

  @Column()
  location:string

  @Column()
  type:string

  @Column()
  patient_id: string

  @ManyToOne(() => Patient)
  @JoinColumn({ name: "patient_id" })
  patient: Patient
}

export { Appointment }