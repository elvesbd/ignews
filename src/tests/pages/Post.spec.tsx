import { render, screen } from '@testing-library/react';
import { mocked } from 'jest-mock';
import { getSession } from 'next-auth/client';

import Post, { getServerSideProps } from '../../pages/posts/[slug]';
import { getPrismicClient } from '../../services/prismic';

const post = {
  slug: 'new-post',
  title: 'New Post',
  content: '<p>Post Content</p>',
  updatedAt: 'March, 10',
};

jest.mock('../../services/prismic');
jest.mock('next-auth/client');

describe('Post page', () => {
  it('renders correctly', () => {
    render(<Post post={post} />);

    expect(screen.getByText('New Post')).toBeInTheDocument();
    expect(screen.getByText('Post Content')).toBeInTheDocument();
    expect(screen.getByText('March, 10')).toBeInTheDocument();
  });

  it('redirects user if no subscription is found', async () => {
    const getSessionMocked = mocked(getSession);

    getSessionMocked.mockResolvedValueOnce({
      activeSubscription: null,
    });

    const result = await getServerSideProps({
      req: {
        cookies: {},
      },
      params: {
        slug: 'new-post',
      },
    } as any);

    expect(result).toEqual(
      expect.objectContaining({
        redirect: {
          destination: '/',
          permanent: false,
        },
      })
    );
  });

  it('loads initial data', async () => {
    const getSessionMocked = mocked(getSession);
    const getPrismicClientMocked = mocked(getPrismicClient);

    getSessionMocked.mockResolvedValueOnce({
      activeSubscription: 'fake-active-subscription',
    });

    getPrismicClientMocked.mockReturnValueOnce({
      getByUID: jest.fn().mockResolvedValueOnce({
        data: {
          title: [{ type: 'heading', text: 'New Post' }],
          content: [{ type: 'paragraph', text: 'Post content' }],
        },
        last_publication_date: '04-01-2022',
      }),
    } as any);

    const result = await getServerSideProps({
      req: {
        cookies: {},
      },
      params: {
        slug: 'new-post',
      },
    } as any);

    expect(result).toEqual(
      expect.objectContaining({
        props: {
          post: {
            slug: 'new-post',
            title: 'New Post',
            content: '<p>Post content</p>',
            updatedAt: '01 de abril de 2022',
          },
        },
      })
    );
  });
});
