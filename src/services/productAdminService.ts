import { supabase } from '@/integrations/supabase/client';
import { Product } from '@/types/checkout';
import { toast } from '@/hooks/use-toast';

/**
 * Fetches all products from the database
 */
export const fetchProducts = async (): Promise<Product[]> => {
  const { data, error } = await supabase
    .from('products')
    .select('id, name, price, status, type, slug, description')
    .order('created_at', { ascending: false });

  if (error) {
    console.error("Error fetching products:", error);
    throw new Error(error.message);
  }
  
  // Map database products to our Product type
  return data.map(item => ({
    id: item.id,
    name: item.name,
    description: item.description || '',
    price: Number(item.price),
    isDigital: item.type === 'digital',
    type: (item.type === 'digital' || item.type === 'physical') 
      ? item.type as 'digital' | 'physical'
      : 'physical',
    status: item.status,
    slug: item.slug
  }));
};

/**
 * Deletes a product from the database
 */
export const deleteProduct = async (productId: string): Promise<void> => {
  try {
    const { error } = await supabase
      .from('products')
      .delete()
      .eq('id', productId);

    if (error) {
      throw error;
    }
  } catch (error) {
    console.error("Error deleting product:", error);
    throw error;
  }
};

/**
 * Handle the product deletion with toast notifications
 */
export const handleDeleteProduct = async (
  product: Product, 
  onSuccess: () => void
): Promise<void> => {
  try {
    await deleteProduct(product.id);

    toast({
      title: "Produto excluído",
      description: `${product.name} foi removido com sucesso.`,
    });
    
    // Call the success callback (usually to refetch products)
    onSuccess();
  } catch (error) {
    console.error("Erro ao excluir produto:", error);
    toast({
      title: "Erro ao excluir produto",
      description: "Ocorreu um erro ao tentar excluir o produto. Tente novamente.",
      variant: "destructive",
    });
  }
};

/**
 * Make a user an admin (for initial setup)
 */
export const makeUserAdmin = async (email: string): Promise<void> => {
  try {
    // First find the user by email
    const { data: profiles, error: fetchError } = await supabase
      .from('profiles')
      .select('id')
      .eq('email', email);

    if (fetchError) {
      throw fetchError;
    }

    if (!profiles || profiles.length === 0) {
      throw new Error(`User with email ${email} not found`);
    }

    // Update the profile to make the user an admin
    const { error: updateError } = await supabase
      .from('profiles')
      .update({ is_admin: true })
      .eq('id', profiles[0].id);

    if (updateError) {
      throw updateError;
    }

    toast({
      title: "Usuário promovido",
      description: `${email} agora tem privilégios de administrador.`,
    });
  } catch (error) {
    console.error("Error making user admin:", error);
    toast({
      title: "Erro ao promover usuário",
      description: "Ocorreu um erro ao tentar dar privilégios de administrador.",
      variant: "destructive",
    });
  }
};
