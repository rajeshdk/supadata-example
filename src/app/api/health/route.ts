import { NextResponse } from 'next/server';
import { getApiCredentialsStatus } from '@/config/env';
import { TOOL_REGISTRY } from '@/lib/tools/registry';

export async function GET() {
  const credentials = getApiCredentialsStatus();

  return NextResponse.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    sdk: {
      package: '@supadata/js',
      configured: credentials.hasSupadata,
    },
    llm: {
      provider: 'openai-compatible',
      configured: credentials.hasOpenAI,
      model: credentials.model,
      customBaseUrl: credentials.hasCustomBaseUrl,
    },
    environment: {
      isMockMode: credentials.isMockMode,
    },
    availableTools: Object.keys(TOOL_REGISTRY).map((name) => ({
      name,
      displayName: TOOL_REGISTRY[name].displayName,
      category: TOOL_REGISTRY[name].category,
      description: TOOL_REGISTRY[name].description,
    })),
  });
}
