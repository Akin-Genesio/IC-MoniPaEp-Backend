import { Column, Entity, JoinColumn, ManyToOne } from "typeorm";
import { DiseaseOccurrence } from "./DiseaseOccurrence";

@Entity("patient_movement_history")
class PatientMovementHistory {
    @Column()
    disease_occurrence_id: string

    @Column()
    address: string

    @Column()
    period: string

    @ManyToOne(() => DiseaseOccurrence)
    @JoinColumn({name: "disease_occurrence_id"})
    diseaseOccurrence: DiseaseOccurrence
}

export { PatientMovementHistory }