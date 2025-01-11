import 'dotenv/config';
import * as Joi from 'joi';

interface EnvVars {
    PORT: number;
}

const envSchema = Joi.object({
  PORT: Joi.number().required(),
//   PORT: Joi.number().default(3001),
}).unknown(true);

const { error, value } = envSchema.validate(process.env);

if (error) throw new Error(`Config validation error: ${error.message}`);

const envVars: EnvVars = value;

export const envs = {
  PORT: envVars.PORT,
};