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

const pageContainerStyle = css({
  height: '100vh',
}, flexVertical);


interface HomeProps {
  game: Game;
}

const Home: NextPage<HomeProps> = ({ game }) => {
  console.log('home');
  console.log(game);
  return (
    <div>
      <Head>
        <title>Pricey</title>
        <meta name="description" content="Price guessing game" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Box css={pageContainerStyle}>
          <AppToolbar onChangeTheme={() => {
            //TODO: implement      
          }} />
          <Toolbar />
          <Box css={flexGrowAndFlexChildrenVertical} sx={{ overflowY: 'auto' }}>
            <Container css={flexGrowAndFlexChildrenVertical}>
              <GameComponent game={game} />
            </Container>
          </Box>
        </Box>
      </ThemeProvider>
    </div>
  );
};

export default Home;

export const getStaticProps: GetStaticProps = async () => {
  // console.log(params);
  // if (!params) {
  //   return { notFound: true };
  // }

  // const { game: gameId } = params;
  const now = new Date().getTime();
  console.log(now);
  const games = (await import('../data/games.json')).default as Game[];

  // games.sort((a, b) => {
  //   const aDate = new Date(a.date).getTime();
  //   const bDate = new Date(b.date).getTime();
  //   return aDate - bDate;
  // });

  let closestGame: Game | undefined = undefined;
  let closestGameTime = Number.MAX_SAFE_INTEGER;

  for (const current of games) {
    const currentGameTime = new Date(current.date).getTime();
    console.log(current.date, currentGameTime);
    if (currentGameTime <= now && (!closestGame || currentGameTime > closestGameTime)) {
      closestGame = current;
      closestGameTime = currentGameTime;
    }
  }

  if (!closestGame) {
    closestGame = games[games.length - 1];
  }
  console.log(closestGame);

  return closestGame ? { props: { game: closestGame } } : { notFound: true };
};