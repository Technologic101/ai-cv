import { NextRequest, NextResponse } from 'next/server';
import jsonresumeSchema from '@jsonresume/schema';
import { prisma } from '@/lib/prisma';

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

    // Create resume in database
    const createdResume = await prisma.resume.create({
      data: {
        name: resume.basics.name,
        email: resume.basics.email,
        phone: resume.basics.phone,
        city: resume.basics.location?.city,
        country: resume.basics.location?.country,
        summary: resume.basics.summary,
        workExperiences: {
          create: resume.work?.map((work: any) => ({
            company: work.company,
            position: work.position,
            startDate: new Date(work.startDate),
            endDate: work.endDate ? new Date(work.endDate) : null,
            summary: work.summary,
            highlights: JSON.stringify(work.highlights || []),
          })) || [],
        },
        educations: {
          create: resume.education?.map((edu: any) => ({
            institution: edu.institution,
            area: edu.area,
            studyType: edu.studyType,
            startDate: new Date(edu.startDate),
            endDate: edu.endDate ? new Date(edu.endDate) : null,
            score: edu.score,
            courses: JSON.stringify(edu.courses || []),
          })) || [],
        },
        skills: {
          create: resume.skills?.map((skill: any) => ({
            name: skill.name,
            keywords: JSON.stringify(skill.keywords || []),
          })) || [],
        },
        languages: {
          create: resume.languages?.map((lang: any) => ({
            language: lang.language,
            fluency: lang.fluency,
          })) || [],
        },
        projects: {
          create: resume.projects?.map((project: any) => ({
            name: project.name,
            description: project.description,
            highlights: JSON.stringify(project.highlights || []),
          })) || [],
        },
        certificates: {
          create: resume.certificates?.map((cert: any) => ({
            name: cert.name,
            date: new Date(cert.date),
            issuer: cert.issuer,
          })) || [],
        },
        awards: {
          create: resume.awards?.map((award: any) => ({
            title: award.title,
            date: new Date(award.date),
            awarder: award.awarder,
          })) || [],
        },
      },
      include: {
        workExperiences: true,
        educations: true,
        skills: true,
        languages: true,
        projects: true,
        certificates: true,
        awards: true,
      },
    });

    return NextResponse.json(createdResume);
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
      const resume = await prisma.resume.findUnique({
        where: { id },
        include: {
          workExperiences: true,
          educations: true,
          skills: true,
          languages: true,
          projects: true,
          certificates: true,
          awards: true,
        },
      });

      if (!resume) {
        return NextResponse.json(
          { error: 'Resume not found' },
          { status: 404 }
        );
      }

      return NextResponse.json(resume);
    }

    // Return all resumes (in a real app, implement pagination)
    const resumes = await prisma.resume.findMany({
      include: {
        workExperiences: true,
        educations: true,
        skills: true,
        languages: true,
        projects: true,
        certificates: true,
        awards: true,
      },
    });

    return NextResponse.json(resumes);
  } catch (error) {
    console.error('Error retrieving resume(s):', error);
    return NextResponse.json(
      { error: 'Failed to retrieve resume(s)' },
      { status: 500 }
    );
  }
} 