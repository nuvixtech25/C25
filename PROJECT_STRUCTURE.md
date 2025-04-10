
# Estrutura de Diretórios do Projeto Checkout Seguro

## 📁 src/
Root directory containing all source code for the application.

### 📁 components/
Reusable UI components used throughout the application.

#### 📁 checkout/
Components specifically for the checkout process.

- **CheckoutContainer.tsx** - Wrapper component providing layout for checkout pages
- **CheckoutContent.tsx** - Main content area for checkout process
- **CheckoutError.tsx** - Error display component for checkout errors
- **CheckoutFooter.tsx** - Footer component for checkout pages
- **CheckoutFormContainer.tsx** - Container for checkout forms
- **CheckoutHeader.tsx** - Header component for checkout pages
- **OrderSummary.tsx** - Shows order summary with product details
- **PersonalInfoSection.tsx** - Section for customer personal information
- **TestimonialSection.tsx** - Displays customer testimonials

##### 📁 payment-methods/
Components for different payment methods.

- **CardForm.tsx** - Credit card payment form
- **SimplifiedPixOption.tsx** - Simplified PIX payment option component
- **PixPayment.tsx** - Main PIX payment component that orchestrates the subcomponents

###### 📁 qr-code/
Components for PIX QR code display and management.

- **PixCopyPasteField.tsx** - Component for copying PIX code
- **PixExpirationTimer.tsx** - Timer showing PIX payment expiration
- **PixPaymentContainer.tsx** - Main container for PIX payment UI
- **PixPaymentDetails.tsx** - Displays payment details
- **PixPaymentStatus.tsx** - Shows current status of PIX payment
- **PixQRCodeDisplay.tsx** - Displays QR code for PIX payment
- **PixStatusChecker.tsx** - Component for checking payment status
- **usePaymentPolling.ts** - Hook for polling payment status

#### 📁 ui/
Shadcn UI components and other UI elements.

- **button.tsx** - Button component
- **card.tsx** - Card component 
- **loading-spinner.tsx** - Loading spinner component
- **toast.tsx** - Toast notification component
- **... (other UI components)** - Various UI components from shadcn

### 📁 contexts/
React context providers for global state management.

- **AuthContext.tsx** - Authentication context provider

#### 📁 auth/
Authentication related contexts and hooks.

- **RequireAuth.tsx** - Component for protected routes
- **authActions.ts** - Auth-related action creators
- **authTypes.ts** - TypeScript types for auth
- **useAuthProvider.ts** - Hook for auth provider functionality

### 📁 hooks/
Custom React hooks for shared functionality.

- **use-toast.ts** - Hook for toast notifications
- **useCheckoutCustomization.ts** - Hook for checkout page customization
- **useCheckoutOrder.ts** - Hook for order management in checkout
- **useCheckoutState.ts** - Hook for managing checkout state
- **usePixPaymentStatus.ts** - Hook for PIX payment status polling
- **usePaymentPolling.ts** - Hook for general payment status polling

#### 📁 admin/
Admin-specific hooks.

- **useWebhookSimulator.ts** - Hook for webhook simulation in admin

### 📁 integrations/
Integration with external services.

#### 📁 supabase/
Supabase integration for database and authentication.

- **client.ts** - Supabase client initialization
- **types.ts** - TypeScript types for Supabase tables

### 📁 layouts/
Layout components that wrap pages.

- **AdminLayout.tsx** - Layout for admin pages

### 📁 lib/
Utility library functions.

- **utils.ts** - General utility functions

### 📁 mocks/
Mock implementations for local development.

- **apiRoutes.ts** - Defines mock API routes for local dev
- **handlers.ts** - Mock API handlers
- **mockPlugin.ts** - Vite plugin for mock APIs
- **setupMocks.ts** - Setup for mock environment

### 📁 pages/
Application pages/routes.

- **Checkout.tsx** - Main checkout page
- **FailedPage.tsx** - Failed payment page
- **Index.tsx** - Homepage
- **NotFound.tsx** - 404 page
- **PaymentPage.tsx** - Payment processing page
- **SuccessPage.tsx** - Successful payment page

#### 📁 admin/
Admin section pages.

- **AdminTools.tsx** - Admin tools page
- **AsaasSettings.tsx** - Asaas integration settings
- **Login.tsx** - Admin login page
- **PixSettings.tsx** - PIX settings page
- **WebhookSimulator.tsx** - Page for simulating webhooks

##### 📁 products/
Product management pages.

- **ProductActions.tsx** - Actions for product management
- **ProductForm.tsx** - Form for adding/editing products
- **ProductItem.tsx** - Individual product component
- **ProductList.tsx** - List of products
- **ProductSchema.ts** - Validation schema for products
- **edit.tsx** - Product edit page
- **index.tsx** - Products listing page
- **new.tsx** - New product page

#### 📁 api/
API route handlers for local development.

