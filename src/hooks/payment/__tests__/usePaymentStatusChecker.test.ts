
import { describe, it, expect, vi } from 'vitest';
import { renderHook } from '@testing-library/react';
import { usePaymentStatusChecker } from '../usePaymentStatusChecker';
import { Order, PaymentStatus } from '@/types/checkout';
import * as asaasService from '@/services/asaasService';

// Mock the asaasService
vi.mock('@/services/asaasService', () => ({
  checkPaymentStatus: vi.fn()
}));

describe('usePaymentStatusChecker', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('hasTerminalStatus', () => {
    it('should identify failure terminal statuses', () => {
      const { result } = renderHook(() => usePaymentStatusChecker());
      
      const failureStatuses: PaymentStatus[] = ['DECLINED', 'FAILED', 'CANCELLED'];
      
      failureStatuses.forEach(status => {
        const mockOrder: Order = {
          id: 'order-123',
          customerId: 'customer-123',
          customerName: 'John Doe',
          customerEmail: 'john@example.com',
          customerCpfCnpj: '123.456.789-00',
          customerPhone: '(11) 98765-4321',
          productId: 'product-123',
          productName: 'Test Product',
          productPrice: 99.9,
          status: status,
          paymentMethod: 'creditCard',
          createdAt: '2023-01-01T00:00:00Z',
          updatedAt: '2023-01-01T00:00:00Z'
        };
        
        const { hasTerminalStatus, isSuccess } = result.current.hasTerminalStatus(mockOrder);
        
        expect(hasTerminalStatus).toBe(true);
        expect(isSuccess).toBe(false);
      });
    });

    it('should identify success terminal statuses', () => {
      const { result } = renderHook(() => usePaymentStatusChecker());
      
      const successStatuses: PaymentStatus[] = ['CONFIRMED'];
      
      successStatuses.forEach(status => {
        const mockOrder: Order = {
          id: 'order-123',
          customerId: 'customer-123',
          customerName: 'John Doe',
          customerEmail: 'john@example.com',
          customerCpfCnpj: '123.456.789-00',
          customerPhone: '(11) 98765-4321',
          productId: 'product-123',
          productName: 'Test Product',
          productPrice: 99.9,
          status: status,
          paymentMethod: 'creditCard',
          createdAt: '2023-01-01T00:00:00Z',
          updatedAt: '2023-01-01T00:00:00Z'
        };
        
        const { hasTerminalStatus, isSuccess } = result.current.hasTerminalStatus(mockOrder);
        
        expect(hasTerminalStatus).toBe(true);
        expect(isSuccess).toBe(true);
      });
    });

    it('should identify non-terminal statuses', () => {
      const { result } = renderHook(() => usePaymentStatusChecker());
      
      const nonTerminalStatuses: PaymentStatus[] = ['PENDING', 'OVERDUE'];
      
      nonTerminalStatuses.forEach(status => {
        const mockOrder: Order = {
          id: 'order-123',
          customerId: 'customer-123',
          customerName: 'John Doe',
          customerEmail: 'john@example.com',
          customerCpfCnpj: '123.456.789-00',
          customerPhone: '(11) 98765-4321',
          productId: 'product-123',
          productName: 'Test Product',
          productPrice: 99.9,
          status: status,
          paymentMethod: 'creditCard',
          createdAt: '2023-01-01T00:00:00Z',
          updatedAt: '2023-01-01T00:00:00Z'
        };
        
        const { hasTerminalStatus, isSuccess } = result.current.hasTerminalStatus(mockOrder);
        
        expect(hasTerminalStatus).toBe(false);
        expect(isSuccess).toBe(false);
      });
    });
  });

  describe('checkOrderStatusInDatabase', () => {
    it('should handle case when order ID is undefined', async () => {
      const { result } = renderHook(() => usePaymentStatusChecker());
      
      const mockOrder: Order = {
        customerId: 'customer-123',
        customerName: 'John Doe',
        customerEmail: 'john@example.com',
        customerCpfCnpj: '123.456.789-00',
        customerPhone: '(11) 98765-4321',
        productId: 'product-123',
        productName: 'Test Product',
        productPrice: 99.9,
        status: 'PENDING',
        paymentMethod: 'creditCard',
        createdAt: '2023-01-01T00:00:00Z',
        updatedAt: '2023-01-01T00:00:00Z'
      };
      
      const mockFetchOrderById = vi.fn();
      
      const response = await result.current.checkOrderStatusInDatabase(mockOrder, mockFetchOrderById);
      
      expect(mockFetchOrderById).not.toHaveBeenCalled();
      expect(response).toEqual({ statusChanged: false });
    });

    it('should return statusChanged: false when order not found', async () => {
      const { result } = renderHook(() => usePaymentStatusChecker());
      
      const mockOrder: Order = {
        id: 'order-123',
        customerId: 'customer-123',
        customerName: 'John Doe',
        customerEmail: 'john@example.com',
        customerCpfCnpj: '123.456.789-00',
        customerPhone: '(11) 98765-4321',
        productId: 'product-123',
        productName: 'Test Product',
        productPrice: 99.9,
        status: 'PENDING',
        paymentMethod: 'creditCard',
        createdAt: '2023-01-01T00:00:00Z',
        updatedAt: '2023-01-01T00:00:00Z'
      };
      
      const mockFetchOrderById = vi.fn().mockResolvedValue(null);
      
      const response = await result.current.checkOrderStatusInDatabase(mockOrder, mockFetchOrderById);
      
      expect(mockFetchOrderById).toHaveBeenCalledWith('order-123');
      expect(response).toEqual({ statusChanged: false });
    });

    it('should detect failure status change in database', async () => {
      const { result } = renderHook(() => usePaymentStatusChecker());
      
      const mockOrder: Order = {
        id: 'order-123',
        customerId: 'customer-123',
        customerName: 'John Doe',
        customerEmail: 'john@example.com',
        customerCpfCnpj: '123.456.789-00',
        customerPhone: '(11) 98765-4321',
        productId: 'product-123',
        productName: 'Test Product',
        productPrice: 99.9,
        status: 'PENDING',
        paymentMethod: 'creditCard',
        createdAt: '2023-01-01T00:00:00Z',
        updatedAt: '2023-01-01T00:00:00Z'
      };
      
      const updatedOrder: Order = {
        ...mockOrder,
        status: 'FAILED'
      };
      
      const mockFetchOrderById = vi.fn().mockResolvedValue(updatedOrder);
      
      const response = await result.current.checkOrderStatusInDatabase(mockOrder, mockFetchOrderById);
      
      expect(mockFetchOrderById).toHaveBeenCalledWith('order-123');
      expect(response).toEqual({ 
        statusChanged: true, 
        updatedOrder, 
        isSuccess: false 
      });
    });

    it('should detect success status change in database', async () => {
      const { result } = renderHook(() => usePaymentStatusChecker());
      
      const mockOrder: Order = {
        id: 'order-123',
        customerId: 'customer-123',
        customerName: 'John Doe',
        customerEmail: 'john@example.com',
        customerCpfCnpj: '123.456.789-00',
        customerPhone: '(11) 98765-4321',
        productId: 'product-123',
        productName: 'Test Product',
        productPrice: 99.9,
        status: 'PENDING',
        paymentMethod: 'creditCard',
        createdAt: '2023-01-01T00:00:00Z',
        updatedAt: '2023-01-01T00:00:00Z'
      };
      
      const updatedOrder: Order = {
        ...mockOrder,
        status: 'CONFIRMED'
      };
      
      const mockFetchOrderById = vi.fn().mockResolvedValue(updatedOrder);
      
      const response = await result.current.checkOrderStatusInDatabase(mockOrder, mockFetchOrderById);
      
      expect(mockFetchOrderById).toHaveBeenCalledWith('order-123');
      expect(response).toEqual({ 
        statusChanged: true, 
        updatedOrder, 
        isSuccess: true 
      });
    });

    it('should handle database errors gracefully', async () => {
      const { result } = renderHook(() => usePaymentStatusChecker());
      
      const mockOrder: Order = {
        id: 'order-123',
        customerId: 'customer-123',
        customerName: 'John Doe',
        customerEmail: 'john@example.com',
        customerCpfCnpj: '123.456.789-00',
        customerPhone: '(11) 98765-4321',
        productId: 'product-123',
        productName: 'Test Product',
        productPrice: 99.9,
        status: 'PENDING',
        paymentMethod: 'creditCard',
        createdAt: '2023-01-01T00:00:00Z',
        updatedAt: '2023-01-01T00:00:00Z'
      };
      
      const mockFetchOrderById = vi.fn().mockRejectedValue(new Error('Database error'));
      
      const response = await result.current.checkOrderStatusInDatabase(mockOrder, mockFetchOrderById);
      
      expect(mockFetchOrderById).toHaveBeenCalledWith('order-123');
      expect(response).toEqual({ statusChanged: false });
    });
  });

  describe('checkPaymentStatusInAsaas', () => {
    it('should skip Asaas check for temporary payment IDs', async () => {
      const { result } = renderHook(() => usePaymentStatusChecker());
      
      const mockOrder: Order = {
        id: 'order-123',
        customerId: 'customer-123',
        customerName: 'John Doe',
        customerEmail: 'john@example.com',
        customerCpfCnpj: '123.456.789-00',
        customerPhone: '(11) 98765-4321',
        productId: 'product-123',
        productName: 'Test Product',
        productPrice: 99.9,
        status: 'PENDING',
        paymentMethod: 'creditCard',
        asaasPaymentId: 'temp_123456',
        createdAt: '2023-01-01T00:00:00Z',
        updatedAt: '2023-01-01T00:00:00Z'
      };
      
      const response = await result.current.checkPaymentStatusInAsaas(mockOrder, 1);
      
      expect(asaasService.checkPaymentStatus).not.toHaveBeenCalled();
      expect(response).toEqual({ statusChanged: false });
    });

    it('should skip Asaas check for temporary retry payment IDs', async () => {
      const { result } = renderHook(() => usePaymentStatusChecker());
      
      const mockOrder: Order = {
        id: 'order-123',
        customerId: 'customer-123',
        customerName: 'John Doe',
        customerEmail: 'john@example.com',
        customerCpfCnpj: '123.456.789-00',
        customerPhone: '(11) 98765-4321',
        productId: 'product-123',
        productName: 'Test Product',
        productPrice: 99.9,
        status: 'PENDING',
        paymentMethod: 'creditCard',
        asaasPaymentId: 'temp_retry_123456',
        createdAt: '2023-01-01T00:00:00Z',
        updatedAt: '2023-01-01T00:00:00Z'
      };
      
      const response = await result.current.checkPaymentStatusInAsaas(mockOrder, 1);
      
      expect(asaasService.checkPaymentStatus).not.toHaveBeenCalled();
      expect(response).toEqual({ statusChanged: false });
    });

    it('should check status with Asaas for valid payment IDs', async () => {
      const { result } = renderHook(() => usePaymentStatusChecker());
      
      const mockOrder: Order = {
        id: 'order-123',
        customerId: 'customer-123',
        customerName: 'John Doe',
        customerEmail: 'john@example.com',
        customerCpfCnpj: '123.456.789-00',
        customerPhone: '(11) 98765-4321',
        productId: 'product-123',
        productName: 'Test Product',
        productPrice: 99.9,
        status: 'PENDING',
        paymentMethod: 'creditCard',
        asaasPaymentId: 'pay_123456789',
        createdAt: '2023-01-01T00:00:00Z',
        updatedAt: '2023-01-01T00:00:00Z'
      };
      
      vi.mocked(asaasService.checkPaymentStatus).mockResolvedValue('PENDING');
      
      const response = await result.current.checkPaymentStatusInAsaas(mockOrder, 1);
      
      expect(asaasService.checkPaymentStatus).toHaveBeenCalledWith('pay_123456789');
      expect(response).toEqual({ statusChanged: false });
    });

    it('should detect success status change in Asaas', async () => {
      const { result } = renderHook(() => usePaymentStatusChecker());
      
      const mockOrder: Order = {
        id: 'order-123',
        customerId: 'customer-123',
        customerName: 'John Doe',
        customerEmail: 'john@example.com',
        customerCpfCnpj: '123.456.789-00',
        customerPhone: '(11) 98765-4321',
        productId: 'product-123',
        productName: 'Test Product',
        productPrice: 99.9,
        status: 'PENDING',
        paymentMethod: 'creditCard',
        asaasPaymentId: 'pay_123456789',
        createdAt: '2023-01-01T00:00:00Z',
        updatedAt: '2023-01-01T00:00:00Z'
      };
      
      vi.mocked(asaasService.checkPaymentStatus).mockResolvedValue('CONFIRMED');
      
      const response = await result.current.checkPaymentStatusInAsaas(mockOrder, 1);
      
      expect(asaasService.checkPaymentStatus).toHaveBeenCalledWith('pay_123456789');
      expect(response).toEqual({ 
        statusChanged: true, 
        status: 'CONFIRMED' 
      });
    });

    it('should detect failure status change in Asaas', async () => {
      const { result } = renderHook(() => usePaymentStatusChecker());
      
      const mockOrder: Order = {
        id: 'order-123',
        customerId: 'customer-123',
        customerName: 'John Doe',
        customerEmail: 'john@example.com',
        customerCpfCnpj: '123.456.789-00',
        customerPhone: '(11) 98765-4321',
        productId: 'product-123',
        productName: 'Test Product',
        productPrice: 99.9,
        status: 'PENDING',
        paymentMethod: 'creditCard',
        asaasPaymentId: 'pay_123456789',
        createdAt: '2023-01-01T00:00:00Z',
        updatedAt: '2023-01-01T00:00:00Z'
      };
      
      vi.mocked(asaasService.checkPaymentStatus).mockResolvedValue('FAILED');
      
      const response = await result.current.checkPaymentStatusInAsaas(mockOrder, 1);
      
      expect(asaasService.checkPaymentStatus).toHaveBeenCalledWith('pay_123456789');
      expect(response).toEqual({ 
        statusChanged: true, 
        status: 'FAILED' 
      });
    });
  });
});
