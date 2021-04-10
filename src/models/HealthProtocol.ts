import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Disease } from "./Disease";

@Entity("healthProtocols")
class HealthProtocol{
    @PrimaryGeneratedColumn("uuid")
    id: string

    @Column()
    description: string

    @Column()
    disease_name: string

    @ManyToOne(() => Disease)
    @JoinColumn({name: "disease_name"})
    disease: Disease
}

export { HealthProtocol };
