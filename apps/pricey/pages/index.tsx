/** @jsxImportSource @emotion/react */
import type { GetStaticProps, NextPage } from 'next';
import { findClosestGameToTime, Game, getGamesSortedByTime } from '../app';
import GameComponent, { GameComponentProps } from '../components/GameComponent';
import Head from 'next/head';
import { Box } from '@mui/system';
import { Typography } from '@mui/material';


const Home: NextPage<GameComponentProps> = (props) => {
  if (!props.game) {
    return <Typography>404</Typography>;
  }
  return (
    <Box>
      <Head>
        <meta property="og:url" content={`https://pricey.wtf`} key="ogurl" />
        <meta property="og:image" content={props.game.expensiveProduct.imageUrl} key="ogimage" />
      </Head>
      <GameComponent {...props} />
    </Box>
  );
};

export default Home;

export const getStaticProps: GetStaticProps = async () => {
  const games = await getGamesSortedByTime();

  // const games = (await import('../data/games.json')).default as Game[];

  const now = new Date().getTime();
  const { closestGame, closestGameIndex } = findClosestGameToTime(games, now);
  if (!closestGame) {
    return { notFound: true };
  }
  const previousGame = closestGameIndex > 0 ? games[closestGameIndex - 1] : null;
  return { props: { game: closestGame, isTodaysGame: true, previousGame } };
};


