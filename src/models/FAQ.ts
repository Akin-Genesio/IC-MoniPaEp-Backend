import { Column, Entity, PrimaryColumn } from "typeorm";

@Entity("FAQ")
class FAQ{
  @PrimaryColumn()
  question: string;

  @Column()
  answer: string;
}

export { FAQ }