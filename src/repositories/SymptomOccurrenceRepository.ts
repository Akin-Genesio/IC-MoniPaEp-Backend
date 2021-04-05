import { EntityRepository, Repository } from "typeorm";
import { SymptomOccurrence } from "../models";

@EntityRepository(SymptomOccurrence)
class SymptomOccurrenceRepository extends Repository<SymptomOccurrence> {}

export { SymptomOccurrenceRepository }