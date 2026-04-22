import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.57.4';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

type Submission = {
  status: 'accepted' | 'wrong_answer' | 'error';
  xp_earned: number | null;
  language: string | null;
  created_at: string;
  problems?: {
    title?: string;
    difficulty?: string;
  } | null;
};

type GeminiReport = {
  analysis: string;
  suggestedQuestions: string[];
  focusAreas: string[];
};

function fallbackAnalysis(metrics: {
  accuracy: number;
  totalAttempts: number;
  accepted: number;
  wrongAnswer: number;
  errors: number;
}) {
  let analysis = `This week you achieved ${metrics.accuracy}% accuracy across ${metrics.totalAttempts} submissions. `;
  if (metrics.errors > 2) analysis += `${metrics.errors} runtime errors suggest reviewing edge cases and syntax before submitting. `;
  if (metrics.wrongAnswer > 0) analysis += `Review failed test cases and compare your approach with editorials. `;
  if (metrics.accuracy >= 80) analysis += `Strong accuracy. Try moving into harder problems next. `;
  if (metrics.accuracy < 50) analysis += `Start with easier problems and focus on one pattern at a time. `;
  return analysis + 'Consistent daily practice is key to improvement.';
}

function fallbackSuggestions(metrics: {
  accuracy: number;
  wrongAnswer: number;
  errors: number;
}, submissions: Submission[]) {
  const failedTitles = submissions
    .filter((submission) => submission.status !== 'accepted')
    .map((submission) => submission.problems?.title)
    .filter(Boolean) as string[];

  if (failedTitles.length > 0) {
    return [
      `Retry: ${failedTitles[0]}`,
      metrics.wrongAnswer > 0 ? 'Two Sum with duplicate values' : 'Valid Parentheses with nested brackets',
      metrics.errors > 0 ? 'Binary Search with empty and single-element arrays' : 'Maximum Subarray with all negative numbers',
      'Contains Duplicate using a Set',
    ];
  }

  if (metrics.accuracy >= 80) {
    return [
      'Merge Sort on mixed positive and negative numbers',
      'Maximum Product Subarray with zeroes',
      'Find Peak Element using binary search',
      'Sort Colors using three pointers',
    ];
  }

  return [
    'Sum of Two Numbers with negative values',
    'FizzBuzz up to 15',
    'Reverse a String',
    'Binary Search on a sorted array',
  ];
}

function fallbackFocusAreas(metrics: {
  accuracy: number;
  wrongAnswer: number;
  errors: number;
}) {
  const areas = [];
  if (metrics.errors > 0) areas.push('Syntax and runtime safety');
  if (metrics.wrongAnswer > 0) areas.push('Edge cases and test tracing');
  if (metrics.accuracy < 60) areas.push('Foundation patterns');
  if (areas.length === 0) areas.push('Harder DSA challenges');
  return areas;
}

function buildPrompt(submissions: Submission[], metrics: {
  accuracy: number;
  totalAttempts: number;
  accepted: number;
  wrongAnswer: number;
  errors: number;
  weeklyXP: number;
}) {
  const problemSummary = submissions.slice(0, 30).map((submission, index) => ({
    index: index + 1,
    title: submission.problems?.title ?? 'Unknown problem',
    difficulty: submission.problems?.difficulty ?? 'unknown',
    status: submission.status,
    language: submission.language ?? 'unknown',
    xpEarned: submission.xp_earned ?? 0,
  }));

  return [
    'You are CodeQuest, a concise DSA learning coach.',
    'Return only valid JSON. Do not wrap it in markdown.',
    'The JSON shape must be:',
    '{"analysis":"string under 130 words","suggestedQuestions":["question 1","question 2","question 3","question 4"],"focusAreas":["area 1","area 2","area 3"]}',
    'Base suggestions on mistakes, failed statuses, difficulty, and problem titles. Suggested questions can be CodeQuest-style DSA practice prompts, not necessarily existing database problems.',
    'Keep question titles short, practical, and specific.',
    '',
    JSON.stringify({ metrics, recentSubmissions: problemSummary }, null, 2),
  ].join('\n');
}

