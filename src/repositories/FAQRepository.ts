import { EntityRepository, Repository } from "typeorm";
import { FAQ } from "../models/FAQ";

@EntityRepository(FAQ)
class FAQRepository extends Repository<FAQ> {}

export { FAQRepository }