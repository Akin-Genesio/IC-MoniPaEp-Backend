import { EntityRepository, Repository } from "typeorm";
import { SystemUser } from "../models/SystemUser";

@EntityRepository(SystemUser)
class SystemUserRepository extends Repository<SystemUser> {}

export {SystemUserRepository}