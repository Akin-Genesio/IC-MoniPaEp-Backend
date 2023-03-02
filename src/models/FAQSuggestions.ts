import { Column, Entity, PrimaryColumn } from "typeorm";
import { v4 as uuid } from 'uuid'

@Entity("FAQSuggestions")
class FAQSuggestions{
  @PrimaryColumn()
  readonly id: string;

  @Column()
  question: string;

  constructor(){
    if(!this.id) {
      this.id = uuid();
    }
  }
}

export { FAQSuggestions }