
import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Truck } from 'lucide-react';
import { Form } from '@/components/ui/form';
import { SectionTitle } from '../SectionTitle';
import { Button } from '@/components/ui/button';
import { AddressFormFields } from './AddressFormFields';
import { CepSearch } from './CepSearch';
import { ShippingMessage } from './ShippingMessage';
import { useCepSearch } from './useCepSearch';
import { useShippingMessage } from './useShippingMessage';

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

  // Get the CEP search functionality
  const { isSearchingCep, handleCepSearch } = useCepSearch(form);
  
  // Get the shipping message visibility
  const cep = form.watch('cep');
  const houseNumber = form.watch('number');
  const showShippingMessage = useShippingMessage(cep, houseNumber);

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
      
      <ShippingMessage show={showShippingMessage} />
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <CepSearch 
              form={form} 
              isSearching={isSearchingCep} 
              onSearch={handleCepSearch} 
            />
            
            <div className="hidden sm:block sm:col-span-1"></div>
            
            <AddressFormFields form={form} />
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

export default AddressForm;
