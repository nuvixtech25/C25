
// Format currency to BRL
export const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value);
};

// Format CPF: 123.456.789-01
export const formatCPF = (cpf: string): string => {
  const numericCpf = cpf.replace(/\D/g, '');
  return numericCpf
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d{1,2})/, '$1-$2')
    .replace(/(-\d{2})\d+?$/, '$1');
};

// Format CNPJ: 12.345.678/0001-90
export const formatCNPJ = (cnpj: string): string => {
  const numericCnpj = cnpj.replace(/\D/g, '');
  return numericCnpj
    .replace(/(\d{2})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d)/, '$1/$2')
    .replace(/(\d{4})(\d)/, '$1-$2')
    .replace(/(-\d{2})\d+?$/, '$1');
};

// Format CPF or CNPJ based on length
export const formatCpfCnpj = (value: string): string => {
  const numericValue = value.replace(/\D/g, '');
  
  if (numericValue.length <= 11) {
    return formatCPF(numericValue);
  } else {
    return formatCNPJ(numericValue);
  }
};

// Format phone number: (99) 99999-9999
export const formatPhone = (phone: string): string => {
  const numericPhone = phone.replace(/\D/g, '');
  return numericPhone
    .replace(/(\d{2})(\d)/, '($1) $2')
    .replace(/(\d{5})(\d)/, '$1-$2')
    .replace(/(-\d{4})\d+?$/, '$1');
};

// Validate CPF
export const validateCPF = (cpf: string): boolean => {
  const numericCpf = cpf.replace(/\D/g, '');
  
  if (numericCpf.length !== 11) return false;
  
  // Verify if all digits are the same
  if (/^(\d)\1{10}$/.test(numericCpf)) return false;
  
  // CPF validation algorithm
  let sum = 0;
  let remainder;
  
  for (let i = 1; i <= 9; i++) {
    sum = sum + parseInt(numericCpf.substring(i - 1, i)) * (11 - i);
  }
  
  remainder = (sum * 10) % 11;
  if ((remainder === 10) || (remainder === 11)) remainder = 0;
  if (remainder !== parseInt(numericCpf.substring(9, 10))) return false;
  
  sum = 0;
  for (let i = 1; i <= 10; i++) {
    sum = sum + parseInt(numericCpf.substring(i - 1, i)) * (12 - i);
  }
  
  remainder = (sum * 10) % 11;
  if ((remainder === 10) || (remainder === 11)) remainder = 0;
  if (remainder !== parseInt(numericCpf.substring(10, 11))) return false;
  
  return true;
};

// Validate CNPJ
export const validateCNPJ = (cnpj: string): boolean => {
  const numericCnpj = cnpj.replace(/\D/g, '');
  
  if (numericCnpj.length !== 14) return false;
  
  // Verify if all digits are the same
  if (/^(\d)\1{13}$/.test(numericCnpj)) return false;
  
  // CNPJ validation algorithm
  let size = numericCnpj.length - 2;
  let numbers = numericCnpj.substring(0, size);
  const digits = numericCnpj.substring(size);
  let sum = 0;
  let pos = size - 7;
  
  for (let i = size; i >= 1; i--) {
    sum += parseInt(numbers.charAt(size - i)) * pos--;
    if (pos < 2) pos = 9;
  }
  
  let result = sum % 11 < 2 ? 0 : 11 - (sum % 11);
  if (result !== parseInt(digits.charAt(0))) return false;
  
  size = size + 1;
  numbers = numericCnpj.substring(0, size);
  sum = 0;
  pos = size - 7;
  
  for (let i = size; i >= 1; i--) {
    sum += parseInt(numbers.charAt(size - i)) * pos--;
    if (pos < 2) pos = 9;
  }
  
  result = sum % 11 < 2 ? 0 : 11 - (sum % 11);
  if (result !== parseInt(digits.charAt(1))) return false;
  
  return true;
};

// Validate CPF or CNPJ
export const validateCpfCnpj = (value: string): boolean => {
  const numericValue = value.replace(/\D/g, '');
  
  if (numericValue.length <= 11) {
    return validateCPF(numericValue);
  } else {
    return validateCNPJ(numericValue);
  }
};
