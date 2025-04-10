
import { mockCheckPaymentStatusHandler } from '../../mocks/handlers';

export async function handler(req: Request) {
  // Delegate to our mock handler
  return mockCheckPaymentStatusHandler(req);
}
