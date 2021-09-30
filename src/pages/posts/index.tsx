import Prismic from '@prismicio/client';
import { GetStaticProps } from 'next';
import Head from 'next/head';

import { getPrismicClient } from '../../services/prismic';
import styles from './styles.module.scss';

export default function posts() {
  return (
    <>
      <Head>
        <title>Posts | Ebnews</title>
      </Head>

      <main className={styles.container}>
        <div className={styles.posts}>
          <a href="">
            <time> 30 de setembro de 2021</time>
            <strong>Titulo do post</strong>
            <p>Conteúdo do post</p>
          </a>
          <a href="">
            <time> 30 de setembro de 2021</time>
            <strong>Titulo do post</strong>
            <p>Conteúdo do post</p>
          </a>
          <a href="">
            <time> 30 de setembro de 2021</time>
            <strong>Titulo do post</strong>
            <p>Conteúdo do post</p>
          </a>
        </div>
      </main>
    </>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  const prismic = getPrismicClient();

  const response = await prismic.query(
    [Prismic.Predicates.at('document.type', 'publication')],
    {
      fetch: ['publication.title', 'publication.content'],
      pageSize: 100,
    }
  );
  return {
    props: {},
  };
};

//console.log(JSON.stringify(response, null, 2));
