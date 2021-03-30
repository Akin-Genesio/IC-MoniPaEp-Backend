import { EntityRepository, Repository } from "typeorm";
import { Appointment } from "../models";

@EntityRepository(Appointment)
class AppointmentsRepository extends Repository<Appointment>{
    
}

export {AppointmentsRepository}