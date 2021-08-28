import { Entity, JoinColumn, PrimaryColumn } from "typeorm";
import { Disease } from ".";
import { HealthProtocol } from "./HealthProtocol";

@Entity("assigned_healthprotocol")
class AssignedHealthProtocol {
  @PrimaryColumn()
  disease_name: string;

  @JoinColumn({ name: "disease_name" })
  disease: Disease

  @PrimaryColumn()
  healthprotocol_id: string;

  @JoinColumn({ name: "healthprotocol_id" })
  healthprotocol: HealthProtocol
}

export { AssignedHealthProtocol };
