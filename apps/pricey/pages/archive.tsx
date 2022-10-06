/** @jsxImportSource @emotion/react */
import { Button, Grid, Paper, Typography } from '@mui/material';
import type { GetStaticProps, NextPage } from 'next';
import Link from 'next/link';
import { Game } from '../app';

interface HomeProps {
  games: Game[];
}

const Home: NextPage<HomeProps> = ({ games }) => {
  const buttons = games.map((x, index) => (
    <Grid item key={index} >
      <Link href={`/${x.id}`} passHref>
        <Button variant="contained">{index + 1}</Button>
      </Link>
    </Grid>
  ));
  return (
    <Paper sx={{ p: 2 }}>
      <Typography variant="h5" align='center'>
        Previous Products
      </Typography>
      <Grid container spacing={1} sx={{ mt: 1 }}>
        {buttons}
      </Grid>
    </Paper >
  );
};

export default Home;

export const getStaticProps: GetStaticProps = async () => {
  const now = new Date();

  let games = (await import('../data/games.json')).default as Game[];
  games = games.filter(x => new Date(x.date).getTime() <= now.getTime());
  games.sort((a, b) => Date.parse(a.date) - Date.parse(b.date));

  return { props: { games } };
};