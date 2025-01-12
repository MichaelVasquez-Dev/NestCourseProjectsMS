import 'dotenv/config';
import * as Joi from 'joi';

interface EnvVars {
    PORT: number;
    PRODUCTS_MS_HOST: string;
    PRODUCTS_MS_PORT: number;
    ORDERS_MS_HOST: string;
    ORDERS_MS_PORT: number;
}

const envsSchema = Joi.object({
    PORT: Joi.number().required(),
    PRODUCTS_MS_HOST: Joi.string().required(),
    PRODUCTS_MS_PORT: Joi.number().required(),
    ORDERS_MS_HOST: Joi.string().required(),
    ORDERS_MS_PORT: Joi.number().required(),
}).unknown(true);

const { error, value } = envsSchema.validate(process.env);

if (error) throw new Error(`Config validation error: ${error.message}`);

const envsVars: EnvVars = value;

export const envs = {
    port: envsVars.PORT,
    productsMSHost: envsVars.PRODUCTS_MS_HOST,
    productsMSPort: envsVars.PRODUCTS_MS_PORT,
    ordersMSHost: envsVars.ORDERS_MS_HOST,
    ordersMSPort: envsVars.ORDERS_MS_PORT,
};