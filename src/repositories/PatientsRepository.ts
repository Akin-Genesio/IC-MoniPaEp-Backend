import { EntityRepository, Repository } from "typeorm";
import { Patient } from "../models/Patient";

@EntityRepository(Patient)
class PatientsRepository extends Repository<Patient> {}

export { PatientsRepository }