/**
 * Type definitions for the JSONPlaceholder Post resource.
 */
export interface Post {
  userId: number;
  id: number;
  title: string;
  body: string;
}

/**
 * Payload accepted when creating a post.
 */
export interface CreatePostInput {
  title: string;
  body: string;
  userId: number;
}
