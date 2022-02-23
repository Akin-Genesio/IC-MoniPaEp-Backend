import { Column, Entity, PrimaryColumn } from "typeorm";
import { v4 as uuid } from 'uuid'

@Entity("FAQ")
class FAQ{
  @PrimaryColumn()
  readonly id: string;

  @Column()
  question: string;

  @Column()
  answer: string;

  constructor(){
    if(!this.id) {
      this.id = uuid();
    }
  }
}

export { FAQ }