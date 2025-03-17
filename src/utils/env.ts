import logger from '#utils/logger';

type ValidatorFn = (value: string) => boolean;

const validators: Record<string, ValidatorFn> = {
  PORT(value) {
    let port = Number(value);
    return (!isNaN(port) && port >= 1 && port <= 65535);
  }
};

export default function<T>(envKey: string, defaultValue?: T): T {
  let envValue = process.env[envKey];

  const errMsg = `Environment variable "${ envKey }"`;
  const warnDefault = (errMsg: string) => 
    logger.warn(`${ errMsg }, using default value instead`);

  if (envValue == null) {
    const _errMsg = `${ errMsg } is not set`;
    if (defaultValue == null) {
      throw new Error(_errMsg);
    } else {
      warnDefault(_errMsg);
      return defaultValue;
    }
  }

  if (envKey in validators) {
    const isValid = validators[envKey]!(envValue);
    if (!isValid) {
      const _errMsg = `${ errMsg } has an invalid value`;
      if (defaultValue == null) {
        throw new Error(_errMsg);
      } else {
        warnDefault(_errMsg);
        return defaultValue;
      }
    }
  }

  return envValue as T;
}