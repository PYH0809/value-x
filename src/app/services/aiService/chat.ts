import ModelClient, { isUnexpected } from '@azure-rest/ai-inference';
import { AzureKeyCredential } from '@azure/core-auth';
import type { GetChatCompletionsBodyParam } from '@azure-rest/ai-inference';

const token = process.env['GITHUB_TOKEN'];
const endpoint = 'https://models.inference.ai.azure.com';
const modelName = 'gpt-4.1';

const client = ModelClient(endpoint, new AzureKeyCredential(token || ''));

export async function chat({ content, model = modelName }: { content: string; model?: string }) {
  const body: GetChatCompletionsBodyParam['body'] = {
    messages: [
      {
        role: 'user',
        content,
      },
    ],
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
  return message.content;
}
