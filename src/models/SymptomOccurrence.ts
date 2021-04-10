import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from "typeorm";
import { DiseaseOccurrence } from "./DiseaseOccurrence";
import { Symptom } from "./Symptom";

@Entity("symptom_occurrence")
class SymptomOccurrence {
    
    @PrimaryColumn()
    disease_occurrence_id: string

    @PrimaryColumn()
    symptom_name: string

    @ManyToOne(() => Symptom)
    @JoinColumn({name: "symptom_name"})
    symptom: Symptom

    @Column()
    registered_date: Date

    @ManyToOne(() => DiseaseOccurrence)
    @JoinColumn({name: "disease_occurrence_id"})
    disease_occurrence: DiseaseOccurrence
}

export { SymptomOccurrence }