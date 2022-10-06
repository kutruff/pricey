/** @jsxImportSource @emotion/react */
import { Container, Box, CssBaseline, Toolbar } from '@mui/material';
import type { GetStaticPaths, GetStaticProps, NextPage } from 'next';
import { css } from '@emotion/react';
import Head from 'next/head';
import Image from 'next/image';
import styles from '../styles/Home.module.css';
import { flexVertical, flexGrowAndFlexChildrenVertical } from '../styling';
import { ThemeProvider } from '@mui/material/styles';
import theme from '../styling/theme';
import { AppToolbar } from '../components/AppToolbar';
import { Game } from '../app';
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
  const now = new Date().getTime();

  const games = (await import('../data/games.json')).default as Game[];

  let closestGame: Game | undefined = undefined;
  let closestGameTime = Number.MAX_SAFE_INTEGER;

  for (const current of games) {
    const currentGameTime = new Date(current.date).getTime();
    // console.log(current.date, currentGameTime);
    if (currentGameTime <= now && (!closestGame || currentGameTime > closestGameTime)) {
      closestGame = current;
      closestGameTime = currentGameTime;
    }
  }

  if (!closestGame) {
    closestGame = games[games.length - 1];
  }
  // console.log(closestGame);

  return closestGame ? { props: { game: closestGame } } : { notFound: true };
};