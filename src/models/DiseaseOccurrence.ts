import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryColumn } from "typeorm";
import {v4 as uuid} from 'uuid'
import { Patient } from "./Patient";

@Entity("disease_occurrence")
class DiseaseOccurrence {
    @PrimaryColumn()
    readonly id: string

    @Column()
    date_start: Date

    @Column()
    diagnosis: string

    @Column()
    disease_name: string

    @Column()
    status: string

    @Column()
    patient_id: string

    @ManyToOne(() => Patient)
    @JoinColumn({name: "patient_id"})
    patient: Patient

    constructor(){
        if(!this.id){
            this.id = uuid();
        }
    }
}

export { DiseaseOccurrence }