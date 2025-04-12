
export const formatCurrency = (value: number): string => {
  return value.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  });
};

export const formatCpfCnpj = (value: string): string => {
  const cleanValue = value.replace(/\D/g, '');

  if (cleanValue.length === 11) {
    return cleanValue.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
  } else if (cleanValue.length === 14) {
    return cleanValue.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5');
  }

  return value;
};

export const validateCpfCnpj = (value: string): boolean => {
  const cleanValue = value.replace(/\D/g, '');

  if (cleanValue.length === 11) {
    // CPF validation
    let sum = 0;
    let remainder;

    if (
      cleanValue == "00000000000" ||
      cleanValue == "11111111111" ||
      cleanValue == "22222222222" ||
      cleanValue == "33333333333" ||
      cleanValue == "44444444444" ||
      cleanValue == "55555555555" ||
      cleanValue == "66666666666" ||
      cleanValue == "77777777777" ||
      cleanValue == "88888888888" ||
      cleanValue == "99999999999"
    ) {
      return false;
    }

    for (let i = 1; i <= 9; i++) {
      sum = sum + parseInt(cleanValue.substring(i - 1, i)) * (11 - i);
    }

    remainder = (sum * 10) % 11;

    if ((remainder == 10) || (remainder == 11)) {
      remainder = 0;
    }

    if (remainder != parseInt(cleanValue.substring(9, 10))) {
      return false;
    }

    sum = 0;
    for (let i = 1; i <= 10; i++) {
      sum = sum + parseInt(cleanValue.substring(i - 1, i)) * (12 - i);
    }

    remainder = (sum * 10) % 11;

    if ((remainder == 10) || (remainder == 11)) {
      remainder = 0;
    }

    if (remainder != parseInt(cleanValue.substring(10, 11))) {
      return false;
    }

    return true;
  } else if (cleanValue.length === 14) {
    // CNPJ validation
    let size = cleanValue.length - 2
    let numbers = cleanValue.substring(0, size);
    let digits = cleanValue.substring(size);
    let sum = 0;
    let pos = size - 7;

    for (let i = size; i >= 1; i--) {
      sum += parseInt(numbers.charAt(size - i)) * pos--;
      if (pos < 2)
        pos = 9;
    }

    let result = sum % 11 < 2 ? 0 : 11 - sum % 11;

    if (result != parseInt(digits.charAt(0))) {
      return false;
    }

    size = size + 1;
    numbers = cleanValue.substring(0, size);
    sum = 0;
    pos = size - 7;

    for (let i = size; i >= 1; i--) {
      sum += parseInt(numbers.charAt(size - i)) * pos--;
      if (pos < 2)
        pos = 9;
    }

    result = sum % 11 < 2 ? 0 : 11 - sum % 11;

    if (result != parseInt(digits.charAt(1))) {
      return false;
    }

    return true;
  } else {
    return false;
  }
};

export const formatPhone = (value: string): string => {
  const cleanValue = value.replace(/\D/g, '');

  if (cleanValue.length === 10) {
    return cleanValue.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3');
  } else if (cleanValue.length === 11) {
    return cleanValue.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
  }

  return value;
};

/**
 * Format minutes and seconds as MM:SS
 */
export const formatTime = (minutes: number, seconds: number): string => {
  return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
};
