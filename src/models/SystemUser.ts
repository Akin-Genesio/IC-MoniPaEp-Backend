import { BeforeInsert, BeforeUpdate, Column, Entity, PrimaryColumn } from "typeorm";
import {v4 as uuid} from 'uuid'
import bcrypt from 'bcrypt'

@Entity("systemUser")
class SystemUser {
    @PrimaryColumn()
    readonly id: string;

    @Column()
    name: string;

    @PrimaryColumn()
    CPF: string;

    @PrimaryColumn()
    email: string;

    @Column({select: false})
    password: string;

    @Column()
    department: string;

    @Column()
    createdAt: Date;

    constructor(){
      if(!this.id){
        this.id = uuid();
      }
    }

    @BeforeInsert()
    @BeforeUpdate()
    async hashPassword(): Promise<void> {
        const hash = await bcrypt.hash(this.password, 10)
        this.password = hash
    }
}

export {SystemUser}