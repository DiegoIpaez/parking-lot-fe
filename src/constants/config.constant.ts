export enum NodeEnv {
  Development = 'development',
  Production = 'production',
  Test = 'test',
}

export const CONFIG = {
  API_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1',
  JWT_SECRET: process.env.JWT_SECRET || 'tu-secreto-super-seguro',
  NODE_ENV: (process.env.NODE_ENV as NodeEnv) || NodeEnv.Development,
};
