import '../styles/globals.css';
import type { AppProps } from 'next/app';
import Head from 'next/head';
import { CacheProvider, EmotionCache, ThemeProvider } from '@emotion/react';
import { CssBaseline, Toolbar } from '@mui/material';
import { Container } from '@mui/system';
import { AppToolbar } from '../components/AppToolbar';
import GameComponent from '../components/GameComponent';
import theme from '../styling/theme';
import createEmotionCache from '../styling/createEmotionCache';

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
        {/* <Box css={pageContainerStyle}> */}
        <AppToolbar onChangeTheme={() => {
          //TODO: implement      
        }} />        
        <Container>
          <Component {...pageProps} />
        </Container>
        {/* </Box> */}
      </ThemeProvider>
    </CacheProvider>
  );
}

export default MyApp;
