import { Column, Entity, JoinColumn, PrimaryColumn} from "typeorm";
import { HealthProtocol } from "./HealthProtocol";
import { Patient } from "./Patient";

@Entity("assigned_healthprotocol")
class AssignedHealthProtocol {
    @PrimaryColumn()
    patient_id: string;

    @JoinColumn({name: "patient_id"})
    patient: Patient

    @Column()
    healthprotocol_id: string;

    @JoinColumn({name: "healthprotocol_id"})
    healthprotocol: HealthProtocol

}

export { AssignedHealthProtocol }