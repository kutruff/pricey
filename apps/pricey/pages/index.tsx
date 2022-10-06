/** @jsxImportSource @emotion/react */
import type { GetStaticProps, NextPage } from 'next';
import { findClosestGameToTime, Game } from '../app';
import GameComponent from '../components/GameComponent';

interface HomeProps {
  game: Game;
}

const Home: NextPage<HomeProps> = ({ game }) => {
  return (
    <GameComponent game={game} />
  );
};

export default Home;

export const getStaticProps: GetStaticProps = async () => {
  const games = (await import('../data/games.json')).default as Game[];

  const now = new Date().getTime();
  const closestGame = findClosestGameToTime(games, now);

  return closestGame ? { props: { game: closestGame } } : { notFound: true };
};


