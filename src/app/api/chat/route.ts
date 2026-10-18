import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { runAgentConversation } from '@/lib/agent/runner';

const chatRequestSchema = z.object({
  messages: z.array(
    z.object({
      id: z.string().optional(),
      role: z.enum(['user', 'assistant', 'system']),
      content: z.string().min(1, 'Message content cannot be empty'),
    })
  ),
});

export async function POST(req: NextRequest) {
  try {
    const json = await req.json();
    const parsed = chatRequestSchema.safeParse(json);

    if (!parsed.success) {
      return NextResponse.json(
        {
          error: 'Invalid request payload',
          details: parsed.error.format(),
        },
        { status: 400 }
      );
    }

    const result = await runAgentConversation(parsed.data);
    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    console.error('Chat API Handler Error:', error);
    return NextResponse.json(
      {
        error: 'Failed to process agent conversation turn',
        message: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}
