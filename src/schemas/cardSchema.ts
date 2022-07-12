import joi from "joi";

const cardSchema = joi.object({
  employeeId: joi.string().required(),
  type: joi.string().valid(
    "groceries",
    "restaurant",
    "transport",
    "education",
    "health"
  ),
  flag: "MASTERCARD"
});

export default cardSchema;