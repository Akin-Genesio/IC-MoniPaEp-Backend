import { BeforeInsert, BeforeUpdate, Column, Entity, PrimaryColumn } from "typeorm";
import {v4 as uuid} from 'uuid'
import bcrypt from 'bcrypt'

@Entity("patients")
class Patient{
    @PrimaryColumn()
    readonly id: string;

    @Column()
    name: string;

    @Column({select: false})
    password: string;

    @Column()
    CPF: string;

    @Column()
    email: string;

    @Column()
    lastGPSLocation: string;

    @Column()
    allowSMS: boolean;

    @Column()
    workAddress: string;

    @Column()
    homeAddress: string;

    @Column()
    neighborhood: string;

    @Column()
    hasHealthPlan: boolean;

    @Column()
    houseNumber: number;

    @Column()
    dateOfBirth: Date;

    @Column()
    status: string;

    @Column()
    readonly activeAccount: boolean;

    constructor(){
        if(!this.id){
            this.id = uuid();
        }
        if(!this.activeAccount){
            this.activeAccount = true;
        }
    }

    @BeforeInsert()
    @BeforeUpdate()
    async hashPassword(): Promise<void> {
        const hash = await bcrypt.hash(this.password, 10)
        this.password = hash
    }
}

export {Patient}