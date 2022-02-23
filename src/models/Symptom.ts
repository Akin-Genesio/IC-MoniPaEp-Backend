import { Entity, PrimaryColumn } from "typeorm";

@Entity("symptom")
class Symptom {
  @PrimaryColumn()
  symptom: string
}

export { Symptom }