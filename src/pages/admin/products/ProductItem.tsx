
import React from 'react';
import { CheckCircle, XCircle } from 'lucide-react';
import { TableCell, TableRow } from '@/components/ui/table';
import { Product } from '@/types/checkout';
import { formatCurrency } from '@/utils/formatters';
import ProductActions from './ProductActions';

interface ProductItemProps {
  product: Product;
  onDeleteClick: (product: Product) => void;
}

const ProductItem = ({ product, onDeleteClick }: ProductItemProps) => {
  return (
    <TableRow key={product.id}>
      <TableCell className="font-medium">{product.name}</TableCell>
      <TableCell>{formatCurrency(product.price)}</TableCell>
      <TableCell>
        {product.type === 'digital' ? 'Digital' : 'Físico'}
      </TableCell>
      <TableCell>
        {product.status ? (
          <span className="flex items-center text-green-600">
            <CheckCircle className="mr-1 h-4 w-4" />
            Ativo
          </span>
        ) : (
          <span className="flex items-center text-red-600">
            <XCircle className="mr-1 h-4 w-4" />
            Inativo
          </span>
        )}
      </TableCell>
      <TableCell>
        <ProductActions product={product} onDeleteClick={onDeleteClick} />
      </TableCell>
    </TableRow>
  );
};

export default ProductItem;
