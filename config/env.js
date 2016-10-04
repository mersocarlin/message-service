const { env } = process;

export const config = {
  environment: env.NODE_ENV || 'development',
  http: {
    host: env.HTTP_HOST || '0.0.0.0',
    port: env.PORT || env.HTTP_PORT || '3000',
  },
  accessKey: env.ACCESS_KEY || '',
};
