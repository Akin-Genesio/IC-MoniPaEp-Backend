import { Column, Entity, PrimaryColumn } from "typeorm";
import {v4 as uuid} from 'uuid'

@Entity("patients")
class Patient{
    @PrimaryColumn()
    readonly id: string;

    @Column()
    name: string;
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
    hasHealthPlan: boolean;

    @Column()
    age: number;

    @Column()
    status: string;

    constructor(){
        if(!this.id){
            this.id = uuid();
        }
    }
}

export {Patient}