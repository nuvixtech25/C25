
import React from 'react';
import { CreditCard } from 'lucide-react';

// Function to detect and return card brand based on number
export const detectCardBrand = (cardNumber: string): { brand: string; icon: React.ReactNode } => {
  // Remove spaces and non-numeric characters
  const cleanNumber = cardNumber.replace(/\D/g, '');
  
  // Visa: starts with 4
  if (/^4/.test(cleanNumber)) {
    return { 
      brand: 'visa', 
      icon: <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M21.5 5H2.5C1.4 5 0.5 5.9 0.5 7V17C0.5 18.1 1.4 19 2.5 19H21.5C22.6 19 23.5 18.1 23.5 17V7C23.5 5.9 22.6 5 21.5 5Z" stroke="#1A56DB" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M7 15L10 9" stroke="#1A56DB" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M10 15L13 9" stroke="#1A56DB" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M16 15L19 9" stroke="#1A56DB" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    };
  }
  
  // Mastercard: starts with 51-55 or between 2221 and 2720
  if (/^(5[1-5]|222[1-9]|22[3-9]|2[3-6]|27[0-1]|2720)/.test(cleanNumber)) {
    return { 
      brand: 'mastercard', 
      icon: <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="8" cy="12" r="5" fill="#EB001B" />
        <circle cx="16" cy="12" r="5" fill="#F79E1B" />
        <path fillRule="evenodd" clipRule="evenodd" d="M12 15.98C13.3889 14.8432 14.25 13.0294 14.25 11C14.25 8.97059 13.3889 7.15681 12 6.02C10.6111 7.15681 9.75 8.97059 9.75 11C9.75 13.0294 10.6111 14.8432 12 15.98Z" fill="#FF5F00" />
      </svg>
    };
  }
  
  // American Express: starts with 34 or 37
  if (/^3[47]/.test(cleanNumber)) {
    return { 
      brand: 'amex', 
      icon: <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="1" y="5" width="22" height="14" rx="2" fill="#1F72CD" />
        <path d="M12 12.5L14 9H17L13 15H10L6 9H9L11 12.5H12Z" fill="white" />
        <path d="M19 11H16V10H19V9H16V8H19V7H15V12H19V11Z" fill="white" />
      </svg>
    };
  }
  
  // Discover: starts with 6011, 644-649 or 65
  if (/^(6011|64[4-9]|65)/.test(cleanNumber)) {
    return { 
      brand: 'discover', 
      icon: <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="1" y="5" width="22" height="14" rx="2" fill="#FF6600" />
        <path d="M13 15C16.866 15 20 12.3137 20 9C20 5.68629 16.866 3 13 3C9.13401 3 6 5.68629 6 9C6 12.3137 9.13401 15 13 15Z" fill="#EEEEEE" />
        <path d="M10 10.5C10 9.11929 11.1193 8 12.5 8H15C16.1046 8 17 8.89543 17 10V12C17 13.1046 16.1046 14 15 14H12.5C11.1193 14 10 12.8807 10 11.5V10.5Z" fill="#FF6600" />
      </svg>
    };
  }
  
  // Diners Club: starts with 300-305, 36, 38-39
  if (/^(30[0-5]|36|38|39)/.test(cleanNumber)) {
    return { 
      brand: 'diners', 
      icon: <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="1" y="5" width="22" height="14" rx="2" fill="#0079BE" />
        <circle cx="12" cy="12" r="5" fill="#FFFFFF" />
      </svg>
    };
  }
  
  // Elo: starts with various patterns
  if (/^(636368|438935|504175|451416|5090(4[0-9]|5[0-9]|6[0-9]|7[0-4]))/.test(cleanNumber)) {
    return { 
      brand: 'elo', 
      icon: <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="1" y="5" width="22" height="14" rx="2" fill="#00A4E0" />
        <path d="M11 10L13 12L11 14" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M8 8L6 12L8 16" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M16 8L18 12L16 16" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    };
  }
  
  // Hipercard: starts with 606282
  if (/^(606282)/.test(cleanNumber)) {
    return { 
      brand: 'hipercard', 
      icon: <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="1" y="5" width="22" height="14" rx="2" fill="#822124" />
        <path d="M6 12H18" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M12 8V16" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    };
  }
  
  // If no brand is found
  return { 
    brand: 'unknown', 
    icon: <CreditCard className="h-5 w-5 text-gray-400" /> 
  };
};

interface CardBrandDisplayProps {
  cardNumber: string;
}

export const CardBrandDisplay: React.FC<CardBrandDisplayProps> = ({ cardNumber }) => {
  const { icon } = detectCardBrand(cardNumber);
  
  return (
    <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
      {icon}
    </div>
  );
};
