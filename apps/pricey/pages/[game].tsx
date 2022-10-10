import { Typography } from '@mui/material';
import { Box } from '@mui/system';
import { GetStaticPaths, GetStaticProps, NextPage } from 'next';
import Head from 'next/head';
import { getGamesSortedByTime } from '../app';
import GameComponent, { GameComponentProps } from '../components/GameComponent';

const Page: NextPage<GameComponentProps> = (props) => {
    if (!props.game) {
        return <Typography>404</Typography>;
    }
    return (
        <Box>
            <Head>
                <meta property="og:url" content={`https://pricey.wtf/${props.game.id}`} key="ogurl" />
                <meta property="og:image" content={props.game.expensiveProduct.imageUrl} key="ogimage" />
            </Head>
            <GameComponent {...props} />
        </Box>
    );
};

export default Page;

export const getStaticPaths: GetStaticPaths = async () => {
    const games = (await import('../data/games.json')).default;

    const paths = games.map(x => {
        return {
            params: {
                game: x.id
            }
        };
    });

    return { paths, fallback: true };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
    if (!params) {
        return { notFound: true };
    }

    const games = await getGamesSortedByTime();

    const gameIndex = games.findIndex(x => x.id === params.game);

    if (gameIndex === -1) {
        return { notFound: true };
    }
    const previousGame = gameIndex > 0 ? games[gameIndex - 1] : null;

    // const games = (await import('../data/games.json')).default;

    // const game = games.find(x => {
    //     return x.id === gameId;
    // });

    return { props: { game: games[gameIndex], isTodaysGame: false, previousGame } };
};
