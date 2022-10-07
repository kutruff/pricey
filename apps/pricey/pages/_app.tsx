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
function MyApp({ Component, pageProps, emotionCache = clientSideEmotionCache }: MyAppProps) {
  const router = useRouter();

  useEffect(() => {
    ga.pageview(router.pathname);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const handleRouteChange = (url: string) => {
      ga.pageview(url);
    };
    router.events.on('routeChangeComplete', handleRouteChange);
    return () => {
      router.events.off('routeChangeComplete', handleRouteChange);
    };
  }, [router.events]);

  return (
    <CacheProvider value={emotionCache}>
      <Head>
        <title>Pricey - A daily game to ridicule the rich.</title>
        <meta name="viewport" content="initial-scale=1, width=device-width" />
        <meta name="keywords" content="pricey, rich, game, guessing, products" />
        <meta name="description" content="Guess the price of ridiculous rich people products.  A new stupid game each day." />
        <meta property="og:type" content='website' key="ogType" />
        <meta property="og:title" content={`Pricey - A daily game to ridicule the rich.`} key="ogTitle" />
        <meta property="og:description" content='Guess the price of ridiculous rich people products.  A new stupid game each day.' key="ogDesc" />
        <meta property="twitter:domain" content="pricey.wtf" key="ogTwitterDomain" />
        <meta property="twitter:card" content="summary_large_image" key="ogTwitterCard" />
      </Head>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <AppToolbar onChangeTheme={() => {
          //TODO: implement      
        }} />
        <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
          <Toolbar />
          <Container maxWidth='sm' sx={{ flexGrow: 1, mt: 1, mb: 1 }}>
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
