import { NextRequest, NextResponse } from 'next/server';
import { PDFLoader } from 'langchain/document_loaders/fs/pdf';
import { ChatOpenAI } from 'langchain/chat_models/openai';
import { PromptTemplate } from 'langchain/prompts';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      );
    }

    // Convert File to ArrayBuffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Load PDF using LangChain
    const loader = new PDFLoader(buffer);
    const docs = await loader.load();

    // Extract text from all pages
    const text = docs.map(doc => doc.pageContent).join('\n');

    // Initialize OpenAI model
    const model = new ChatOpenAI({
      modelName: 'gpt-4',
      temperature: 0,
    });

    // Create prompt template for resume parsing
    const promptTemplate = PromptTemplate.fromTemplate(`
      Parse the following resume text into JSON Resume format.
      Extract key information like name, contact details, work experience, education, and skills.
      Format the response as a valid JSON object following the JSON Resume schema.
      
      Resume text:
      {text}
      
      Response should be a valid JSON object with the following structure:
      {
        "basics": {
          "name": "",
          "email": "",
          "phone": "",
          "location": {
            "city": "",
            "country": ""
          },
          "summary": ""
        },
        "work": [
          {
            "company": "",
            "position": "",
            "startDate": "",
            "endDate": "",
            "summary": ""
          }
        ],
        "education": [
          {
            "institution": "",
            "area": "",
            "studyType": "",
            "startDate": "",
            "endDate": ""
          }
        ]
      }
    `);

    // Generate prompt
    const prompt = await promptTemplate.format({ text });

    // Get response from OpenAI
    const response = await model.invoke(prompt);
    const parsedResume = JSON.parse(response.content);

    return NextResponse.json(parsedResume);
  } catch (error) {
    console.error('Error parsing resume:', error);
    return NextResponse.json(
      { error: 'Failed to parse resume' },
      { status: 500 }
    );
  }
} 