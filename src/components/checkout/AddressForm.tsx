
import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Truck } from 'lucide-react';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { SectionTitle } from './SectionTitle';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

// Schema for address validation
const addressSchema = z.object({
  cep: z.string().min(8, 'CEP inválido').max(9),
  street: z.string().min(3, 'Rua é obrigatória'),
  number: z.string().min(1, 'Número é obrigatório'),
  complement: z.string().optional(),
  neighborhood: z.string().min(2, 'Bairro é obrigatório'),
  city: z.string().min(2, 'Cidade é obrigatória'),
  state: z.string().length(2, 'Estado deve ter 2 caracteres')
});

export type AddressData = z.infer<typeof addressSchema>;

interface AddressFormProps {
  onAddressSubmit: (data: AddressData) => void;
  headingColor: string;
}

export const AddressForm: React.FC<AddressFormProps> = ({ onAddressSubmit, headingColor }) => {
  const { toast } = useToast();
  const [isSearchingCep, setIsSearchingCep] = useState(false);
  const [showShippingMessage, setShowShippingMessage] = useState(false);
  
  const form = useForm<AddressData>({
    resolver: zodResolver(addressSchema),
    defaultValues: {
      cep: '',
      street: '',
      number: '',
      complement: '',
      neighborhood: '',
      city: '',
      state: ''
    }
  });

  // Watch the CEP and house number fields to trigger shipping message
  const cep = form.watch('cep');
  const houseNumber = form.watch('number');

  // Effect to check when both CEP and house number are filled
  useEffect(() => {
    let timer: NodeJS.Timeout;
    
    if (cep && cep.length >= 8 && houseNumber && houseNumber.length > 0) {
      // Start a 2-second timer before showing the shipping message
      timer = setTimeout(() => {
        setShowShippingMessage(true);
      }, 2000);
    } else {
      setShowShippingMessage(false);
    }
    
    return () => {
      clearTimeout(timer);
    };
  }, [cep, houseNumber]);

  // Handle CEP search
  const handleCepSearch = async (cep: string) => {
    if (cep.length < 8) return;
    
    // Remove non-numeric characters
    const cleanCep = cep.replace(/\D/g, '');
    
    if (cleanCep.length !== 8) return;
    
    try {
      setIsSearchingCep(true);
      const response = await fetch(`https://viacep.com.br/ws/${cleanCep}/json/`);
      
      if (!response.ok) {
        throw new Error('CEP não encontrado');
      }
      
      const data = await response.json();
      
      if (data.erro) {
        toast({
          title: "CEP não encontrado",
          description: "Verifique o CEP informado",
          variant: "destructive",
        });
        return;
      }
      
      // Update form fields with the address data
      form.setValue('street', data.logradouro);
      form.setValue('neighborhood', data.bairro);
      form.setValue('city', data.localidade);
      form.setValue('state', data.uf);
      
      // Focus on the number field after filling the address
      setTimeout(() => {
        document.getElementById('number')?.focus();
      }, 100);
      
    } catch (error) {
      console.error('Error fetching CEP:', error);
      toast({
        title: "Erro ao buscar CEP",
        description: "Não foi possível buscar o endereço. Preencha manualmente.",
        variant: "destructive",
      });
    } finally {
      setIsSearchingCep(false);
    }
  };

  const onSubmit = (data: AddressData) => {
    console.log('Address form submitted:', data);
    onAddressSubmit(data);
  };

  return (
    <section id="address-section" className="mb-4 bg-white rounded-lg border border-[#E0E0E0] p-6">
      <SectionTitle 
        title="Endereço de Entrega" 
        showNumberBadge={false}
        icon={<Truck className="text-gray-700" size={20} />}
        headingColor={headingColor}
      />
      
      {showShippingMessage && (
        <div className="py-3 px-4 mb-4 mt-4 bg-green-50 text-green-800 rounded-md border border-green-200 flex items-center animate-fadeIn">
          <span className="font-medium">✅ Frete grátis | Entrega em até 7 dias</span>
        </div>
      )}
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="cep"
              render={({ field }) => (
                <FormItem className="col-span-2 sm:col-span-1">
                  <FormLabel>CEP</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="00000-000" 
                      {...field} 
                      onChange={(e) => {
                        field.onChange(e);
                        if (e.target.value.length >= 8) {
                          handleCepSearch(e.target.value);
                        }
                      }}
                      disabled={isSearchingCep}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="hidden sm:block sm:col-span-1"></div>
            
            <FormField
              control={form.control}
              name="street"
              render={({ field }) => (
                <FormItem className="col-span-2">
                  <FormLabel>Rua</FormLabel>
                  <FormControl>
                    <Input placeholder="Nome da rua" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="number"
              render={({ field }) => (
                <FormItem className="col-span-1">
                  <FormLabel>Número</FormLabel>
                  <FormControl>
                    <Input id="number" placeholder="Número" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="complement"
              render={({ field }) => (
                <FormItem className="col-span-1">
                  <FormLabel>Complemento</FormLabel>
                  <FormControl>
                    <Input placeholder="Complemento" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="neighborhood"
              render={({ field }) => (
                <FormItem className="col-span-2 sm:col-span-1">
                  <FormLabel>Bairro</FormLabel>
                  <FormControl>
                    <Input placeholder="Bairro" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="city"
              render={({ field }) => (
                <FormItem className="col-span-2 sm:col-span-1">
                  <FormLabel>Cidade</FormLabel>
                  <FormControl>
                    <Input placeholder="Cidade" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="state"
              render={({ field }) => (
                <FormItem className="col-span-2 sm:col-span-1">
                  <FormLabel>Estado</FormLabel>
                  <FormControl>
                    <Input placeholder="UF" maxLength={2} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          
          <Button 
            type="submit" 
            className="w-full mt-4 bg-green-600 hover:bg-green-700"
          >
            Confirmar Endereço
          </Button>
        </form>
      </Form>
    </section>
  );
};
