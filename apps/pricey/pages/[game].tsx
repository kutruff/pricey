import { display } from '@mui/system';
import { GetStaticProps, GetStaticPaths, GetServerSideProps, GetStaticPropsResult, NextPage } from 'next';
import { FC, useState } from 'react';
import { Game, Product } from '../app';

const parseGuess = (value: string) => {
    const price = Number.parseFloat(value);
    return Number.isFinite(price) && price > 0 ? price : undefined;
};
const marginOfErrorToWin = 15;

const Page: NextPage<{ game: Game }> = ({ game }) => {
    const [guesses, setGuesses] = useState<number[]>([]);
    const [currentGuess, setCurrentGuess] = useState('');
    const [hasError, setHasError] = useState(false);
    const [guessDifference, setGuessDifference] = useState(0);
    const [hasWon, setHasWon] = useState(false);
    const [score, setScore] = useState(0);
    const [totalGuesses, setTotalGuesses] = useState(0);

    const handleChange = (event: any) => {
        const value = event.target.value;
        setCurrentGuess(value);
        setHasError(value && !parseGuess(value));
    };

    const handleSubmit = (event: any) => {
        event.preventDefault();
        const value = parseGuess(currentGuess);
        if (value) {
            setCurrentGuess('');
            setTotalGuesses(x => x + 1);

            const difference = value - game.expensiveProduct.price;
            setGuessDifference(difference);
            const absDifference = Math.abs(difference);
            const errorAmount = absDifference / game.expensiveProduct.price;
            const hasWon = errorAmount * 100 < marginOfErrorToWin;
            setHasWon(hasWon);
            // if(!hasWon) {
            //     setScore(x => x + absDifference);
            // }

            setGuesses([...guesses, value]);
        }
    };

    if (!game) {
        return <div>404</div>;
    }

    return (
        <div>
            <div>
                {game.title}
            </div>

            <div style={{ display: 'flex', justifyContent: 'center' }}>
                <img style={{ maxHeight: 200 }} src={game.expensiveProduct.imageUrl} />
            </div>
            {!hasWon ? (
                <div>
                    {guesses.length === 0 ? (
                        <div>Guess the price within {marginOfErrorToWin}%!</div>
                    ) : (
                        <div>{guessDifference > 0 ? 'Price is lower.' : 'Price is higher.'}</div>
                    )}
                    <form onSubmit={handleSubmit}>
                        <label>
                            Price: {' '}
                            <input type="text" value={currentGuess} onChange={handleChange} />
                        </label>
                        <input type="submit" value="Guess Price" />
                    </form>
                    <div>
                        {guesses.map((x, index) =>
                            <div key={index}>
                                {x < game.expensiveProduct.price ? <>⬆️</> : <>⬇️</>} ${x}
                            </div>)}
                    </div>
                </div>
            ) : (
                <div>
                    <div>
                        <a href={game.expensiveProduct.storePageUrl}>{game.expensiveProduct.seller}</a>
                        <div>{game.expensiveProduct.name}</div>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'center' }}>
                        <div>
                            <h3>Close enough!</h3>
                            <div>Actual price: ${game.expensiveProduct.price}</div>
                            <GameResults guesses={guesses} />
                        </div>
                    </div>

                    <NormalProduct product={game.normalProduct} />
                </div>
            )}
        </div>
    );
};

export default Page;

interface GameResultsProps {
    guesses: number[],
}

export const GameResults: FC<GameResultsProps> = ({ guesses }) => {
    const minGuess = guesses.reduce((acc, current) => Math.min(acc, current), Number.MAX_VALUE);
    const maxGuess = guesses.reduce((acc, current) => Math.max(acc, current), Number.MIN_VALUE);

    const squares = [];
    for (let i = 0; i < guesses.length - 1; i++) {
        squares.push(<div key={i}>🟥</div>);
    }
    squares.push(<div key={guesses.length}>🟩</div>);
    return (
        <div>
            <div style={{ display: 'flex' }}>{squares}</div>
            <div>guess range: ${minGuess} - ${maxGuess}</div>
        </div>
    );
};

export interface NormalProductProps {
    product: Product,
}

export const NormalProduct: FC<NormalProductProps> = ({ product }) => {
    return (
        <div >
            <h2>Normal product</h2>
            <a href={product.storePageUrl}>
                <div>
                    {product.name}
                </div>
                Click to see price on Amazon.
                <div style={{ display: 'flex', justifyContent: 'center' }}>
                    <img style={{ maxHeight: 200 }} src={product.imageUrl} />
                </div>
            </a>
        </div>
    );
};

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