import { Entity, JoinColumn, ManyToOne, PrimaryColumn } from "typeorm";
import { DiseaseOccurrence } from "./DiseaseOccurrence";

@Entity("patient_movement_history")
class PatientMovementHistory {
  @PrimaryColumn()
  disease_occurrence_id: string

  @PrimaryColumn()
  description: string

  @ManyToOne(() => DiseaseOccurrence)
  @JoinColumn({ name: "disease_occurrence_id" })
  diseaseOccurrence: DiseaseOccurrence
}

export { PatientMovementHistory }