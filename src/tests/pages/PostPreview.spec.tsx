import { render, screen } from '@testing-library/react';
import { mocked } from 'jest-mock';
import { useSession } from 'next-auth/client';
import { useRouter } from 'next/router';

import Post, { getStaticProps } from '../../pages/posts/preview/[slug]';
import { getPrismicClient } from '../../services/prismic';

const post = {
  slug: 'new-post',
  title: 'New Post',
  content: '<p>Post Content</p>',
  updatedAt: 'March, 10',
};

jest.mock('../../services/prismic');
jest.mock('next-auth/client');
jest.mock('next/router');

const useSessionMocked = mocked(useSession);
const useRouterMocked = mocked(useRouter);

describe('Post preview page', () => {
  it('renders correctly', () => {
    useSessionMocked.mockReturnValueOnce([null, false]);

    render(<Post post={post} />);

    expect(screen.getByText('New Post')).toBeInTheDocument();
    expect(screen.getByText('Post Content')).toBeInTheDocument();
    expect(screen.getByText('March, 10')).toBeInTheDocument();
    expect(screen.getByText('Wanna continue reading?')).toBeInTheDocument();
  });

  it('redirects user to full post when user is sibscribed', async () => {
    const pushMocked = jest.fn();

    useSessionMocked.mockReturnValueOnce([
      { activeSubscription: 'fake-active-subscription' },
      false,
    ]);

    useRouterMocked.mockReturnValueOnce({
      push: pushMocked,
    } as any);

    render(<Post post={post} />);

    expect(pushMocked).toBeDefined();
    expect(pushMocked).toHaveBeenCalledTimes(1);
    expect(pushMocked).toHaveBeenCalledWith('/posts/new-post');
  });

  it('loads initial data', async () => {
    const getPrismicClientMocked = mocked(getPrismicClient);

    getPrismicClientMocked.mockReturnValueOnce({
      getByUID: jest.fn().mockResolvedValueOnce({
        data: {
          title: [{ type: 'heading', text: 'New Post' }],
          content: [{ type: 'paragraph', text: 'Post content' }],
        },
        last_publication_date: '04-01-2022',
      }),
    } as any);

    const result = await getStaticProps({
      params: {
        slug: 'new-post',
      },
    } as any);

    expect(result).toStrictEqual({
      props: {
        post: {
          slug: 'new-post',
          title: 'New Post',
          content: '<p>Post content</p>',
          updatedAt: '01 de abril de 2022',
        },
      },
      redirect: 1800,
    });
  });
});
