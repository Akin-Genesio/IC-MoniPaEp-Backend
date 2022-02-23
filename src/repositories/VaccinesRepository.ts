import { EntityRepository, Repository } from "typeorm"
import { Vaccine } from "../models"

@EntityRepository(Vaccine)
class VaccinesRepository extends Repository<Vaccine> {}

export { VaccinesRepository }
