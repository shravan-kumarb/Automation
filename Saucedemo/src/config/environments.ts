import 'dotenv/config';

export interface EnvConfig{
    name:string;
    baseURL:string;
    apiURL:string;
}

const envs: Record<string, EnvConfig>={
    production:{
        name:'production',
        baseURL:'https://www.saucedemo.com/',
        apiURL: 'https://jsonplaceholder.typicode.com',
    },
};

export function getEnvConfig():EnvConfig{
    const envName = process.env.ENV||'production';
    const config = envs[envName];
    if(!config) throw new Error(`Unknown environment:${envName}`);
    //Allow pre-run overrides from environment variables (.env / CI secrets).
    return {
        ...config,
        baseURL: process.env.BASE_URL || config.baseURL,
        apiURL:  process.env.API_URL  || config.apiURL,
    };
}
