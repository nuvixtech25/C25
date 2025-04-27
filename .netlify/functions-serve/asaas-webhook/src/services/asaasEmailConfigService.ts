import { supabase } from "@/integrations/supabase/client";

interface EmailConfig {
  use_temp_email: boolean;
  temp_email: string | null;
}

export const asaasEmailConfigService = {
  async getEmailConfig(): Promise<EmailConfig | null> {
    try {
      const { data, error } = await supabase
        .from("asaas_email_config")
        .select("use_temp_email, temp_email")
        .single();

      if (error) {
        console.error("Error fetching email config:", error);
        return null;
      }

      return data;
    } catch (error) {
      console.error("Error in getEmailConfig:", error);
      return null;
    }
  },

  async updateEmailConfig(config: Partial<EmailConfig>): Promise<boolean> {
    try {
      const { error } = await supabase
        .from("asaas_email_config")
        .update(config)
        .eq("id", 1); // We always update the first row as it's our singleton config

      if (error) {
        console.error("Error updating email config:", error);
        return false;
      }

      return true;
    } catch (error) {
      console.error("Error in updateEmailConfig:", error);
      return false;
    }
  },
};
