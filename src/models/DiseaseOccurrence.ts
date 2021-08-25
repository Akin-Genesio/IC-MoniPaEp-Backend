import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryColumn } from "typeorm";
import {v4 as uuid} from 'uuid'
import { Disease } from ".";
import { Patient } from "./Patient";

@Entity("disease_occurrence")
class DiseaseOccurrence {
  @PrimaryColumn()
  readonly id: string

  @Column()
  patient_id: string

  @Column()
  disease_name: string

  @Column()
  date_start: Date

  @Column()
  diagnosis: string

  @Column()
  status: string

  @ManyToOne(() => Patient)
  @JoinColumn({ name: "patient_id" })
  patient: Patient

  @ManyToOne(() => Disease)
  @JoinColumn({ name: "disease_name" })
  Disease: Disease

  constructor(){
    if(!this.id){
      this.id = uuid();
    }
  }
}

export { DiseaseOccurrence }