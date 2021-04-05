import { EntityRepository, Repository } from "typeorm";
import { AssignedHealthProtocol } from "../models/AssignedHealthProtocol";

@EntityRepository(AssignedHealthProtocol)
class AssignedHealthProtocolRepository extends Repository <AssignedHealthProtocol>{}

export { AssignedHealthProtocolRepository }