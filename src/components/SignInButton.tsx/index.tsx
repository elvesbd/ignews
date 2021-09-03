import { FaGithub } from 'react-icons/fa';
import { FiX } from 'react-icons/fi';

import styles from './styles.module.scss';

interface SubscribeButtonProps {
  priceId: string;
}

export function SignInButton({ priceId }: SubscribeButtonProps) {
  const isUserLoggedIn = true;

  return isUserLoggedIn ? (
    <button className={styles.signInButton} type="button">
      <FaGithub color="#84d361" />
      Elves Brito
      <FiX color="#737380" className={styles.closedIcon} />
    </button>
  ) : (
    <button className={styles.signInButton} type="button">
      <FaGithub color="#eba417" />
      Sign in with Github
    </button>
  );
}
