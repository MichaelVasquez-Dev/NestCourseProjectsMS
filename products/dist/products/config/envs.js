"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.envs = void 0;
require("dotenv/config");
const Joi = require("joi");
const envSchema = Joi.object({
    PORT: Joi.number().required(),
}).unknown(true);
const { error, value } = envSchema.validate(process.env);
if (error)
    throw new Error(`Config validation error: ${error.message}`);
const envVars = value;
exports.envs = {
    PORT: envVars.PORT,
};
//# sourceMappingURL=envs.js.map