
import { createClient } from '@/lib/supabase';

// Define the PixConfig type based on the database schema
export interface PixConfig {
  id?: string;
  chavepix: string;
  tipochave: string;
  beneficiario: string;
  copiaecola: string;
  mensagemopcional: string;
}

// Function to fetch PIX configuration from Supabase
export const fetchPixConfig = async (): Promise<PixConfig> => {
  const supabase = createClient();
  
  const { data, error } = await supabase
    .from('pix_config')
    .select('*')
    .single();
  
  if (error) {
    console.error('Erro ao buscar configuração PIX:', error);
    throw new Error('Falha ao buscar configuração PIX');
  }
  
  return data as PixConfig;
};

// Function to update PIX configuration in Supabase
export const updatePixConfig = async (config: PixConfig): Promise<PixConfig> => {
  const supabase = createClient();
  
  const { data, error } = await supabase
    .from('pix_config')
    .update({
      chavepix: config.chavepix,
      tipochave: config.tipochave,
      beneficiario: config.beneficiario,
      copiaecola: config.copiaecola,
      mensagemopcional: config.mensagemopcional
    })
    .eq('id', config.id)
    .select()
    .single();
  
  if (error) {
    console.error('Erro ao atualizar configuração PIX:', error);
    throw new Error('Falha ao atualizar configuração PIX');
  }
  
  return data as PixConfig;
};
