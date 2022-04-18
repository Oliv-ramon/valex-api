import joi from "joi";

const blockingSchema = joi.object({
  CVV: joi.string().required(),
  password: joi.string().required()
});

export default blockingSchema;