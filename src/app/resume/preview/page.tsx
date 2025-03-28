'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';

interface Resume {
  basics: {
    name: string;
    email: string;
    phone?: string;
    location?: {
      city?: string;
      country?: string;
    };
    summary?: string;
  };
  work?: Array<{
    company: string;
    position: string;
    startDate: string;
    endDate?: string;
    summary?: string;
  }>;
  education?: Array<{
    institution: string;
    area: string;
    studyType: string;
    startDate: string;
    endDate?: string;
  }>;
}

export default function PreviewResume() {
  const [resume, setResume] = useState<Resume | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const searchParams = useSearchParams();

  useEffect(() => {
    const fetchResume = async () => {
      try {
        const id = searchParams.get('id');
        if (!id) {
          throw new Error('No resume ID provided');
        }

        const response = await fetch(`/api/resume?id=${id}`);
        if (!response.ok) {
          throw new Error('Failed to fetch resume');
        }

        const data = await response.json();
        setResume(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchResume();
  }, [searchParams]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading resume...</p>
        </div>
      </div>
    );
  }

  if (error || !resume) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600">{error || 'Resume not found'}</p>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white shadow rounded-lg p-8">
          {/* Header */}
          <header className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">{resume.basics.name}</h1>
            <div className="mt-2 text-gray-600">
              <p>{resume.basics.email}</p>
              {resume.basics.phone && <p>{resume.basics.phone}</p>}
              {resume.basics.location && (
                <p>
                  {resume.basics.location.city && `${resume.basics.location.city}, `}
                  {resume.basics.location.country}
                </p>
              )}
            </div>
          </header>

          {/* Summary */}
          {resume.basics.summary && (
            <section className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-2">Professional Summary</h2>
              <p className="text-gray-600">{resume.basics.summary}</p>
            </section>
          )}

          {/* Work Experience */}
          {resume.work && resume.work.length > 0 && (
            <section className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Work Experience</h2>
              {resume.work.map((job, index) => (
                <div key={index} className="mb-6">
                  <h3 className="text-lg font-medium text-gray-900">{job.position}</h3>
                  <p className="text-gray-600">{job.company}</p>
                  <p className="text-sm text-gray-500">
                    {job.startDate} - {job.endDate || 'Present'}
                  </p>
                  {job.summary && (
                    <p className="mt-2 text-gray-600">{job.summary}</p>
                  )}
                </div>
              ))}
            </section>
          )}

          {/* Education */}
          {resume.education && resume.education.length > 0 && (
            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Education</h2>
              {resume.education.map((edu, index) => (
                <div key={index} className="mb-6">
                  <h3 className="text-lg font-medium text-gray-900">{edu.institution}</h3>
                  <p className="text-gray-600">{edu.studyType} in {edu.area}</p>
                  <p className="text-sm text-gray-500">
                    {edu.startDate} - {edu.endDate || 'Present'}
                  </p>
                </div>
              ))}
            </section>
          )}
        </div>
      </div>
    </main>
  );
} 