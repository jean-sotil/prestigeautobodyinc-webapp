'use client';

import React, { useState } from 'react';

interface QuoteFormData {
  name: string;
  email: string;
  phone: string;
  vehicleYear: string;
  vehicleMake: string;
  vehicleModel: string;
  serviceType: string;
  description: string;
}

const INITIAL_DATA: QuoteFormData = {
  name: '',
  email: '',
  phone: '',
  vehicleYear: '',
  vehicleMake: '',
  vehicleModel: '',
  serviceType: '',
  description: '',
};

const SERVICE_TYPES = [
  'Collision Repair',
  'Auto Painting',
  'Dent Removal',
  'Frame Straightening',
  'Glass Replacement',
  'Other',
];

/**
 * Multi-step QuoteForm component
 * Heavy component suitable for dynamic import
 */
export function QuoteForm() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<QuoteFormData>(INITIAL_DATA);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const updateField = (field: keyof QuoteFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));

    setIsSubmitting(false);
    setIsSubmitted(true);
  };

  if (isSubmitted) {
    return (
      <div className="max-w-lg mx-auto p-6 bg-green-50 dark:bg-green-900/20 rounded-lg text-center">
        <h3 className="text-xl font-semibold text-green-800 dark:text-green-200 mb-2">
          Quote Request Submitted!
        </h3>
        <p className="text-green-700 dark:text-green-300">
          Thank you, {formData.name}. We will contact you within 24 hours.
        </p>
        <button
          onClick={() => {
            setIsSubmitted(false);
            setStep(1);
            setFormData(INITIAL_DATA);
          }}
          className="mt-4 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
        >
          Request Another Quote
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-lg mx-auto">
      {/* Progress indicator */}
      <div className="mb-6">
        <div className="flex justify-between text-sm mb-2">
          <span>Step {step} of 3</span>
          <span>{Math.round((step / 3) * 100)}% Complete</span>
        </div>
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
          <div
            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${(step / 3) * 100}%` }}
            aria-valuenow={step}
            aria-valuemin={1}
            aria-valuemax={3}
            role="progressbar"
          />
        </div>
      </div>

      {/* Step 1: Contact Info */}
      {step === 1 && (
        <div
          className="space-y-4"
          role="tabpanel"
          aria-label="Contact Information"
        >
          <h3 className="text-lg font-semibold">Contact Information</h3>

          <div>
            <label htmlFor="name" className="block text-sm font-medium mb-1">
              Full Name *
            </label>
            <input
              type="text"
              id="name"
              required
              value={formData.name}
              onChange={(e) => updateField('name', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded focus:ring-2 focus:ring-blue-500 dark:bg-gray-800"
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium mb-1">
              Email Address *
            </label>
            <input
              type="email"
              id="email"
              required
              value={formData.email}
              onChange={(e) => updateField('email', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded focus:ring-2 focus:ring-blue-500 dark:bg-gray-800"
            />
          </div>

          <div>
            <label htmlFor="phone" className="block text-sm font-medium mb-1">
              Phone Number *
            </label>
            <input
              type="tel"
              id="phone"
              required
              value={formData.phone}
              onChange={(e) => updateField('phone', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded focus:ring-2 focus:ring-blue-500 dark:bg-gray-800"
            />
          </div>

          <button
            type="button"
            onClick={() => setStep(2)}
            disabled={!formData.name || !formData.email || !formData.phone}
            className="w-full py-2 px-4 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Next: Vehicle Information
          </button>
        </div>
      )}

      {/* Step 2: Vehicle Info */}
      {step === 2 && (
        <div
          className="space-y-4"
          role="tabpanel"
          aria-label="Vehicle Information"
        >
          <h3 className="text-lg font-semibold">Vehicle Information</h3>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label htmlFor="year" className="block text-sm font-medium mb-1">
                Year *
              </label>
              <input
                type="text"
                id="year"
                required
                value={formData.vehicleYear}
                onChange={(e) => updateField('vehicleYear', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded focus:ring-2 focus:ring-blue-500 dark:bg-gray-800"
              />
            </div>
            <div className="col-span-2">
              <label htmlFor="make" className="block text-sm font-medium mb-1">
                Make *
              </label>
              <input
                type="text"
                id="make"
                required
                value={formData.vehicleMake}
                onChange={(e) => updateField('vehicleMake', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded focus:ring-2 focus:ring-blue-500 dark:bg-gray-800"
              />
            </div>
          </div>

          <div>
            <label htmlFor="model" className="block text-sm font-medium mb-1">
              Model *
            </label>
            <input
              type="text"
              id="model"
              required
              value={formData.vehicleModel}
              onChange={(e) => updateField('vehicleModel', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded focus:ring-2 focus:ring-blue-500 dark:bg-gray-800"
            />
          </div>

          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => setStep(1)}
              className="flex-1 py-2 px-4 border border-gray-300 dark:border-gray-600 rounded hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
            >
              Back
            </button>
            <button
              type="button"
              onClick={() => setStep(3)}
              disabled={
                !formData.vehicleYear ||
                !formData.vehicleMake ||
                !formData.vehicleModel
              }
              className="flex-1 py-2 px-4 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Next: Service Details
            </button>
          </div>
        </div>
      )}

      {/* Step 3: Service Details */}
      {step === 3 && (
        <div className="space-y-4" role="tabpanel" aria-label="Service Details">
          <h3 className="text-lg font-semibold">Service Details</h3>

          <div>
            <label
              htmlFor="serviceType"
              className="block text-sm font-medium mb-1"
            >
              Service Type *
            </label>
            <select
              id="serviceType"
              required
              value={formData.serviceType}
              onChange={(e) => updateField('serviceType', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded focus:ring-2 focus:ring-blue-500 dark:bg-gray-800"
            >
              <option value="">Select a service...</option>
              {SERVICE_TYPES.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label
              htmlFor="description"
              className="block text-sm font-medium mb-1"
            >
              Describe the Damage/Repair Needed *
            </label>
            <textarea
              id="description"
              required
              rows={4}
              value={formData.description}
              onChange={(e) => updateField('description', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 resize-vertical"
              placeholder="Please provide details about the damage or service you need..."
            />
          </div>

          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => setStep(2)}
              className="flex-1 py-2 px-4 border border-gray-300 dark:border-gray-600 rounded hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
            >
              Back
            </button>
            <button
              type="submit"
              disabled={
                isSubmitting || !formData.serviceType || !formData.description
              }
              className="flex-1 py-2 px-4 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isSubmitting ? 'Submitting...' : 'Get Your Quote'}
            </button>
          </div>
        </div>
      )}
    </form>
  );
}
