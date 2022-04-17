import joi from "joi";

const purchasePayloadSchema = joi.object({
  amount: joi.number().greater(0).required(),
  password: joi.string().length(4).required(),
});

export default purchasePayloadSchema;