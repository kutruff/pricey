import '../styles/globals.css';
import type { AppProps } from 'next/app';
import Head from 'next/head';
import { CacheProvider, EmotionCache, ThemeProvider } from '@emotion/react';
import { CssBaseline, Grid, Paper, Toolbar, Typography } from '@mui/material';
import { Box, Container } from '@mui/system';
import { AppToolbar } from '../components/AppToolbar';
import GameComponent from '../components/GameComponent';
import theme from '../styling/theme';
import createEmotionCache from '../styling/createEmotionCache';
import Link from 'next/link';

// Client-side cache, shared for the whole session of the user in the browser.
const clientSideEmotionCache = createEmotionCache();

export interface MyAppProps extends AppProps {
  emotionCache: EmotionCache
}
//TODO: setup emotion caching and server thing for _app and _document: https://github.com/mui/material-ui/blob/master/examples/nextjs/pages/_app.js
function MyApp({ Component, pageProps, emotionCache = clientSideEmotionCache }: MyAppProps) {
  return (
    <CacheProvider value={emotionCache}>
      <Head>
        <title>Pricey</title>
        <meta name="description" content="Price guessing game" />
        <meta name="viewport" content="initial-scale=1, width=device-width" />
      </Head>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <AppToolbar onChangeTheme={() => {
          //TODO: implement      
        }} />
        <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
          <Toolbar />
          <Container maxWidth='sm' sx={{ flexGrow: 1 }}>
            <Component {...pageProps} />
          </Container>
          <Paper >
            <Grid container justifyContent='space-between' flexWrap={'nowrap'}>
              <Grid item><Typography variant='subtitle2' color={'gray'}>Copyright 2022 by Kutruff LLC</Typography></Grid>
              <Grid item><Typography variant='subtitle2'><Link href="/privacy">Privacy Policy</Link></Typography></Grid>
              <Grid item><Typography variant='subtitle2'><Link href="/terms">Terms</Link></Typography></Grid>
            </Grid>
          </Paper>
        </Box>
      </ThemeProvider>
    </CacheProvider >
  );
}

export default MyApp;
