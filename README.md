# AI-Powered Resume Builder

A Next.js application that helps users create, edit, and manage their professional resumes using AI technology. The application supports both manual resume creation and automatic parsing of existing PDF resumes.

## Features

- Create user resume profile using JSON Resume format
- Upload and parse existing PDF resumes using AI
- Edit resume information with user-friendly forms
- Preview and download resumes in various formats
- AI-powered resume parsing using LangChain and OpenAI

## Prerequisites

- Node.js 18.x or later
- OpenAI API key
- pnpm (recommended), npm, or yarn package manager

## Installation

1. Clone the repository:
```bash
git clone https://github.com/Technologic101/ai-cv.git
cd ai-cv
```

2. Install dependencies:
```bash
npm install
# or
yarn install
```

3. Create a `.env.local` file in the root directory and add your OpenAI API key:
```
OPENAI_API_KEY=your_api_key_here
```

## Development

Run the development server:
```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

## Project Structure

```
src/
├── app/
│   ├── api/
│   │   └── resume/
│   │       ├── route.ts           # API routes for resume operations
│   │       └── parse/
│   │           └── route.ts       # API route for resume parsing
│   ├── resume/
│   │   ├── create/
│   │   │   └── page.tsx          # Resume creation form
│   │   ├── upload/
│   │   │   └── page.tsx          # Resume upload page
│   │   └── preview/
│   │       └── page.tsx          # Resume preview page
│   └── page.tsx                  # Home page
└── components/                   # Reusable components
```

## API Routes

- `POST /api/resume` - Create or update a resume
- `GET /api/resume` - Retrieve resume(s)
- `POST /api/resume/parse` - Parse uploaded PDF resume

## Technologies Used

- Next.js 14
- React 18
- TypeScript
- LangChain
- OpenAI GPT-4
- Tailwind CSS
- React Hook Form
- Zod
- JSON Resume Schema

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.
