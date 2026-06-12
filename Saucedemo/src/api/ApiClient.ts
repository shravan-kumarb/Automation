import { APIRequestContext, APIResponse, request as playwrightRequest } from '@playwright/test';
import { getEnvConfig } from '../config/environments';
import { retry, NonRetryableError } from '../utils/retry';
import { logger } from '../utils/logger';
import { type Post, type CreatePostInput } from './schema';
import { title } from 'node:process';

/**
 * Throws a NonRetryableError for 4xx (deterministic client errors) and a
 * regular Error for 5xx/transient failures, so retry() only retries the latter
 */

function assertOk(response: APIResponse, label: string): void {
  if (response.ok()) return;
  const status = response.status();
  const messsage = `${label} failed: ${status}`;
  if (status >= 400 && status < 500) throw new NonRetryableError(messsage);
  throw new Error(messsage);
}

export class ApiClient {
  private context!: APIRequestContext;

  async init(): Promise<void> {
    const apiURL = getEnvConfig().apiURL;
    logger.info('Initializing API context', { apiURL });
    this.context = await playwrightRequest.newContext({
      baseURL: apiURL,
      extraHTTPHeaders: { 'Content-Type': 'application/json' },
    });
  }

  async dispose(): Promise<void> {
    await this.context.dispose();
  }

  async getPosts(): Promise<Post[]> {
    return retry(
      async () => {
        logger.info('GET /posts');
        const response = await this.context.get('/posts');
        assertOk(response, 'GET /posts');
        return (await response.json()) as Post[];
      },
      { label: 'GET /posts' },
    );
  }
  async getPostById(id: number): Promise<Post> {
    return retry(
      async () => {
        logger.info(`GET /posts/${id}`);
        const response = await this.context.get(`/posts/${id}`);
        assertOk(response, `GET /posts/${id}`);
        return (await response.json()) as Post;
      },
      { label: `GET /posts/${id}` },
    );
  }

  async createPost(data: CreatePostInput): Promise<Post> {
    return retry(
      async () => {
        logger.info('POST /posts', { title: data.title });
        const response = await this.context.post('/posts', { data });
        assertOk(response, 'POST/posts');
        return (await response.json()) as Post;
      },
      { label: 'POST /posts' },
    );
  }

  /**
   * Performs a raw GET without retry or throwing, so negative tests can
   * assert on status code(eg. 404) and response bodies directly.
   */

  async getRaw(path: string): Promise<APIResponse> {
    logger.info(`GET (raw) ${path}`);
    return this.context.get(path);
  }
}
