const joi = require("joi");

const signUpSchema = joi.object({
  Name: joi.string().required(),
  email: joi.string().email().required(),
  password: joi.string().required(),
  rollNumber: joi.number().required(),
});

const loginSchema = joi.object({
  email: joi.string().email().required(),
  password: joi.string().required(),
});

module.exports = { signUpSchema, loginSchema };
