import { Column, Entity, PrimaryColumn } from "typeorm";

@Entity("usm")
class USM {
  @PrimaryColumn()
  name: string

  @Column()
  address: string

  @Column()
  neighborhood: string

  @Column()
  latitude: Number

  @Column()
  longitude: Number
}

export { USM }