import { render, screen, fireEvent } from '@testing-library/react';
import { mocked } from 'jest-mock';
import { signIn, useSession } from 'next-auth/client';
import { useRouter } from 'next/router';

import { SubscribeButton } from '.';

jest.mock('next-auth/client');
const useSessionMocked = mocked(useSession);

jest.mock('next/router');

describe('SubscribeButton', () => {
  it('renders correctly', () => {
    useSessionMocked.mockReturnValueOnce([null, false]);

    const { debug } = render(<SubscribeButton />);

    expect(screen.getByText('Subscribe now')).toBeInTheDocument();
  });

  it('redirects user to sign in when not authenticated', () => {
    useSessionMocked.mockReturnValueOnce([null, false]);
    const signInMocked = mocked(signIn);

    const { debug } = render(<SubscribeButton />);

    const subscribeButton = screen.getByText('Subscribe now');
    fireEvent.click(subscribeButton);

    expect(signInMocked).toBeDefined();
    expect(signInMocked).toHaveBeenCalledTimes(1);
  });

  it('redirects to posts when user already has a subscuption', () => {
    const useRouterMocked = mocked(useRouter);
    const pushMocked = jest.fn();

    useSessionMocked.mockReturnValueOnce([
      {
        user: { name: 'John doe', email: 'john@example.com' },
        activeSubscription: 'fake-active-subscription',
        expires: 'fake-expires',
      },
      true,
    ]);

    useRouterMocked.mockReturnValueOnce({
      push: pushMocked,
    } as any);

    const { debug } = render(<SubscribeButton />);

    const subscribeButton = screen.getByText('Subscribe now');
    fireEvent.click(subscribeButton);

    expect(pushMocked).toBeDefined();
    expect(pushMocked).toHaveBeenCalledTimes(1);
    expect(pushMocked).toHaveBeenCalledWith('/posts');
  });
});
