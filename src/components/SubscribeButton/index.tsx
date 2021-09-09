import { signIn, useSession } from 'next-auth/client';

import styles from './style.module.scss';

export function SubscribeButton() {
  const [session] = useSession();

  function handleSubscribe() {
    if (!session) {
      signIn('github');
      return;
    }
  }

  return (
    <button type="button" className={styles.subscribeButton}>
      Subscribe now
    </button>
  );
}

export default SubscribeButton;
