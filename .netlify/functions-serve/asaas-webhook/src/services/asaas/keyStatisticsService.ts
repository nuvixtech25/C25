
import { KeyStatistics } from './types';

// Estado global (sem persistência)
export const keyTracker: KeyStatistics = {};

export const trackKeyUsage = (keyId: number, tracker: KeyStatistics): void => {
  if (!tracker[keyId]) {
    tracker[keyId] = {
      uses: 0,
      lastUsed: null,
      errors: 0,
      lastError: null,
      lastErrorMessage: null
    };
  }
  
  tracker[keyId].uses += 1;
  tracker[keyId].lastUsed = new Date();
};

export const trackKeyError = (keyId: number, errorMessage: string, tracker: KeyStatistics): void => {
  if (!tracker[keyId]) {
    tracker[keyId] = {
      uses: 0,
      lastUsed: null,
      errors: 0,
      lastError: null,
      lastErrorMessage: null
    };
  }
  
  tracker[keyId].errors += 1;
  tracker[keyId].lastError = new Date();
  tracker[keyId].lastErrorMessage = errorMessage;
};

export const getKeyStatistics = (): KeyStatistics => {
  return keyTracker;
};
