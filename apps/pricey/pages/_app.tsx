import { CacheProvider, EmotionCache, ThemeProvider } from '@emotion/react';
import { CssBaseline, Grid, Paper, Toolbar, Typography } from '@mui/material';
import { Box, Container } from '@mui/system';
import type { AppProps } from 'next/app';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { AppToolbar } from '../components/AppToolbar';
import '../styles/globals.css';
import createEmotionCache from '../styling/createEmotionCache';
import theme from '../styling/theme';

import { useEffect } from 'react';
import * as ga from '../analytics';

// Client-side cache, shared for the whole session of the user in the browser.
const clientSideEmotionCache = createEmotionCache();

export interface MyAppProps extends AppProps {
  emotionCache: EmotionCache
}
//TODO: setup emotion caching and server thing for _app and _document: https://github.com/mui/material-ui/blob/master/examples/nextjs/pages/_app.js
function MyApp({ Component, pageProps, emotionCache = clientSideEmotionCache }: MyAppProps) {
  const router = useRouter();

  useEffect(() => {
    console.log('page loaded:');
    ga.pageview(router.pathname);
  }, []);

  useEffect(() => {
    const handleRouteChange = (url: string) => {
      console.log('route changed:', url);
      ga.pageview(url);
    };
    //When the component is mounted, subscribe to router changes
    //and log those page views
    router.events.on('routeChangeComplete', handleRouteChange);

    // If the component is unmounted, unsubscribe
    // from the event with the `off` method
    return () => {
      router.events.off('routeChangeComplete', handleRouteChange);
    };
  }, [router.events]);

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
              <Grid item><Typography variant='subtitle2' color='gray'>Copyright 2022 by Kutruff LLC</Typography></Grid>
              <Grid item><Link color='grey' href="/privacy"><Typography variant='subtitle2' sx={{ textDecoration: 'underline' }} color='gray'>Privacy Policy</Typography></Link></Grid>
              <Grid item><Link color='grey' href="/terms"><Typography variant='subtitle2' sx={{ textDecoration: 'underline' }} color='gray'>Terms</Typography></Link></Grid>
            </Grid>
            <Grid container justifyContent='space-between' flexWrap={'nowrap'}>
              <Grid item><Typography variant='subtitle2' color={'gray'}>As an Amazon Associate I earn from qualifying purchases.</Typography></Grid>
            </Grid>
          </Paper>
        </Box>
      </ThemeProvider>
    </CacheProvider >
  );
}

export default MyApp;
