import joi from "joi";

const rechargeSchema = joi.object({
  amount: joi.number().greater(0).required(),
});

export default rechargeSchema;