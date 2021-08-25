import { Column, Entity, PrimaryColumn } from "typeorm";

@Entity("FAQSuggestions")
class FAQSuggestions{
  @PrimaryColumn()
  question: string;

  @Column()
  answer: string;
}

export { FAQSuggestions }