import React from 'react';
import { CreditCard, Lock } from 'lucide-react';
export function PaymentForm({
  payment,
  updatePayment
}) {
  const handleChange = e => {
    updatePayment({
      [e.target.name]: e.target.value
    });
  };
  const formatCardNumber = value => {
    // Remove non-digits
    const digits = value.replace(/\D/g, '');
    // Add space every 4 digits
    let formatted = '';
    for (let i = 0; i < digits.length; i += 4) {
      formatted += digits.slice(i, i + 4) + ' ';
    }
    return formatted.trim();
  };
  const handleCardNumberChange = e => {
    const formatted = formatCardNumber(e.target.value);
    updatePayment({
      cardNumber: formatted
    });
  };
  return <div className="space-y-6">
      <h2 className="text-xl font-semibold text-black">Payment Information</h2>
      <div className="bg-gray-50 p-4 rounded-lg mb-6">
        <div className="flex items-center">
          <Lock className="h-4 w-4 text-gray-500 mr-2" />
          <p className="text-sm text-gray-600">
            Your payment information is encrypted and secure. We never store
            your full card details.
          </p>
        </div>
      </div>
      <div className="space-y-4">
        <div>
          <label htmlFor="cardNumber" className="block text-sm font-medium text-gray-700 mb-1">
            Card Number*
          </label>
          <div className="relative">
            <input type="text" id="cardNumber" name="cardNumber" required placeholder="1234 5678 9012 3456" maxLength={19} className="w-full border border-gray-300 rounded-md pl-10 pr-3 py-2 focus:outline-none focus:ring-1 focus:ring-black" value={payment.cardNumber} onChange={handleCardNumberChange} />
            <CreditCard className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          </div>
        </div>
        <div>
          <label htmlFor="cardName" className="block text-sm font-medium text-gray-700 mb-1">
            Name on Card*
          </label>
          <input type="text" id="cardName" name="cardName" required className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-black" value={payment.cardName} onChange={handleChange} />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="expiry" className="block text-sm font-medium text-gray-700 mb-1">
              Expiration Date (MM/YY)*
            </label>
            <input type="text" id="expiry" name="expiry" required placeholder="MM/YY" maxLength={5} className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-black" value={payment.expiry} onChange={handleChange} />
          </div>
          <div>
            <label htmlFor="cvv" className="block text-sm font-medium text-gray-700 mb-1">
              Security Code (CVV)*
            </label>
            <input type="text" id="cvv" name="cvv" required placeholder="123" maxLength={3} className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-black" value={payment.cvv} onChange={handleChange} />
          </div>
        </div>
      </div>
      <div className="space-y-4 mt-6">
        <h3 className="text-lg font-medium">Billing Address</h3>
        <div>
          <label htmlFor="country" className="block text-sm font-medium text-gray-700 mb-1">
            Country/Region*
          </label>
          <select id="country" name="country" required className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-black">
            <option value="US">United States</option>
            <option value="CA">Canada</option>
            <option value="UK">United Kingdom</option>
            <option value="AU">Australia</option>
          </select>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="zipCode" className="block text-sm font-medium text-gray-700 mb-1">
              ZIP/Postal Code*
            </label>
            <input type="text" id="zipCode" name="zipCode" required className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-black" />
          </div>
        </div>
      </div>
    </div>;
}