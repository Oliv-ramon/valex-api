import joi from "joi";

const cardSchema = joi.object({
  employeeId: joi.string().required(),
  type: joi.string().valid(
    "groceries",
    "restaurants",
    "transport",
    "education",
    "health"
  ),
  flag: joi.string().required()
});

export default cardSchema;