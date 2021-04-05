import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from "typeorm";
import { DiseaseOccurrence } from "./DiseaseOccurrence";

@Entity("symptom_occurrence")
class SymptomOccurrence {
    
    @PrimaryColumn()
    disease_occurrence_id: string

    @Column()
    symptom_name: string

    @Column()
    registered_date: Date

    @ManyToOne(() => DiseaseOccurrence)
    @JoinColumn({name: "disease_occurrence_id"})
    disease_occurrence: DiseaseOccurrence
}

export { SymptomOccurrence }