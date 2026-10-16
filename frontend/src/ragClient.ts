export interface DocumentSource {
  title: string;
  chunkId: string;
  similarityScore: number;
}

export interface StreamEvent {
  event: "token" | "citations" | "done" | "error";
  data: string;
}

export class StreamingRagClient {
  private apiBaseUrl: string;

  constructor(baseUrl: string = "http://localhost:8000") {
    this.apiBaseUrl = baseUrl;
  }

  public async *streamQuery(
    prompt: string,
    topK: number = 4
  ): AsyncGenerator<string, void, unknown> {
    const response = await fetch(`${this.apiBaseUrl}/api/v1/query/stream`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "text/event-stream",
      },
      body: JSON.stringify({ query: prompt, top_k: topK }),
    });

    if (!response.ok || !response.body) {
      throw new Error(`Failed to initiate streaming: HTTP ${response.status}`);
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder("utf-8");

    try {
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        yield chunk;
      }
    } finally {
      reader.releaseLock();
    }
  }
}