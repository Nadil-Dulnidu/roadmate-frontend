import React from 'react';
export function CustomerForm({
  customer,
  updateCustomer
}) {
  const handleChange = e => {
    updateCustomer({
      [e.target.name]: e.target.value
    });
  };
  return <div className="space-y-6">
      <h2 className="text-xl font-semibold text-black">Customer Information</h2>
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">
              First Name*
            </label>
            <input type="text" id="firstName" name="firstName" required className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-black" value={customer.firstName} onChange={handleChange} />
          </div>
          <div>
            <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">
              Last Name*
            </label>
            <input type="text" id="lastName" name="lastName" required className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-black" value={customer.lastName} onChange={handleChange} />
          </div>
        </div>
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
            Email Address*
          </label>
          <input type="email" id="email" name="email" required className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-black" value={customer.email} onChange={handleChange} />
        </div>
        <div>
          <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
            Phone Number*
          </label>
          <input type="tel" id="phone" name="phone" required className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-black" value={customer.phone} onChange={handleChange} />
        </div>
      </div>
      <div className="p-4 bg-gray-50 rounded-lg">
        <h3 className="text-sm font-medium mb-2">Driver Requirements</h3>
        <ul className="text-sm space-y-1 text-gray-600">
          <li className="flex items-start">
            <span className="text-black mr-2">•</span>
            Must be at least 25 years old
          </li>
          <li className="flex items-start">
            <span className="text-black mr-2">•</span>
            Valid driver's license required at pickup
          </li>
          <li className="flex items-start">
            <span className="text-black mr-2">•</span>
            Credit card in renter's name required
          </li>
        </ul>
      </div>
    </div>;
}