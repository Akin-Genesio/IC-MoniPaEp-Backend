import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from "typeorm";
import { v4 as uuid } from 'uuid'
import { DiseaseOccurrence } from "./DiseaseOccurrence";

@Entity("patient_movement_history")
class PatientMovementHistory {
  @PrimaryColumn()
  readonly id: string;
  
  @Column()
  disease_occurrence_id: string

  @Column()
  description: string

  @Column()
  date: Date;

  @ManyToOne(() => DiseaseOccurrence)
  @JoinColumn({ name: "disease_occurrence_id" })
  diseaseOccurrence: DiseaseOccurrence

  constructor(){
    if(!this.id) {
      this.id = uuid();
    }
  }
}

export { PatientMovementHistory }