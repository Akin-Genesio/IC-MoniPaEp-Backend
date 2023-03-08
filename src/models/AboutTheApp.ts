import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm"
import { Patient } from "./Patient"

@Entity("about")
class AboutTheApp{
  @PrimaryGeneratedColumn("uuid")
  id:string

  @Column()
  main: string

  @Column()
  secundary: string
}

export { AboutTheApp }