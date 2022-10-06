import { GetStaticPaths, GetStaticProps, NextPage } from 'next';
import { Game } from '../app';
import GameComponent, { GameComponentProps } from '../components/GameComponent';

const Page: NextPage<GameComponentProps> = (props) => {
    return (
        <GameComponent {...props} />
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

    const { game: gameId } = params;

    const games = (await import('../data/games.json')).default;

    const game = games.find(x => {
        return x.id === gameId;
    });

    return game ? { props: { game, isTodaysGame: false } } : { notFound: true };
};