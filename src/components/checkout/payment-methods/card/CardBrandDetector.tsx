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
      icon: (
        <svg 
          className="h-6 w-6" 
          viewBox="0 0 38 24" 
          xmlns="http://www.w3.org/2000/svg" 
          width="38" 
          height="24"
          fill="none"
        >
          <rect width="38" height="24" rx="3" fill="white"/>
          <path 
            d="M14.435 18.006l3.53-16.072h4.635l-3.53 16.072h-4.635zm15.85-14.88c-.967-.386-2.476-.806-4.35-.806-4.8 0-8.173 2.62-8.194 6.368-.022 2.766 2.455 4.311 4.324 5.24 1.925.96 2.573 1.579 2.552 2.44-.021 1.313-1.54 1.915-2.959 1.915-1.979 0-3.025-.3-4.65-1.025l-.643-.314-.68 4.076c1.135.537 3.231.998 5.41.998 5.096 0 8.41-2.576 8.436-6.556.012-2.188-1.27-3.858-4.054-5.24-1.691-.84-2.73-1.404-2.73-2.264 0-.762.85-1.579 2.687-1.579 1.53-.025 2.637.328 3.504.71l.447.211.67-3.945z" 
            fill="#1A4BA0"
          />
        </svg>
      )
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
