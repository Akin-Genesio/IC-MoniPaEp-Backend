import { EntityRepository, Repository } from "typeorm";
import { PatientMovementHistory } from "../models";

@EntityRepository(PatientMovementHistory)
class PatientMovementHistoryRepository extends Repository<PatientMovementHistory> {}

export { PatientMovementHistoryRepository }