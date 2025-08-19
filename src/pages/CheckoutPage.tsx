import { useState } from 'react';
import { VehicleDetails } from '../components/checkout/VehicleDetails';
import { RentalOptions } from '../components/checkout/RentalOptions';
import { CustomerForm } from '../components/checkout/CustomerForm';
import { PaymentForm } from '../components/checkout/PaymentForm';
import { OrderSummary } from '../features/payment/components/OrderSummary';
import { ArrowLeft, ArrowRight } from 'lucide-react';
export function CheckoutPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const [orderDetails, setOrderDetails] = useState({
    vehicle: {
      id: 'suv-001',
      name: 'Tesla Model Y',
      type: 'SUV',
      image: 'https://images.unsplash.com/photo-1617788138017-80ad40651399?q=80&w=2070&auto=format&fit=crop',
      pricePerDay: 89.99
    },
    rentalPeriod: {
      startDate: new Date(),
      endDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
      location: 'San Francisco Airport'
    },
    options: {
      insurance: true,
      gps: false,
      childSeat: false,
      additionalDriver: false
    },
    customer: {
      firstName: '',
      lastName: '',
      email: '',
      phone: ''
    },
    payment: {
      cardNumber: '',
      cardName: '',
      expiry: '',
      cvv: ''
    }
  });
  return <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-b border-gray-200">
        <div className="container py-6">
          <h1 className="text-2xl font-bold text-black">
            Vehicle Rental Checkout
          </h1>
        </div>
      </header>
      {/* Checkout content */}
      <main className="container py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Main checkout form */}
          <div className="flex-1">
           
          </div>
          {/* Order summary sidebar */}
          <div className="lg:w-96 mt-8 lg:mt-0">
            <OrderSummary orderDetails={orderDetails} />
          </div>
        </div>
      </main>
    </div>;
}