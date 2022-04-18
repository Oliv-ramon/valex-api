import joi from "joi";

const virtualCardCreationSchema = joi.object({
  flag: joi.string().required(),
  password: joi.string().length(4).required(),
});

export default virtualCardCreationSchema;