import * as z from 'zod';

// Format currency values to BRL
export const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(value);
};

// Format CPF/CNPJ
export const formatCpfCnpj = (value: string): string => {
  const cleanValue = value.replace(/\D/g, '');

  if (cleanValue.length <= 11) {
    // CPF
    return cleanValue
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d{1,2})/, '$1-$2')
      .substring(0, 14);
  } else {
    // CNPJ
    return cleanValue
      .replace(/(\d{2})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d)/, '$1/$2')
      .replace(/(\d{4})(\d)/, '$1-$2')
      .substring(0, 18);
  }
};

// Validate CPF/CNPJ
export const validateCpfCnpj = (value: string): boolean => {
  const cleanValue = value.replace(/\D/g, '');

  if (cleanValue.length === 11) {
    // CPF validation
    let sum = 0;
    for (let i = 0; i < 9; i++) {
      sum += parseInt(cleanValue.charAt(i)) * (10 - i);
    }
    let remainder = 11 - (sum % 11);
    if (remainder === 10 || remainder === 11) {
      remainder = 0;
    }
    if (remainder !== parseInt(cleanValue.charAt(9))) {
      return false;
    }
    sum = 0;
    for (let i = 0; i < 10; i++) {
      sum += parseInt(cleanValue.charAt(i)) * (11 - i);
    }
    remainder = 11 - (sum % 11);
    if (remainder === 10 || remainder === 11) {
      remainder = 0;
    }
    if (remainder !== parseInt(cleanValue.charAt(10))) {
      return false;
    }
    return true;
  } else if (cleanValue.length === 14) {
    // CNPJ validation
    let size = cleanValue.length - 2;
    let numbers = cleanValue.substring(0, size);
    let digits = cleanValue.substring(size);
    let sum = 0;
    let pos = size - 7;
    for (let i = size; i >= 1; i--) {
      sum += parseInt(numbers.charAt(size - i)) * pos--;
      if (pos < 2) {
        pos = 9;
      }
    }
    let result = sum % 11 < 2 ? 0 : 11 - sum % 11;
    if (result !== parseInt(digits.charAt(0))) {
      return false;
    }
    size = size + 1;
    numbers = cleanValue.substring(0, size);
    sum = 0;
    pos = size - 7;
    for (let i = size; i >= 1; i--) {
      sum += parseInt(numbers.charAt(size - i)) * pos--;
      if (pos < 2) {
        pos = 9;
      }
    }
    result = sum % 11 < 2 ? 0 : 11 - sum % 11;
    if (result !== parseInt(digits.charAt(1))) {
      return false;
    }
    return true;
  } else {
    return false;
  }
};

// Format phone number
export const formatPhone = (value: string): string => {
  const cleanValue = value.replace(/\D/g, '');
  
  if (cleanValue.length <= 2) {
    return cleanValue;
  }
  
  if (cleanValue.length <= 6) {
    return `(${cleanValue.substring(0, 2)}) ${cleanValue.substring(2)}`;
  }
  
  if (cleanValue.length <= 10) {
    return `(${cleanValue.substring(0, 2)}) ${cleanValue.substring(2, 6)}-${cleanValue.substring(6)}`;
  }
  
  return `(${cleanValue.substring(0, 2)}) ${cleanValue.substring(2, 7)}-${cleanValue.substring(7, 11)}`;
};

// Format time (minutes and seconds)
export const formatTime = (minutes: number, seconds: number): string => {
  const formattedMinutes = String(minutes).padStart(2, '0');
  const formattedSeconds = String(seconds).padStart(2, '0');
  return `${formattedMinutes}:${formattedSeconds}`;
};
