import { render, screen } from '@testing-library/react';
import { mocked } from 'jest-mock';

import Posts, { getStaticProps } from '../../pages/posts';
import { getPrismicClient } from '../../services/prismic';

const posts = [
  {
    slug: 'new-post',
    title: 'New Post',
    excerpt: 'Post Excerpt',
    updatedAt: 'March, 10',
  },
];

jest.mock('../../services/prismic');

describe('Posts page', () => {
  it('renders correctly', () => {
    render(<Posts posts={posts} />);

    expect(screen.getByText('New Post')).toBeInTheDocument();
    expect(screen.getByText('Post Excerpt')).toBeInTheDocument();
    expect(screen.getByText('March, 10')).toBeInTheDocument();
  });

  it('loads initial data', async () => {
    const getPrismicClientMocked = mocked(getPrismicClient);

    render(<Posts posts={posts} />);

    getPrismicClientMocked.mockReturnValueOnce({
      query: jest.fn().mockResolvedValueOnce({
        results: [
          {
            uid: 'new-post',
            data: {
              title: [{ type: 'heading', text: 'New Post' }],
              content: [{ type: 'paragraph', text: 'Post excerpt' }],
            },
            last_publication_date: '04-01-2022',
          },
        ],
      }),
    } as any);

    const result = await getStaticProps({});
    expect(result).toEqual(
      expect.objectContaining({
        props: {
          posts: [
            {
              slug: 'new-post',
              title: 'New Post',
              excerpt: 'Post excerpt',
              updatedAt: '01 de abril de 2022',
            },
          ],
        },
      })
    );
  });
});
