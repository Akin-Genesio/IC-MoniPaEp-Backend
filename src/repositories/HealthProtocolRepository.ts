import { EntityRepository, Repository } from "typeorm";
import { HealthProtocol } from "../models/HealthProtocol";

@EntityRepository(HealthProtocol)
class HealthProtocolRepository extends Repository<HealthProtocol>{}

export { HealthProtocolRepository }