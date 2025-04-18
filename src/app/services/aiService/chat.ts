import ModelClient, { isUnexpected } from '@azure-rest/ai-inference';
import { AzureKeyCredential } from '@azure/core-auth';
import type { GetChatCompletionsBodyParam } from '@azure-rest/ai-inference';

const token = process.env['GITHUB_TOKEN'];
const endpoint = 'https://models.inference.ai.azure.com';
const defaultModelName = 'gpt-4.1';

const client = ModelClient(endpoint, new AzureKeyCredential(token || ''));

// 根据外部传入的泛型参数，决定返回值类型，默认是 string
type ChatParms = {
  content: string;
  model?: string;
  responseType?: ResponseType;
};
type ChatResult<T> = T extends string ? string : T extends object ? T : string;
type ResponseType = 'json_object' | 'json_schema' | 'text';

export const chat = async <T>(params: ChatParms): Promise<ChatResult<T>> => {
  const { content, model = defaultModelName, responseType = 'text' } = params;
  const body: GetChatCompletionsBodyParam['body'] = {
    messages: [
      {
        role: 'user',
        content,
      },
    ],
    response_format: {
      type: responseType,
    },
    model,
  };
  const response = await client.path('/chat/completions').post({
    body,
  });

  if (isUnexpected(response)) {
    throw response.body.error;
  }

  const { choices } = response.body;
  if (!choices || choices.length === 0) {
    throw new Error('No choices returned from the model');
  }
  const { message } = choices[0];
  if (!message || !message.content) {
    throw new Error('No content returned from the model');
  }
  if (responseType === 'json_object') {
    try {
      return JSON.parse(message.content) as ChatResult<T>;
    } catch {
      throw new Error('Failed to parse JSON response');
    }
  } else if (responseType === 'json_schema') {
    try {
      return JSON.parse(message.content) as ChatResult<T>;
    } catch {
      throw new Error('Failed to parse JSON response');
    }
  }
  return message.content as ChatResult<T>;
};
