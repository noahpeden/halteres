import { ReadableStream } from 'web-streams-polyfill/ponyfill';

export const getOpenAiRequestOptions = (
  { apiKey, model, ...restOfApiParams },
  messages,
  signal
) => ({
  headers: {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${apiKey}`,
  },
  method: 'POST',
  body: JSON.stringify({
    model,
    ...restOfApiParams,
    messages,
    stream: true,
  }),
  signal,
});

const CHAT_COMPLETIONS_URL = 'https://api.openai.com/v1/chat/completions';

const textDecoder = new TextDecoder('utf-8');

export const openAiStreamingDataHandler = async (
  requestOpts,
  onIncomingChunk,
  onCloseStream
) => {
  const beforeTimestamp = Date.now();

  const response = await fetch(CHAT_COMPLETIONS_URL, requestOpts);

  if (!response.ok) {
    throw new Error(
      `Network response was not ok: ${response.status} - ${response.statusText}`
    );
  }

  if (!response.body) {
    throw new Error('No body included in POST response object');
  }

  let content = '';
  let role = '';

  const reader = response.body.getReader();
  const stream = new ReadableStream({
    start(controller) {
      return pump();
      async function pump() {
        return reader.read().then(({ done, value }) => {
          if (done) {
            controller.close();
            return;
          }
          controller.enqueue(value);
          return pump();
        });
      }
    },
  });

  for await (const newData of stream) {
    const decodedData = textDecoder.decode(newData);
    const lines = decodedData.split(/(\n){2}/);
    const chunks = lines
      .map((line) => line.replace(/(\n)?^data:\s*/, '').trim())
      .filter((line) => line !== '' && line !== '[DONE]')
      .map((line) => JSON.parse(line));

    for (const chunk of chunks) {
      const contentChunk = (chunk.choices[0].delta.content ?? '').replace(
        /^`\s*/,
        '`'
      );
      const roleChunk = chunk.choices[0].delta.role ?? '';

      content = `${content}${contentChunk}`;
      role = `${role}${roleChunk}`;

      onIncomingChunk(contentChunk, roleChunk);
    }
  }

  onCloseStream(beforeTimestamp);

  return { content, role };
};

export default openAiStreamingDataHandler;
