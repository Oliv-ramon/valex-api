import joi from "joi";

const cardSchema = joi.object({
  employeeId: joi.string().required(),
  type: joi.string().required(),
  flag: joi.string().required()
});

export default cardSchema;