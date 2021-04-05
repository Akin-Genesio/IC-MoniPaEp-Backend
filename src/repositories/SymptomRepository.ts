import { EntityRepository, Repository } from "typeorm";
import { Symptom } from "../models";

@EntityRepository(Symptom)
class SymptomRepository extends Repository<Symptom> {}

export { SymptomRepository }