
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

export const validateCpfCnpj = (value: string): boolean => {
  const cleanValue = value.replace(/\D/g, '');

  if (cleanValue.length === 11) {
    // CPF validation (basic)
    let sum = 0;
    let remainder;

    if (cleanValue == "00000000000") return false;

    for (let i=1; i<=9; i++) sum = sum + parseInt(cleanValue.substring(i-1, i)) * (11 - i);
    remainder = (sum * 10) % 11;

    if ((remainder == 10) || (remainder == 11))  remainder = 0;
    if (remainder != parseInt(cleanValue.substring(9, 10)) ) return false;

    sum = 0;
    for (let i = 1; i <= 10; i++) sum = sum + parseInt(cleanValue.substring(i-1, i)) * (12 - i);
    remainder = (sum * 10) % 11;

    if ((remainder == 10) || (remainder == 11))  remainder = 0;
    if (remainder != parseInt(cleanValue.substring(10, 11)) ) return false;
    return true;
  } else if (cleanValue.length === 14) {
    // CNPJ validation (basic)
    let size = cleanValue.length - 2
    let numbers = cleanValue.substring(0, size);
    let digits = cleanValue.substring(size);
    let sum = 0;
    let pos = size - 7;
    for (let i = size; i >= 1; i--) {
      sum += parseInt(numbers.charAt(size - i)) * pos--;
      if (pos < 2) pos = 9;
    }
    let result = sum % 11 < 2 ? 0 : 11 - sum % 11;
    if (result != parseInt(digits.charAt(0))) return false;
    size = size + 1;
    numbers = cleanValue.substring(0, size);
    sum = 0;
    pos = size - 7;
    for (let i = size; i >= 1; i--) {
      sum += parseInt(numbers.charAt(size - i)) * pos--;
      if (pos < 2) pos = 9;
    }
    result = sum % 11 < 2 ? 0 : 11 - sum % 11;
    if (result != parseInt(digits.charAt(1))) return false;
    return true;
  } else {
    return false;
  }
};

export const formatPhone = (value: string): string => {
  const cleanValue = value.replace(/\D/g, '');
  return cleanValue
    .replace(/(\d{2})(\d)/, '($1) $2')
    .replace(/(\d{5})(\d)/, '$1-$2')
    .substring(0, 15);
};

export const formatTime = (minutes: number, seconds: number): string => {
  const formattedMinutes = minutes.toString().padStart(2, '0');
  const formattedSeconds = seconds.toString().padStart(2, '0');
  return `${formattedMinutes}:${formattedSeconds}`;
};

// Add formatCurrency function that was missing
export const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value);
};
