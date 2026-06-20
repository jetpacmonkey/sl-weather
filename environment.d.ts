declare global {
  namespace NodeJS {
    interface ProcessEnv {
      API_KEY: string | undefined;
      APPLICATION_KEY: string | undefined;
      DEVICE_ID: string | undefined;
    }
  }
}

export {};
