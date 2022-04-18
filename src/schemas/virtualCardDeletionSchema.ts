import joi from "joi";

const virtualCardDeletionSchema = joi.object({
  password: joi.string().length(4).required(),
});

export default virtualCardDeletionSchema;