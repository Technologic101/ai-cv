import { NextRequest, NextResponse } from 'next/server';
import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import { ChatOpenAI } from "@langchain/openai";
import { PromptTemplate } from '@langchain/core/prompts';
import resumeSchema from '@jsonresume/schema';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file');

    if (!file || !(file instanceof Blob)) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      );
    }

    // Use the Blob directly with PDFLoader
    const loader = new PDFLoader(file);
    const docs = await loader.load();

    // Extract text from all pages
    const text = docs.map(doc => doc.pageContent).join('\n');

    // Initialize OpenAI model
    const model = new ChatOpenAI({
      modelName: 'gpt-4o-mini',
      temperature: 0,
    });

    // Create prompt template for resume parsing
    const promptTemplate = PromptTemplate.fromTemplate(`
      Parse the following resume text into JSON Resume format.
      Extract key information like name, contact details, work experience, education, and skills.
      Format the response as a valid JSON object following the JSON Resume schema.
      
      IMPORTANT: All dates must be in ISO 8601 format:
      - Full date: YYYY-MM-DD (e.g., 2023-04-15)
      - Month and year: YYYY-MM (e.g., 2023-04)
      - Year only: YYYY (e.g., 2023)
      
      Resume text:
      {text}
      
      Required fields to extract:
      - basics.name: Full name of the person
      - basics.email: Email address
      - basics.phone: Phone number
      - basics.location.city: City
      - basics.location.country: Country
      - basics.summary: Professional summary
      
      - work: Array of work experiences, each with:
        - name: Company name
        - position: Job title
        - startDate: Start date (in ISO 8601 format)
        - endDate: End date (in ISO 8601 format) or "Present"
        - summary: Job description
        - highlights: Array of key achievements
      
      - education: Array of educational experiences, each with:
        - institution: School/University name
        - area: Field of study
        - studyType: Degree type
        - startDate: Start date (in ISO 8601 format)
        - endDate: End date (in ISO 8601 format) or "Present"
        - score: GPA or grade (if available)
        - courses: Array of relevant courses
      
      Optional fields to extract if present:
      - skills: Array of skills with name and keywords
      - languages: Array of languages with language and fluency
      - projects: Array of projects with name, description, and highlights
      - certificates: Array of certificates with name, date, and issuer
      - awards: Array of awards with title, date, and awarder

      Return only the JSON object without any additional text and without backticks.
    `);

    // Generate prompt
    const prompt = await promptTemplate.format({ text });

    // Get response from OpenAI
    const response = await model.invoke(prompt);
    const parsedResume = JSON.parse(response.content.toString());

    return NextResponse.json(parsedResume);
  } catch (error) {
    console.error('Error parsing resume:', error);
    return NextResponse.json(
      { error: 'Failed to parse resume' },
      { status: 500 }
    );
  }
} 