import { EntityRepository, Repository } from "typeorm";
import { Disease } from "../models";

@EntityRepository(Disease)
class DiseaseRepository extends Repository<Disease> {}

export { DiseaseRepository };
