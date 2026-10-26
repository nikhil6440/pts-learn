import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import 'dotenv/config';
import { GoogleGenAI, Type } from '@google/genai';
import { validateGeminiQuestion } from './src/utils/gameRules.js';
import { getFallbackQuestionsForLevel } from './src/data/questionBank.js';
import { GameId } from './src/types/game.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// Initialize Gemini client if API key is present
const apiKey = process.env.GEMINI_API_KEY;
let ai: GoogleGenAI | null = null;

if (apiKey && apiKey !== 'MY_GEMINI_API_KEY' && apiKey.trim().length > 0) {
  ai = new GoogleGenAI({
    apiKey: apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

/**
 * Server-side AI Question Generation endpoint
 * Generates age-appropriate quiz questions tailored to child age, difficulty, and game mode.
 */
app.post('/api/generate-questions', async (req, res) => {
  const {
    gameId = 'math-quest',
    worldTitle = 'Number Trails',
    worldNumber = 1,
    levelNumber = 1,
    ageGroup = '10-11',
    difficulty = 'medium',
    count = 3,
  } = req.body;

  // If Gemini AI is available, attempt to generate questions
  if (ai) {
    try {
      const gameLabel =
        gameId === 'math-quest'
          ? 'Mathematics (arithmetic, patterns, fractions, equations)'
          : gameId === 'science-explorer'
          ? 'Science (biology, space, states of matter, physics, natural world)'
          : 'Logical Reasoning (sequences, spatial deduction, patterns, brain teasers)';

      const prompt = `Generate exactly ${count} educational multiple-choice quiz questions for children aged ${ageGroup} years at '${difficulty}' difficulty level.
Game mode: ${gameLabel}.
World/Topic: ${worldTitle} (World ${worldNumber}, Level ${levelNumber}).

Guidelines for children:
1. Make the question engaging, clear, and age-appropriate.
2. Provide exactly 4 distinct multiple-choice answer choices.
3. Exactly one answer must be strictly correct.
4. Provide a visual prompt or equation string where applicable (e.g., "7 × 8 = ?" or "1, 3, 5, ?").
5. Provide a short, encouraging 1-sentence explanation of why the correct answer is right.
6. Provide an encouraging 1-sentence hint that does not directly give away the answer.`;

      // 12-second timeout for reliable Gemini response
      const timeoutPromise = new Promise<never>((_, reject) =>
        setTimeout(() => reject(new Error('AI generation timed out')), 12000)
      );

      const generatePromise = ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
        config: {
          systemInstruction:
            'You are an expert children educational game content designer for Playtown Learn. Keep language positive, clear, accessible, and strictly child-friendly for ages 8-14.',
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.ARRAY,
            description: 'List of educational quiz questions',
            items: {
              type: Type.OBJECT,
              properties: {
                questionText: { type: Type.STRING, description: 'The main quiz question' },
                visualPrompt: { type: Type.STRING, description: 'Equation, series, or visual prompt' },
                visualType: {
                  type: Type.STRING,
                  description: "Type of visual representation: 'equation', 'planet', 'sequence', 'science', or 'text'",
                },
                answerOptions: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING },
                  description: 'Exactly 4 distinct answer choices',
                },
                correctAnswer: { type: Type.STRING, description: 'The single exact correct answer' },
                explanation: { type: Type.STRING, description: 'Encouraging explanation of the answer' },
                hint: { type: Type.STRING, description: 'Helpful hint that clues without spoiling' },
              },
              required: ['questionText', 'answerOptions', 'correctAnswer', 'explanation', 'hint'],
            },
          },
        },
      });

      const response = await Promise.race([generatePromise, timeoutPromise]);
      const responseText = response.text?.trim() || '[]';
      const parsed = JSON.parse(responseText);

      if (Array.isArray(parsed) && parsed.length > 0) {
        const validatedQuestions = parsed
          .map((item, idx) =>
            validateGeminiQuestion(
              {
                ...item,
                gameId: gameId as GameId,
                worldNumber: Number(worldNumber),
                levelNumber: Number(levelNumber),
                ageGroup,
                difficulty,
                questionId: `ai-${Date.now()}-${idx}`,
              },
              gameId as GameId
            )
          )
          .filter(Boolean);

        if (validatedQuestions.length >= count) {
          return res.json({
            success: true,
            source: 'ai',
            questions: validatedQuestions.slice(0, count),
          });
        }
      }
    } catch {
      // Clean fallback without throwing noisy warnings
    }
  }

  // Graceful fallback to verified curated offline bank
  const fallback = getFallbackQuestionsForLevel(
    gameId as GameId,
    Number(worldNumber),
    Number(levelNumber),
    ageGroup,
    difficulty
  );

  return res.json({
    success: true,
    source: 'fallback',
    questions: fallback,
  });
});

// CORS for PWABuilder and external scanners
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  next();
});

// Explicit manifest route for crawlers & PWABuilder
app.get(['/manifest.json', '/manifest.webmanifest'], (_req, res) => {
  res.setHeader('Content-Type', 'application/manifest+json; charset=utf-8');
  res.sendFile(path.resolve(__dirname, 'public', 'manifest.json'));
});

// Explicit service worker route for PWA compliance
app.get(['/sw.js', '/service-worker.js'], (_req, res) => {
  res.setHeader('Content-Type', 'application/javascript; charset=utf-8');
  res.setHeader('Service-Worker-Allowed', '/');
  res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
  res.sendFile(path.resolve(__dirname, 'public', 'sw.js'));
});

// Setup Vite middlewares in development or static serve in production
async function startServer() {
  const isProduction = process.env.NODE_ENV === 'production';

  if (!isProduction) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, () => {
    console.log(`Playtown Learn server running on http://localhost:${PORT}`);
  });
}

startServer();
