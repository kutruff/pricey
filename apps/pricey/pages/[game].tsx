import { display } from '@mui/system';
import { GetStaticProps, GetStaticPaths, GetServerSideProps, GetStaticPropsResult, NextPage } from 'next';
import { FC, useState } from 'react';
import { Game, Product } from '../app';
import GameComponent from '../components/GameComponent';

const Page: NextPage<{ game: Game }> = ({ game }) => {
    return <GameComponent game={game} />;
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

    const { game: gameId } = params;

    const games = (await import('../data/games.json')).default;

    const game = games.find(x => {
        return x.id === gameId;
    });

    return game ? { props: { game } } : { notFound: true };
};