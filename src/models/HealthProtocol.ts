import { Column, Entity, PrimaryColumn } from "typeorm";
import { v4 as uuid } from 'uuid'

@Entity("healthProtocols")
class HealthProtocol{
  @PrimaryColumn()
  readonly id: string;
  
  @Column()
  title: string;

  @Column()
  description: string;

  constructor(){
    if(!this.id) {
      this.id = uuid();
    }
  }
}

export { HealthProtocol };
