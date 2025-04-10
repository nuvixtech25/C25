
/// <reference types="vite/client" />

// Add global ExtendedFetchEvent interface
interface ExtendedFetchEvent extends Event {
  request: Request;
  respondWith(response: Response | Promise<Response>): void;
}

// Add service worker extensions to make TypeScript happy
interface ServiceWorkerGlobalScope {
  addEventListener(
    type: 'fetch',
    listener: (event: ExtendedFetchEvent) => void
  ): void;
}
