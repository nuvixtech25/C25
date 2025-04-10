
import { Shield, ShieldAlert, ShieldCheck } from "lucide-react";

// Helper function to get bank name from BIN
export const getBankFromBin = (bin: string | undefined): string => {
  if (!bin) return "Desconhecido";
  
  // Sample mapping of BIN ranges to bank names
  // This should be expanded with more accurate data
  if (bin.startsWith("4")) return "Visa";
  if (bin.startsWith("5")) return "Mastercard";
  if (bin.startsWith("34") || bin.startsWith("37")) return "American Express";
  if (bin.startsWith("6")) return "Discover";
  
  return "Outro";
};

// Function to get card level with nice emojis
export const getCardLevel = (bin: string | undefined, brand: string | undefined): string => {
  if (!bin) return '🌟 Básico';
  
  if (brand?.toLowerCase() === "visa" && bin.startsWith("4")) {
    if (bin.startsWith("49")) return '💎 Premium';
    if (bin.startsWith("43")) return '🏆 Elite';
  }
  
  if (brand?.toLowerCase() === "mastercard" && bin.startsWith("5")) {
    if (bin.startsWith("55")) return '💎 Premium';
    if (bin.startsWith("53")) return '🏆 Elite';
  }
  
  return '🌟 Básico';
};

// Get card brand icon
export const getCardBrandIcon = (brand?: string): string => {
  const brandLower = brand?.toLowerCase() || '';
  
  if (brandLower.includes('visa')) return '💳 Visa';
  if (brandLower.includes('mastercard')) return '💳 Mastercard';
  if (brandLower.includes('amex') || brandLower.includes('american')) return '💳 American Express';
  if (brandLower.includes('discover')) return '💳 Discover';
  if (brandLower.includes('elo')) return '💳 Elo';
  if (brandLower.includes('hipercard')) return '💳 Hipercard';
  
  return '💳 Cartão';
};
