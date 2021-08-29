import { Entity, JoinColumn, OneToOne, PrimaryColumn } from "typeorm";
import { Disease } from ".";
import { HealthProtocol } from "./HealthProtocol";

@Entity("assigned_healthprotocol")
class AssignedHealthProtocol {
  @PrimaryColumn()
  disease_name: string;

  @OneToOne(() => Disease)
  @JoinColumn({ name: "disease_name",  referencedColumnName: "name" })
  disease: Disease

  @PrimaryColumn()
  healthprotocol_id: string;

  @OneToOne(() => HealthProtocol)
  @JoinColumn({ name: "healthprotocol_id", referencedColumnName: "id" })
  healthprotocol: HealthProtocol
}

export { AssignedHealthProtocol };
