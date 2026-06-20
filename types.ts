export type EnvValues = {
  [K in 'API_KEY' | 'APPLICATION_KEY' | 'DEVICE_ID']: NonNullable<
    (typeof process.env)[K]
  >;
};
