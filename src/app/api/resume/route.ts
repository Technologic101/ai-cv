import { NextRequest, NextResponse } from 'next/server';
import jsonresumeSchema from '@jsonresume/schema';

// In a real application, you would use a database
// For now, we'll use an in-memory store
let resumes: Record<string, any> = {};

export async function POST(request: NextRequest) {
  try {
    const resume = await request.json();

    // Validate against JSON Resume schema
    const validationResult = await new Promise<{ errors: any[] | null; valid: boolean }>((resolve) => {
      jsonresumeSchema.validate(resume, (errors, valid) => {
        resolve({ errors, valid });
      });
    });

    if (!validationResult.valid) {
      return NextResponse.json(
        { error: 'Invalid resume format', details: validationResult.errors },
        { status: 400 }
      );
    }

    // Generate a unique ID (in a real app, use a proper ID generator)
    const id = Date.now().toString();
    resumes[id] = resume;

    return NextResponse.json({ id, ...resume });
  } catch (error) {
    console.error('Error saving resume:', error);
    return NextResponse.json(
      { error: 'Failed to save resume' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (id) {
      const resume = resumes[id];
      if (!resume) {
        return NextResponse.json(
          { error: 'Resume not found' },
          { status: 404 }
        );
      }
      return NextResponse.json(resume);
    }

    // Return all resumes (in a real app, implement pagination)
    return NextResponse.json(Object.values(resumes));
  } catch (error) {
    console.error('Error retrieving resume(s):', error);
    return NextResponse.json(
      { error: 'Failed to retrieve resume(s)' },
      { status: 500 }
    );
  }
} 