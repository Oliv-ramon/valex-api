import joi from "joi";

const onlinePurchasePayloadSchema = joi.object({
  cardDetails: joi.object({
    number: joi.string().regex(/^[0-9]{4} [0-9]{4} [0-9]{4} [0-9]{4}$/).required(),
    cardholderName: joi.string().required(),
    expirationDate: joi.string().regex(/^[0-9]{2}[/][0-9]{2}$/).required(),
    securityCode: joi.string().length(3).required(),
  }).required(),
  amount: joi.number().greater(0).required(),
  password: joi.string().length(4).required(),
});

export default onlinePurchasePayloadSchema;