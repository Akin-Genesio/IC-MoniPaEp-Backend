import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from "typeorm";
import { v4 as uuid } from 'uuid'
import { DiseaseOccurrence } from "./DiseaseOccurrence";
import { Patient } from "./Patient";
import { Symptom } from "./Symptom";

@Entity("symptom_occurrence")
class SymptomOccurrence {
  @PrimaryColumn()
  readonly id: string

  @Column()
  patient_id: string
  
  @Column()
  symptom_name: string

  @Column()
  disease_occurrence_id: string
  
  @Column()
  registered_date: Date

  @ManyToOne(() => Patient)
  @JoinColumn({ name: "patient_id" })
  patient: Patient

  @ManyToOne(() => Symptom)
  @JoinColumn({ name: "symptom_name" })
  symptom: Symptom

  @ManyToOne(() => DiseaseOccurrence)
  @JoinColumn({ name: "disease_occurrence_id" })
  disease_occurrence: DiseaseOccurrence

  constructor(){
    if(!this.id){
      this.id = uuid();
    }
  }
}

export { SymptomOccurrence }