- **check-payment-status.ts** - Mock API for checking payment status
- **mock-asaas-payment.ts** - Mock API for Asaas payment
- **webhook-simulator.ts** - API for simulating webhooks

### 📁 services/
Services for external API communication.

- **asaasConfigService.ts** - Service for Asaas configuration
- **asaasService.ts** - Handles Asaas integration with toggle between mock and Netlify functions
- **pixConfigService.ts** - Service for PIX configuration
- **productAdminService.ts** - Service for product administration
- **productService.ts** - Service for product data

### 📁 types/
TypeScript type definitions.

- **checkout.ts** - Types for checkout process

### 📁 utils/
Utility functions.

- **errorHandling.ts** - Error handling utilities
- **formatters.ts** - Data formatting utilities

## 📁 netlify/
Netlify specific configuration and functions.

### 📁 functions/
Serverless functions for Netlify deployment.

- **asaas-webhook.ts** - Webhook handler for Asaas events
- **check-payment-status.ts** - Serverless function to check payment status
- **create-asaas-customer.ts** - Function to create customer and payment in Asaas

## 📁 public/
Public assets accessible directly.

- **placeholder.svg** - Placeholder image
- **favicon.ico** - Site favicon
- **robots.txt** - Search engine configuration

## 📁 supabase/
Supabase configuration and database setup.

- **config.toml** - Supabase configuration file

## 🔑 Key Architecture Notes

1. **Payment Flow Architecture**:
   - Supports two modes controlled by `use_netlify_functions` flag
     - Local/Dev Mode: Uses mock APIs
     - Production Mode: Uses Netlify serverless functions
   - `asaasService.ts` routes requests based on current mode

2. **How `asaasService.ts` Alternates Between Modes**:
   - Checks the `use_netlify_functions` flag in the `asaas_config` table
   - If `true`, uses Netlify function endpoints (`/.netlify/functions/...`)
   - If `false`, uses local mock endpoints (`/api/...`)
   - Provides consistent data format regardless of mode, ensuring smooth toggles between environments
   - Encapsulates mode-specific logic to keep components agnostic of the actual implementation

3. **Database Structure**:
   - Supabase tables include:
     - `orders`: Stores order information and status
     - `asaas_payments`: Stores PIX QR code data and payment details
     - `asaas_webhook_logs`: Logs webhook events for debugging
     - `asaas_config`: Contains configuration settings including mode toggle
     - `products`: Product catalog and details
     - `pix_config`: PIX-specific configuration settings

4. **Refactored Components**:
   - **PixPayment Components**:
     - Main component split into smaller, focused subcomponents in `qr-code/` directory
     - Each subcomponent handles a specific aspect (status, QR code, expiration timer)
     - Promotes reusability and easier maintenance
   
   - **Checkout Flow**:
     - Split into logical sections (PersonalInfo, PaymentMethod)
     - Uses container/presentation pattern for better separation of concerns
     - State management extracted to custom hooks

5. **Custom Hooks**:
   - **`usePixPaymentStatus.ts`**:
     - Manages PIX payment status tracking
     - Handles expiration time calculation
     - Manages auto-redirects based on payment outcome
     - Implements exponential backoff for API calls
   
   - **`usePaymentPolling.ts`**:
     - Generic polling mechanism for checking payment status
     - Configurable interval and retry logic
     - Manages loading states and error handling
   
   - **`useCheckoutState.ts`**:
     - Manages the entire checkout process state
     - Handles form submission and validation
     - Orchestrates transitions between checkout steps

6. **Admin Section**:
   - **Product Management**:
     - Complete CRUD operations for products
     - List, create, edit, delete functionality
     - Form validation with Zod schema
   
   - **Configuration Settings**:
     - Asaas API configuration (sandbox/production)
     - PIX payment settings
     - Toggle between mock and Netlify functions mode
   
   - **Webhook Simulator**:
     - Tool for simulating payment status updates
     - Useful for testing the payment flow without actual payments
     - Updates database directly to test status transitions

7. **Utility Files, Hooks, Types**:
   - **Utils**: Centralized error handling, formatting functions
   - **Hooks**: Shared functionality extracted for reuse
   - **Types**: Strong TypeScript typing throughout the application
   - **Layouts**: Consistent layout patterns for different sections

8. **Modular Organization and Best Practices**:
   - **Separation of Concerns**: Each component and function has a single responsibility
   - **Component Composition**: Complex UI built from smaller, reusable pieces
   - **DRY Principle**: Shared logic extracted to utilities and hooks
   - **Error Handling**: Centralized error handling with user-friendly messages
   - **Loading States**: Consistent loading indicators throughout the app
   - **Responsive Design**: Mobile-friendly UI with Tailwind CSS
   - **Type Safety**: Comprehensive TypeScript typing
   - **Environment Flexibility**: Works in both development and production

This structure demonstrates a well-organized React application with clear separation of concerns, modular components, and support for both development and production environments.

