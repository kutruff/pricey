/** @jsxImportSource @emotion/react */
import { Button, Grid, Paper, Typography } from '@mui/material';
import type { GetStaticProps, NextPage } from 'next';
import Link from 'next/link';
import { event } from '../analytics';
import { Game, getLastUpdateTime } from '../app';

interface HomeProps {
  games: Game[];
}

const ArchivePage: NextPage<HomeProps> = ({ games }) => {
  const buttons = games.map((x, index) => (
    <Grid item key={index}>
      <Link href={`/${x.id}`} passHref onClick={() => event({ action: 'archive_visit_game', params: { event_label: x.id, event_category: 'links' } })}>
        <Button variant="contained">{index + 1}</Button>
      </Link>
    </Grid>
  ));
  return (
    <Paper sx={{ p: 2 }}>
      <Typography variant="h5" align='center'>
        Previous Products
      </Typography>
      <Grid container spacing={1} sx={{ mt: 1, justifyContent: 'center' }} >
        {buttons}
      </Grid>
    </Paper >
  );
};

export default ArchivePage;

export const getStaticProps: GetStaticProps = async () => {
  let games = (await import('../data/games.json')).default as Game[];

  const lastUpdateTime = getLastUpdateTime().getTime();
  games = games.filter(x => new Date(x.date).getTime() < lastUpdateTime);

  games.sort((a, b) => Date.parse(a.date) - Date.parse(b.date));

  return { props: { games } };
};