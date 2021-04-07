import { EntityRepository, Repository } from "typeorm";
import { HealthProtocol } from "../models";

@EntityRepository(HealthProtocol)
class HealthProtocolRepository extends Repository<HealthProtocol> {}

export { HealthProtocolRepository };
