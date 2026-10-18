import { NextRequest, NextResponse } from 'next/server';
import { executeToolCall, TOOL_REGISTRY } from '@/lib/tools/registry';

interface RouteContext {
  params: {
    toolName: string;
  };
}

export async function POST(req: NextRequest, { params }: RouteContext) {
  const { toolName } = params;

  if (!TOOL_REGISTRY[toolName]) {
    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'TOOL_NOT_FOUND',
          message: `Tool "${toolName}" is not registered.`,
          availableTools: Object.keys(TOOL_REGISTRY),
        },
      },
      { status: 404 }
    );
  }

  try {
    const body = await req.json().catch(() => ({}));
    const result = await executeToolCall(toolName, body);

    const statusCode = result.success ? 200 : 400;
    return NextResponse.json(result, { status: statusCode });
  } catch (err) {
    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'EXECUTION_ERROR',
          message: err instanceof Error ? err.message : String(err),
        },
      },
      { status: 500 }
    );
  }
}

export async function GET(_req: NextRequest, { params }: RouteContext) {
  const { toolName } = params;
  const tool = TOOL_REGISTRY[toolName];

  if (!tool) {
    return NextResponse.json(
      { error: `Tool "${toolName}" not found.` },
      { status: 404 }
    );
  }

  return NextResponse.json({
    name: tool.name,
    displayName: tool.displayName,
    category: tool.category,
    description: tool.description,
  });
}
