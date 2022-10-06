/** @jsxImportSource @emotion/react */
import type { GetStaticProps, NextPage } from 'next';
import { findClosestGameToTime, Game } from '../app';
import GameComponent, { GameComponentProps } from '../components/GameComponent';
import Head from 'next/head';
import { Box } from '@mui/system';


const Home: NextPage<GameComponentProps> = (props) => {
  return (
    <Box>
      <Head>
        <meta property="og:url" content={`https://pricey.wtf`} key="ogurl" />
        <meta property="og:image" content={props.game.expensiveProduct.imageUrl} key="ogimage" />
        <meta property="og:image" content={props.game.expensiveProduct.imageUrl} key="ogimage" />
      </Head>
      <GameComponent {...props} />
    </Box>
  );
};

export default Home;

export const getStaticProps: GetStaticProps = async () => {
  const games = (await import('../data/games.json')).default as Game[];

  const now = new Date().getTime();
  const closestGame = findClosestGameToTime(games, now);

  return closestGame ? { props: { game: closestGame, isTodaysGame: true } } : { notFound: true };
};


