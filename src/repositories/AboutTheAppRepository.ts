import { EntityRepository, Repository } from "typeorm";
import { AboutTheApp } from "../models";

@EntityRepository(AboutTheApp)
class AboutTheAppsRepository extends Repository<AboutTheApp> {}

export {AboutTheAppsRepository}