import {randomToken} from '@utils/dataGenerator';

/** Post ids used across the API specs. */
export const postIds = {
    existing:1,
    nonExistent: 999999,
    invalid :'not-a-valid-id',
}

/** Payload for the create-post scenario. */
export interface NewPost{
    title:string;
    body:string;
    userId:number;
}

export const newPost: NewPost={
    title:'Playwright API test',
    body:'Hello World',
    userId:  1,
};

/** Expected number of posts returned by the collection endpoint. */
export const expectedPostCount = 100;

/**Generate a unique post payload for dynamic-data scenarios. */
export function generatePost(overrides: Partial<NewPost> ={}):NewPost{
    return {
        title:`Playwright API test ${randomToken()}`,
        body:`Generated body ${randomToken(12)}`,
        userId:1,
        ...overrides,
    };
}