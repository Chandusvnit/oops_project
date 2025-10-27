import Joi from 'joi';

export const registerSchema = Joi.object({
  name: Joi.string().min(2).max(100).required(),
  roomNumber: Joi.string().allow('', null),
  email: Joi.string().email().required(),
  phone: Joi.string().allow('', null),
  password: Joi.string().min(8).max(64).required()
});

export const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(8).max(64).required()
});