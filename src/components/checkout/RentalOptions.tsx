import React from 'react';
export function RentalOptions({
  rentalPeriod,
  options,
  updateRentalPeriod,
  updateOptions
}) {
  const formatDate = date => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };
  const handleDateChange = (field, value) => {
    updateRentalPeriod({
      [field]: new Date(value)
    });
  };
  const handleOptionChange = option => {
    updateOptions({
      [option]: !options[option]
    });
  };
  // Calculate days difference
  const daysDiff = Math.ceil((new Date(rentalPeriod.endDate) - new Date(rentalPeriod.startDate)) / (1000 * 60 * 60 * 24));
  return <div className="space-y-8">
      <h2 className="text-xl font-semibold text-black">Rental Options</h2>
      {/* Rental Period */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Rental Period</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="pickup-date" className="block text-sm font-medium text-gray-700 mb-1">
              Pick-up Date
            </label>
            <input type="date" id="pickup-date" className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-black" value={rentalPeriod.startDate.toISOString().split('T')[0]} onChange={e => handleDateChange('startDate', e.target.value)} />
          </div>
          <div>
            <label htmlFor="return-date" className="block text-sm font-medium text-gray-700 mb-1">
              Return Date
            </label>
            <input type="date" id="return-date" className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-black" value={rentalPeriod.endDate.toISOString().split('T')[0]} min={rentalPeriod.startDate.toISOString().split('T')[0]} onChange={e => handleDateChange('endDate', e.target.value)} />
          </div>
        </div>
        <div>
          <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">
            Pick-up & Return Location
          </label>
          <select id="location" className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-black" value={rentalPeriod.location} onChange={e => updateRentalPeriod({
          location: e.target.value
        })}>
            <option value="San Francisco Airport">San Francisco Airport</option>
            <option value="Downtown San Francisco">
              Downtown San Francisco
            </option>
            <option value="Oakland Airport">Oakland Airport</option>
            <option value="San Jose Airport">San Jose Airport</option>
          </select>
        </div>
        <div className="bg-gray-50 p-4 rounded-lg">
          <p className="text-sm">
            You're renting for{' '}
            <span className="font-semibold">
              {daysDiff} {daysDiff === 1 ? 'day' : 'days'}
            </span>{' '}
            from {formatDate(rentalPeriod.startDate)} to{' '}
            {formatDate(rentalPeriod.endDate)}
          </p>
        </div>
      </div>
      {/* Additional Options */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Additional Options</h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 border border-gray-200 rounded-md">
            <div>
              <h4 className="font-medium">Insurance Coverage</h4>
              <p className="text-sm text-gray-500">
                Full coverage with $0 deductible
              </p>
            </div>
            <div className="flex items-center">
              <span className="mr-2 text-sm font-medium">$14.99/day</span>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" checked={options.insurance} onChange={() => handleOptionChange('insurance')} />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-black"></div>
              </label>
            </div>
          </div>
          <div className="flex items-center justify-between p-3 border border-gray-200 rounded-md">
            <div>
              <h4 className="font-medium">GPS Navigation</h4>
              <p className="text-sm text-gray-500">Built-in GPS system</p>
            </div>
            <div className="flex items-center">
              <span className="mr-2 text-sm font-medium">$7.99/day</span>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" checked={options.gps} onChange={() => handleOptionChange('gps')} />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-black"></div>
              </label>
            </div>
          </div>
          <div className="flex items-center justify-between p-3 border border-gray-200 rounded-md">
            <div>
              <h4 className="font-medium">Child Seat</h4>
              <p className="text-sm text-gray-500">
                Safety-approved child seat
              </p>
            </div>
            <div className="flex items-center">
              <span className="mr-2 text-sm font-medium">$5.99/day</span>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" checked={options.childSeat} onChange={() => handleOptionChange('childSeat')} />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-black"></div>
              </label>
            </div>
          </div>
          <div className="flex items-center justify-between p-3 border border-gray-200 rounded-md">
            <div>
              <h4 className="font-medium">Additional Driver</h4>
              <p className="text-sm text-gray-500">
                Add one more authorized driver
              </p>
            </div>
            <div className="flex items-center">
              <span className="mr-2 text-sm font-medium">$9.99/day</span>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" checked={options.additionalDriver} onChange={() => handleOptionChange('additionalDriver')} />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-black"></div>
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>;
}