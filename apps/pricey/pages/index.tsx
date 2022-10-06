/** @jsxImportSource @emotion/react */
import type { GetStaticProps, NextPage } from 'next';
import { findClosestGameToTime, Game } from '../app';
import GameComponent, { GameComponentProps } from '../components/GameComponent';

const Home: NextPage<GameComponentProps> = (props) => {
  return (
    <GameComponent {...props} />
  );
};

export default Home;

export const getStaticProps: GetStaticProps = async () => {
  const games = (await import('../data/games.json')).default as Game[];

  const now = new Date().getTime();
  const closestGame = findClosestGameToTime(games, now);

  return closestGame ? { props: { game: closestGame, isTodaysGame: true } } : { notFound: true };
};


