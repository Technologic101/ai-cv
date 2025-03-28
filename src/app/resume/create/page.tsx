'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { jsonresumeSchema } from 'jsonresume-schema';

const resumeFormSchema = z.object({
  basics: z.object({
    name: z.string().min(1, 'Name is required'),
    email: z.string().email('Invalid email address'),
    phone: z.string().optional(),
    location: z.object({
      city: z.string().optional(),
      country: z.string().optional(),
    }).optional(),
    summary: z.string().optional(),
  }),
  work: z.array(z.object({
    company: z.string().min(1, 'Company name is required'),
    position: z.string().min(1, 'Position is required'),
    startDate: z.string().min(1, 'Start date is required'),
    endDate: z.string().optional(),
    summary: z.string().optional(),
  })).optional(),
  education: z.array(z.object({
    institution: z.string().min(1, 'Institution name is required'),
    area: z.string().min(1, 'Area of study is required'),
    studyType: z.string().min(1, 'Study type is required'),
    startDate: z.string().min(1, 'Start date is required'),
    endDate: z.string().optional(),
  })).optional(),
});

type ResumeFormData = z.infer<typeof resumeFormSchema>;

export default function CreateResume() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { register, handleSubmit, formState: { errors } } = useForm<ResumeFormData>({
    resolver: zodResolver(resumeFormSchema),
  });

  const onSubmit = async (data: ResumeFormData) => {
    setIsSubmitting(true);
    try {
      const response = await fetch('/api/resume', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error('Failed to save resume');
      }

      // Redirect to resume preview or show success message
    } catch (error) {
      console.error('Error saving resume:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Create Your Resume</h1>
        
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 bg-white p-6 rounded-lg shadow">
          <div>
            <h2 className="text-xl font-semibold mb-4">Basic Information</h2>
            <div className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                  Full Name
                </label>
                <input
                  type="text"
                  id="name"
                  {...register('basics.name')}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
                {errors.basics?.name && (
                  <p className="mt-1 text-sm text-red-600">{errors.basics.name.message}</p>
                )}
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  {...register('basics.email')}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
                {errors.basics?.email && (
                  <p className="mt-1 text-sm text-red-600">{errors.basics.email.message}</p>
                )}
              </div>

              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                  Phone
                </label>
                <input
                  type="tel"
                  id="phone"
                  {...register('basics.phone')}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>

          <div>
            <h2 className="text-xl font-semibold mb-4">Professional Summary</h2>
            <textarea
              {...register('basics.summary')}
              rows={4}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex justify-center rounded-md border border-transparent bg-blue-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
            >
              {isSubmitting ? 'Saving...' : 'Save Resume'}
            </button>
          </div>
        </form>
      </div>
    </main>
  );
} 