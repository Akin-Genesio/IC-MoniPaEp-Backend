import { EntityRepository, Repository } from "typeorm"
import { USM } from "../models"

@EntityRepository(USM)
class USMRepository extends Repository<USM> {}

export { USMRepository }