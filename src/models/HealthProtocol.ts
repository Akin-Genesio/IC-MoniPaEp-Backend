import { Column, Entity, JoinColumn, JoinTable, ManyToMany, PrimaryGeneratedColumn } from "typeorm";
import { Patient } from ".";


@Entity("healthProtocols")
class HealthProtocol{
    @PrimaryGeneratedColumn("uuid")
    id: string

    @Column()
    description: string

    @Column()
    disease_name: string

    @ManyToMany(() => Patient)
    @JoinTable()
    patients: Patient[]
}

export {HealthProtocol}