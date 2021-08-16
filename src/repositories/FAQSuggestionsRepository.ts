import { EntityRepository, Repository } from "typeorm";
import { FAQSuggestions } from "../models/FAQSuggestions";

@EntityRepository(FAQSuggestions)
class FAQSuggestionsRepository extends Repository<FAQSuggestions> {}

export { FAQSuggestionsRepository }