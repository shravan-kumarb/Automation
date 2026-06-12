import { test, expect } from '@playwright/test';
import { ApiClient } from '@api/apiClient';
import { postIds, newPost } from '@data/apiData';
import { type } from 'node:os';

test.describe('Post API @api @smoke', () => {
  let api: ApiClient;

  test.beforeAll(async () => {
    api = new ApiClient();
    await api.init();
  });

  test.afterAll(async () => {
    await api.dispose();
  });

  test('Get all posts', async () => {
    const posts = await api.getPosts();
    expect(posts.length).toBeGreaterThan(0);
  });

  test('Get post by ID', async () => {
    const post = await api.getPostById(postIds.existing);
    expect(post.id).toBe(postIds.existing);
  });

  test('Create new post', async () => {
    const response = await api.createPost(newPost);
    expect(response.title).toBe(newPost.title);
  });
});

test.describe('Post API field validation @api @regression', () => {
  let api: ApiClient;
  test.beforeAll(async () => {
    api = new ApiClient();
    await api.init();
  });
  test.afterAll(async () => {
    await api.dispose();
  });
  test('post fields have the correct types', async () => {
    const post = await api.getPostById(postIds.existing);
    expect(typeof post.id).toBe('number');
    expect(typeof post.userId).toBe('number');
    expect(typeof post.title).toBe('string');
    expect(typeof post.body).toBe('string');
  });
});

test.describe('Post API negative scenarios @api @schema @regression', () => {
  let api: ApiClient;

  test.beforeAll(async () => {
    api = new ApiClient();
    await api.init();
  });

  test.afterAll(async () => {
    await api.dispose();
  });

  test('requesting a non-existent post returns 404', async () => {
    const response = await api.getRaw(`/posts/${postIds.nonExistent}`);
    expect(response.status()).toBe(404);
  });

  test('an invalid (non-numeric) post id is not found', async () => {
    const response = await api.getRaw(`/posts/${postIds.invalid}`);
    expect(response.ok()).toBe(false);
    expect(response.status()).toBeGreaterThanOrEqual(404);
  });

  test('getPostById throws for a non-existent post', async () => {
    await expect(api.getPostById(postIds.nonExistent)).rejects.toThrow(/failed: 404/);
  });
});
