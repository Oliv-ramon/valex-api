import joi from "joi";

const activationDataSchema = joi.object({
  CVV: joi.string().required(),
  password: joi.string().required()
});

export default activationDataSchema;