function parseGeminiJson(text: string): GeminiReport {
  const cleaned = text
    .replace(/^```json\s*/i, '')
    .replace(/^```\s*/i, '')
    .replace(/\s*```$/i, '')
    .trim();
  const parsed = JSON.parse(cleaned);

  return {
    analysis: String(parsed.analysis ?? '').trim(),
    suggestedQuestions: Array.isArray(parsed.suggestedQuestions)
      ? parsed.suggestedQuestions.map((item: unknown) => String(item)).filter(Boolean).slice(0, 4)
      : [],
    focusAreas: Array.isArray(parsed.focusAreas)
      ? parsed.focusAreas.map((item: unknown) => String(item)).filter(Boolean).slice(0, 3)
      : [],
  };
}

async function generateGeminiReport(prompt: string): Promise<GeminiReport> {
  const apiKey = Deno.env.get('GEMINI_API_KEY');
  const model = Deno.env.get('GEMINI_MODEL') ?? 'gemini-2.5-flash';

  if (!apiKey) {
    throw new Error('GEMINI_API_KEY is not configured');
  }

  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-goog-api-key': apiKey,
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [{ text: prompt }],
          },
        ],
        generationConfig: {
          temperature: 0.35,
          maxOutputTokens: 420,
          responseMimeType: 'application/json',
        },
      }),
    }
  );

  if (!response.ok) {
    const message = await response.text();
    throw new Error(`Gemini request failed: ${message}`);
  }

  const data = await response.json();
  const text = data?.candidates?.[0]?.content?.parts
    ?.map((part: { text?: string }) => part.text ?? '')
    .join('')
    .trim();

  if (!text) {
    throw new Error('Gemini returned an empty response');
  }

  const report = parseGeminiJson(text);
  if (!report.analysis || report.suggestedQuestions.length === 0) {
    throw new Error('Gemini returned incomplete report JSON');
  }
  return report;
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(JSON.stringify({ error: 'Missing authorization header' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY');

    if (!supabaseUrl || !supabaseAnonKey) {
      throw new Error('Supabase environment is not configured');
    }

    const supabase = createClient(supabaseUrl, supabaseAnonKey, {
      global: {
        headers: { Authorization: authHeader },
      },
    });

    const { data: userData, error: userError } = await supabase.auth.getUser();
    if (userError || !userData.user) {
      return new Response(JSON.stringify({ error: 'Invalid session' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const oneWeekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();
    const { data, error } = await supabase
      .from('submissions')
      .select('status, xp_earned, language, created_at, problems(title, difficulty)')
      .eq('user_id', userData.user.id)
      .gte('created_at', oneWeekAgo)
      .order('created_at', { ascending: false });

    if (error) throw error;

    const submissions = (data ?? []) as Submission[];
    const accepted = submissions.filter((submission) => submission.status === 'accepted').length;
    const wrongAnswer = submissions.filter((submission) => submission.status === 'wrong_answer').length;
    const errors = submissions.filter((submission) => submission.status === 'error').length;
    const accuracy = submissions.length > 0 ? Math.round((accepted / submissions.length) * 100) : 0;
    const weeklyXP = submissions.reduce((sum, submission) => sum + (submission.xp_earned ?? 0), 0);
    const metrics = {
      accuracy,
      totalAttempts: submissions.length,
      accepted,
      wrongAnswer,
      errors,
      weeklyXP,
    };

    let analysis = fallbackAnalysis(metrics);
    let suggestedQuestions = fallbackSuggestions(metrics, submissions);
    let focusAreas = fallbackFocusAreas(metrics);
    let aiPowered = false;

    if (submissions.length > 0) {
      try {
        const geminiReport = await generateGeminiReport(buildPrompt(submissions, metrics));
        analysis = geminiReport.analysis;
        suggestedQuestions = geminiReport.suggestedQuestions;
        focusAreas = geminiReport.focusAreas.length > 0 ? geminiReport.focusAreas : focusAreas;
        aiPowered = true;
      } catch (geminiError) {
        console.error(geminiError);
      }
    }

    return new Response(JSON.stringify({ ...metrics, analysis, suggestedQuestions, focusAreas, aiPowered }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error(error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Could not generate report' }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
