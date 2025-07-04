const joi = require("joi");

const registerSchema = joi.object({
    name: joi.string().min(3).max(30).required(),
    email: joi.string().email().required(),
    password: joi.string().min(6).max(100).required(),
});

const loginSchema = joi.object({
    email: joi.string().email().required(),
    password: joi.string().min(6).max(100).required(),
});

module.exports = {
    registerSchema: registerSchema,
    loginSchema: loginSchema,
}