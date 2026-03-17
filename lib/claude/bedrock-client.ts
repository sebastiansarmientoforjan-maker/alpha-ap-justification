/**
 * AWS Bedrock Client for Claude API
 *
 * Uses AWS Bedrock instead of direct Anthropic API
 */

import {
  BedrockRuntimeClient,
  InvokeModelCommand,
} from "@aws-sdk/client-bedrock-runtime";

interface ClaudeMessage {
  role: "user" | "assistant";
  content: string;
}

interface ClaudeRequest {
  model: string;
  max_tokens: number;
  temperature?: number;
  system?: string;
  messages: ClaudeMessage[];
}

interface ClaudeResponse {
  content: Array<{
    type: string;
    text: string;
  }>;
  stop_reason: string;
  usage: {
    input_tokens: number;
    output_tokens: number;
  };
}

export class BedrockClaudeClient {
  private client: BedrockRuntimeClient;
  private modelId: string;

  constructor() {
    this.client = new BedrockRuntimeClient({
      region: process.env.AWS_REGION || "us-east-1",
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
      },
    });

    // Map model names to Bedrock model IDs
    this.modelId = "us.anthropic.claude-sonnet-4-5-20250929-v1:0";
  }

  async createMessage(request: ClaudeRequest): Promise<ClaudeResponse> {
    // Format request for Bedrock
    const bedrockRequest = {
      anthropic_version: "bedrock-2023-05-31",
      max_tokens: request.max_tokens,
      temperature: request.temperature || 0.7,
      system: request.system,
      messages: request.messages,
    };

    const command = new InvokeModelCommand({
      modelId: this.modelId,
      contentType: "application/json",
      accept: "application/json",
      body: JSON.stringify(bedrockRequest),
    });

    try {
      const response = await this.client.send(command);

      // Parse response
      const responseBody = JSON.parse(
        new TextDecoder().decode(response.body)
      );

      return responseBody as ClaudeResponse;
    } catch (error) {
      console.error("Bedrock API error:", error);
      throw error;
    }
  }

  /**
   * Format response to match Anthropic SDK structure
   */
  formatResponse(response: ClaudeResponse) {
    return {
      content: response.content,
      stop_reason: response.stop_reason,
      usage: response.usage,
    };
  }
}

/**
 * Get Claude client (Bedrock or direct Anthropic SDK)
 */
export function getClaudeClient() {
  const useBedrock = process.env.USE_BEDROCK === "true";

  if (useBedrock) {
    console.log("🔷 Using AWS Bedrock for Claude API");
    return new BedrockClaudeClient();
  } else {
    console.log("🟣 Using direct Anthropic SDK");
    // Fallback to Anthropic SDK (if needed)
    const Anthropic = require("@anthropic-ai/sdk");
    return new Anthropic.default({
      apiKey: process.env.ANTHROPIC_API_KEY,
    });
  }
}
