
import { supabase } from '@/integrations/supabase/client';
import { PixelConfig } from './pixels/types';
import { 
  transformDatabaseToAppFormat, 
  transformAppToDatabaseFormat 
} from './pixels/pixelConfigTransformer';

export const fetchPixelConfig = async (): Promise<PixelConfig> => {
  try {
    const { data, error } = await supabase
      .from('pixel_config')
      .select('*')
      .order('id', { ascending: true })
      .limit(1)
      .maybeSingle();
    
    if (error) throw error;
    
    return transformDatabaseToAppFormat(data);
  } catch (error) {
    console.error('Error fetching pixel config:', error);
    return transformDatabaseToAppFormat(null);
  }
};

export const updatePixelConfig = async (config: PixelConfig): Promise<PixelConfig> => {
  try {
    const dbData = transformAppToDatabaseFormat(config);
    console.log('Saving pixel config to database:', dbData);
    
    let response;
    if (!config.id) {
      const { data, error } = await supabase
        .from('pixel_config')
        .insert([dbData])
        .select()
        .single();
      
      if (error) throw error;
      response = data;
    } else {
      const { data, error } = await supabase
        .from('pixel_config')
        .update(dbData)
        .eq('id', config.id)
        .select()
        .single();
      
      if (error) throw error;
      response = data;
    }
    
    return transformDatabaseToAppFormat(response);
  } catch (error) {
    console.error('Error updating pixel config:', error);
    throw error;
  }
};

// Re-export types for convenience
export type { PixelConfig } from './pixels/types';
