'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollFrameAnimation } from '@/components/animations/scroll-frame-animation';
import { CreditCard, Lock } from 'lucide-react';

export default function CheckoutPage() {
  const [step, setStep] = useState<'shipping' | 'payment' | 'review'>('shipping');
  const [formData, setFormData] = useState({
    email: '',
    firstName: '',
    lastName: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: '',
    cardNumber: '',
    cardExpiry: '',
    cardCVC: '',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleStepChange = (newStep: typeof step) => {
    setStep(newStep);
  };

  const steps = ['shipping', 'payment', 'review'] as const;
  const stepLabels = {
    shipping: 'Shipping',
    payment: 'Payment',
    review: 'Review',
  };

  return (
    <div className="mx-auto max-w-4xl px-4 sm:px-6 py-8">
      <ScrollFrameAnimation className="mb-8">
        <h1 className="text-4xl font-bold text-foreground mb-2">Checkout</h1>
        <p className="text-muted-foreground">
          Complete your purchase in a few steps
        </p>
      </ScrollFrameAnimation>

      {/* Progress steps */}
      <ScrollFrameAnimation className="mb-8">
        <div className="flex items-center gap-4">
          {steps.map((s, index) => (
            <div key={s} className="flex items-center">
              <button
                onClick={() => handleStepChange(s)}
                className={`relative flex items-center justify-center w-10 h-10 rounded-full font-semibold transition-colors ${
                  step === s
                    ? 'bg-primary text-primary-foreground'
                    : steps.indexOf(step) > index
                      ? 'bg-accent text-accent-foreground'
                      : 'bg-muted text-muted-foreground'
                }`}
              >
                {steps.indexOf(step) > index ? '✓' : index + 1}
              </button>
              {index < steps.length - 1 && (
                <div
                  className={`flex-1 h-1 mx-2 ${
                    steps.indexOf(step) > index ? 'bg-accent' : 'bg-muted'
                  }`}
                />
              )}
            </div>
          ))}
        </div>
        <div className="flex gap-4 mt-4">
          {steps.map((s) => (
            <span key={s} className="text-xs sm:text-sm text-muted-foreground">
              {stepLabels[s]}
            </span>
          ))}
        </div>
      </ScrollFrameAnimation>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main checkout form */}
        <div className="lg:col-span-2">
          <ScrollFrameAnimation className="surface-elevated p-6 rounded-lg">
            {/* Shipping Step */}
            {step === 'shipping' && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-xl font-bold text-foreground mb-4">
                    Shipping Address
                  </h2>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-1">
                        Email
                      </label>
                      <Input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        placeholder="you@example.com"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-foreground mb-1">
                          First Name
                        </label>
                        <Input
                          type="text"
                          name="firstName"
                          value={formData.firstName}
                          onChange={handleInputChange}
                          placeholder="John"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-foreground mb-1">
                          Last Name
                        </label>
                        <Input
                          type="text"
                          name="lastName"
                          value={formData.lastName}
                          onChange={handleInputChange}
                          placeholder="Doe"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-foreground mb-1">
                        Address
                      </label>
                      <Input
                        type="text"
                        name="address"
                        value={formData.address}
                        onChange={handleInputChange}
                        placeholder="123 Main Street"
                      />
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-foreground mb-1">
                          City
                        </label>
                        <Input
                          type="text"
                          name="city"
                          value={formData.city}
                          onChange={handleInputChange}
                          placeholder="San Francisco"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-foreground mb-1">
                          State
                        </label>
                        <Input
                          type="text"
                          name="state"
                          value={formData.state}
                          onChange={handleInputChange}
                          placeholder="CA"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-foreground mb-1">
                          ZIP Code
                        </label>
                        <Input
                          type="text"
                          name="zipCode"
                          value={formData.zipCode}
                          onChange={handleInputChange}
                          placeholder="94105"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-foreground mb-1">
                        Country
                      </label>
                      <Input
                        type="text"
                        name="country"
                        value={formData.country}
                        onChange={handleInputChange}
                        placeholder="United States"
                      />
                    </div>
                  </div>
                </div>

                <Button
                  size="lg"
                  className="w-full button-primary"
                  onClick={() => handleStepChange('payment')}
                >
                  Continue to Payment
                </Button>
              </div>
            )}

            {/* Payment Step */}
            {step === 'payment' && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-xl font-bold text-foreground mb-4 flex items-center gap-2">
                    <CreditCard className="h-6 w-6" />
                    Payment Method
                  </h2>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-1">
                        Card Number
                      </label>
                      <Input
                        type="text"
                        name="cardNumber"
                        value={formData.cardNumber}
                        onChange={handleInputChange}
                        placeholder="1234 5678 9012 3456"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-foreground mb-1">
                          Expiry Date
                        </label>
                        <Input
                          type="text"
                          name="cardExpiry"
                          value={formData.cardExpiry}
                          onChange={handleInputChange}
                          placeholder="MM/YY"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-foreground mb-1">
                          CVC
                        </label>
                        <Input
                          type="text"
                          name="cardCVC"
                          value={formData.cardCVC}
                          onChange={handleInputChange}
                          placeholder="123"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex gap-4">
                  <Button
                    size="lg"
                    variant="outline"
                    className="flex-1"
                    onClick={() => handleStepChange('shipping')}
                  >
                    Back
                  </Button>
                  <Button
                    size="lg"
                    className="flex-1 button-primary"
                    onClick={() => handleStepChange('review')}
                  >
                    Review Order
                  </Button>
                </div>
              </div>
            )}

            {/* Review Step */}
            {step === 'review' && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-xl font-bold text-foreground mb-4">
                    Review Your Order
                  </h2>

                  <div className="space-y-4 text-sm">
                    <div className="border-b border-border pb-4">
                      <h3 className="font-semibold text-foreground mb-2">
                        Shipping Address
                      </h3>
                      <p className="text-muted-foreground">
                        {formData.firstName} {formData.lastName}
                        <br />
                        {formData.address}
                        <br />
                        {formData.city}, {formData.state} {formData.zipCode}
                        <br />
                        {formData.country}
                      </p>
                    </div>

                    <div className="border-b border-border pb-4">
                      <h3 className="font-semibold text-foreground mb-2">
                        Payment Method
                      </h3>
                      <p className="text-muted-foreground">
                        Card ending in {formData.cardNumber.slice(-4)}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-accent/10 border border-accent/20 rounded-lg p-4 flex items-start gap-3">
                  <Lock className="h-5 w-5 text-accent flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-accent">
                    Your payment information is secure and encrypted.
                  </p>
                </div>

                <div className="flex gap-4">
                  <Button
                    size="lg"
                    variant="outline"
                    className="flex-1"
                    onClick={() => handleStepChange('payment')}
                  >
                    Back
                  </Button>
                  <Button size="lg" className="flex-1 button-primary">
                    Place Order
                  </Button>
                </div>
              </div>
            )}
          </ScrollFrameAnimation>
        </div>

        {/* Order summary sidebar */}
        <div className="lg:col-span-1">
          <ScrollFrameAnimation className="surface-elevated p-6 rounded-lg sticky top-20 space-y-4">
            <h3 className="text-lg font-bold text-foreground">Order Summary</h3>

            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Subtotal</span>
                <span className="font-medium">$224.98</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Shipping</span>
                <span className="font-medium text-accent">Free</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Tax</span>
                <span className="font-medium">$17.99</span>
              </div>
            </div>

            <div className="border-t border-border pt-4">
              <div className="flex justify-between font-bold">
                <span>Total</span>
                <span>$242.97</span>
              </div>
            </div>
          </ScrollFrameAnimation>
        </div>
      </div>
    </div>
  );
}
