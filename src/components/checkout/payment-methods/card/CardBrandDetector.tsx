
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
          className="h-6 w-8" 
          viewBox="0 0 780 500" 
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path 
            fill="#1434CB" 
            d="M290 200L440 200L423 292L290 292L290 200Z"
          />
          <path 
            d="M311.2 220L322.8 220L311.5 272L299.9 272L311.2 220Z" 
            fill="#1434CB"
          />
          <path 
            d="M352.3 244.4C347.7 242.3 345 240.7 345 238.3C345 236.1 347.6 234.5 352.6 234.5C356.5 234.5 359.3 235.4 361.5 236.3L363 236.9L364.4 226.2C362 225.4 358.1 224.5 353.4 224.5C339.2 224.5 329.4 231.9 329.4 242.3C329.4 250.3 336.7 254.8 342.3 257.5C348 260.3 350 262.1 350 264.7C350 268.7 345.2 270.5 340.7 270.5C335 270.5 332 269.7 327.5 268L325.5 267.2L324 278.2C327 279.4 332.5 280.5 338.3 280.5C353.5 280.5 362.9 273.2 363 262C363 255.7 359.4 251 352.3 244.4Z" 
            fill="#1434CB"
          />
          <path 
            d="M398.3 224.9C395.1 224.9 392.7 226.8 391.5 229.8L368.5 272L384 272C384 272 387 264.3 387.8 262.5C390.3 262.5 408.3 262.5 411.5 262.5C412.1 264.8 413.8 272 413.8 272L427.8 272L414.7 224.9L398.3 224.9ZM392.7 252.5C394.5 248.1 398.7 237.7 398.7 237.7C398.6 237.9 399.9 234.3 400.7 232.1L401.7 237.3C401.7 237.3 404.3 249 405.1 252.5L392.7 252.5Z" 
            fill="#1434CB"
          />
          <path 
            d="M283.5 224.9L269 254.2L267.5 246.5C264.8 238.4 256.4 229.7 247 225.5L260.5 272L276.5 272L299.5 224.9L283.5 224.9Z" 
            fill="#1434CB"
          />
          <path 
            d="M249 225.2L226.7 225.2L226.5 226.3C243 230.2 253.5 241.7 257.5 254.8L252.5 230C251.5 225.7 249 225.3 249 225.2Z" 
            fill="#1434CB"
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
