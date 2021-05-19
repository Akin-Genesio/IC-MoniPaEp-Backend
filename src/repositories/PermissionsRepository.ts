import { EntityRepository, Repository } from "typeorm";
import { Permissions } from "../models/Permissions";

@EntityRepository(Permissions)
class PermissionsRepository extends Repository<Permissions>{}

export { PermissionsRepository }