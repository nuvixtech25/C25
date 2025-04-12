
import React from 'react';
import { CreditCard } from 'lucide-react';

export const detectCardBrand = (cardNumber: string): { brand: string; icon: React.ReactNode } => {
  const cleanNumber = cardNumber.replace(/\D/g, '');
  
  if (/^4/.test(cleanNumber)) {
    return { 
      brand: 'visa', 
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="40" height="24" viewBox="0 0 640 480" className="h-6 w-8">
          <path fill="#fff" d="M0 0h640v480H0z"/>
          <path fill="#1435A9" d="M0 240h640v240H0z"/>
          <path fill="#D90025" d="M0 0h640v240H0z"/>
          <g fill="#fff" transform="scale(3.2) translate(100, 50)">
            <path d="m-16.9 17.9h33.8v-35.8h-33.8zm16.9-33.8c4.7 0 8.5 3.7 8.5 8.5s-3.7 8.5-8.5 8.5-8.5-3.7-8.5-8.5 3.8-8.5 8.5-8.5z"/>
            <circle cy="0" cx="0" r="8.5" fillOpacity="0" stroke="#fff"/>
            <path d="m-5.7 5.5c-.5-.2-.9-.5-.9-1 0-.5.4-.9 1.2-.9.6 0 1 .2 1.4.4l.3-1.7c-.5-.3-1.2-.5-2-.5-1.9 0-3.3 1.1-3.3 2.6 0 1.2 1.1 1.8 1.9 2.2.9.4 1.2.7 1.2 1.1 0 .6-.6.9-1.5.9-.7 0-1.4-.3-1.9-.6l-.3 1.8c.6.4 1.5.6 2.3.6 2.1 0 3.5-1 3.5-2.7 0-1.3-1-1.8-1.9-2.2z"/>
            <path d="m-0.5 12.7v-2.6h2.5v-1.9h-2.5v-2.3h3.3l.5-2.1h-6.1v8.9z"/>
          </g>
        </svg>
      )
    };
  }
  
  if (/^(5[1-5]|222[1-9]|22[3-9]|2[3-6]|27[0-1]|2720)/.test(cleanNumber)) {
    return { 
      brand: 'mastercard', 
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="40" height="24" viewBox="0 0 640 480" className="h-6 w-8">
          <path fill="#fff" d="M0 0h640v480H0z"/>
          <path fill="#FF5F00" d="M266 180c0 75.2-60.8 136-136 136s-136-60.8-136-136 60.8-136 136-136 136 60.8 136 136"/>
          <path fill="#EB001B" d="M374 44c-55.4 0-106 26.4-136 68 23.6 29.6 38 67.2 38 108s-14.4 78.4-38 108c30 41.6 80.6 68 136 68 106.4 0 192-85.6 192-192S480.4 44 374 44z"/>
          <path fill="#F79E1B" d="M374 44c55.4 0 106 26.4 136 68-23.6 29.6-38 67.2-38 108s14.4 78.4 38 108c-30 41.6-80.6 68-136 68-106.4 0-192-85.6-192-192S267.6 44 374 44z"/>
        </svg>
      )
    };
  }
  
  if (/^3[47]/.test(cleanNumber)) {
    return { 
      brand: 'amex', 
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="40" height="24" viewBox="0 0 640 480" className="h-6 w-8">
          <path fill="#2B96D8" d="M0 0h640v480H0z"/>
          <path d="M101.5 201h71.3l8.2-20.4h18.4l-8.2 20.4h18.4l-8.2 20.4h-18.4l-8.2 20.4h-71.3l8.2-20.4H53.3l8.2-20.4h18.4zm63.1 0 8.2-20.4h-45.7l-8.2 20.4h45.7z" fill="#fff"/>
          <path d="M380.7 180.6c-15.8 0-25 10.4-25 27.5v31.4h54.5v-31.4c0-17.1-9.2-27.5-25-27.5h-4.5z" fill="#fff"/>
          <path d="M359.2 238.5v-30.4c0-14.3 7.9-24.2 21.5-24.2 13.6 0 21.5 9.9 21.5 24.2v30.4h-43z" fill="#2B96D8"/>
          <path d="M359.2 238.5v-30.4c0-14.3 7.9-24.2 21.5-24.2 13.6 0 21.5 9.9 21.5 24.2v30.4h-43z" fill="none" stroke="#2B96D8" strokeWidth="3"/>
          <path d="M496.7 180.6h-43l-15.8 38.3-15.8-38.3h-43v67.9h36.5v-46.3l22.1 46.3h14.2l22.1-46.3v46.3h36.5v-67.9z" fill="#fff"/>
        </svg>
      )
    };
  }
  
  if (/^(6011|64[4-9]|65)/.test(cleanNumber)) {
    return { 
      brand: 'discover', 
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="40" height="24" viewBox="0 0 640 480" className="h-6 w-8">
          <path fill="#F38020" d="M0 0h640v480H0z"/>
          <path d="M62.6 149.5c0 49.2 40 89.3 89.3 89.3h336.3v-89.3a89.3 89.3 0 0 0-89.3-89.3H62.6v89.3z" fill="#fff"/>
          <path d="M488.2 60.2a89.3 89.3 0 0 0-89.3 89.3v89.3h89.3a89.3 89.3 0 0 0 89.3-89.3 89.3 89.3 0 0 0-89.3-89.3z" fill="#2294CC"/>
          <path d="M488.2 149.5a89.3 89.3 0 0 1-89.3 89.3h-336.3v-89.3a89.3 89.3 0 0 1 89.3-89.3h336.3v89.3z" fill="#fff"/>
        </svg>
      )
    };
  }
  
  if (/^(30[0-5]|36|38|39)/.test(cleanNumber)) {
    return { 
      brand: 'diners', 
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="40" height="24" viewBox="0 0 640 480" className="h-6 w-8">
          <path fill="#0079BE" d="M0 0h640v480H0z"/>
          <path d="M270 240c0-68.2-47.6-124.6-112.8-146.4a189.2 189.2 0 0 0-44.2-5.6c-105.4 0-190.4 85-190.4 190.4s85 190.4 190.4 190.4c15.2 0 30-1.8 44.2-5.6C222.4 364.6 270 308.2 270 240z" fill="#fff"/>
          <path d="M270 240c0-68.2 47.6-124.6 112.8-146.4a189.2 189.2 0 0 1 44.2-5.6c105.4 0 190.4 85 190.4 190.4s-85 190.4-190.4 190.4c-15.2 0-30-1.8-44.2-5.6C317.6 364.6 270 308.2 270 240z" fill="#fff"/>
        </svg>
      )
    };
  }
  
  if (/^(636368|438935|504175|451416|5090(4[0-9]|5[0-9]|6[0-9]|7[0-4]))/.test(cleanNumber)) {
    return { 
      brand: 'elo', 
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="40" height="24" viewBox="0 0 640 480" className="h-6 w-8">
          <path fill="#00A4E0" d="M0 0h640v480H0z"/>
          <path d="M320 120a120 120 0 1 0 0 240 120 120 0 0 0 0-240z" fill="#FFC200"/>
          <path d="M320 240a120 120 0 0 1 120-120 120 120 0 1 1 0 240 120 120 0 0 1-120-120z" fill="#F7B600"/>
        </svg>
      )
    };
  }
  
  if (/^(606282)/.test(cleanNumber)) {
    return { 
      brand: 'hipercard', 
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="40" height="24" viewBox="0 0 640 480" className="h-6 w-8">
          <path fill="#922126" d="M0 0h640v480H0z"/>
          <path d="M320 120a120 120 0 1 0 0 240 120 120 0 0 0 0-240z" fill="#fff"/>
          <path d="M320 240a120 120 0 0 1 120-120 120 120 0 1 1 0 240 120 120 0 0 1-120-120z" fill="#922126"/>
        </svg>
      )
    };
  }
  
  return { 
    brand: 'unknown', 
    icon: <CreditCard className="h-5 w-5 text-gray-400" /> 
  };
};

export const requiresFourDigitCvv = (cardNumber: string): boolean => {
  const { brand } = detectCardBrand(cardNumber);
  return brand === 'amex';
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

export default { detectCardBrand, CardBrandDisplay, requiresFourDigitCvv };

