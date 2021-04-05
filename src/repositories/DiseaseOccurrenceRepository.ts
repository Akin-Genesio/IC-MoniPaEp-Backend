import { EntityRepository, Repository } from "typeorm";
import { DiseaseOccurrence } from "../models";

@EntityRepository(DiseaseOccurrence)
class DiseaseOccurrenceRepository extends Repository<DiseaseOccurrence> {}

export { DiseaseOccurrenceRepository }