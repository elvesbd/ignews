import Head from 'next/head';

import { SubscribeButton } from '../components/SubscribeButton';
import styles from './home.module.scss';

export default function Home() {
  return (
    <>
      <Head>
        <title>Home</title>
      </Head>

      <main className={styles.contentContainer}>
        <section className={styles.hero}>
          <span>👏 Hey, welcome</span>
          <h1>
            News about the <span>React </span>world.
          </h1>
          <p>
            Get acess to all the publication <br />
            <span>for $9.90 month</span>
          </p>

          <SubscribeButton />
        </section>

        <img src="/images/girl.svg" alt="girl coding" />
      </main>
    </>
  );
}
