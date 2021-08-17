import { EntityRepository, Repository } from "typeorm";
import { RefreshToken } from "../models";

@EntityRepository(RefreshToken)
class RefreshTokenRepository extends Repository<RefreshToken> {}

export { RefreshTokenRepository }