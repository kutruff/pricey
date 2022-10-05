/* eslint-disable @next/next/no-img-element */
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { useState, FC } from 'react';
import { Game, Product } from '../app';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';

const parseGuess = (value: string) => {
    const price = Number.parseFloat(value);
    return Number.isFinite(price) && price > 0 ? price : undefined;
};
const marginOfErrorToWin = 15;

const GameComponent: FC<{ game: Game }> = ({ game }) => {
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
        <Grid container
            spacing={1}
            direction="column"
            justifyContent="center"
            columns={1}>
            <Grid item>
                <Paper>
                    <Typography variant="h6" align='center'>{game.title}</Typography>
                </Paper>
            </Grid>
            <Grid item>
                <Paper>
                    <Grid container justifyContent="center">
                        <Grid item>
                            <Box component="img" sx={{ borderRadius: '10px', maxHeight: 200 }} alt="expensive product image" src={game.expensiveProduct.imageUrl} />
                        </Grid>
                    </Grid>
                </Paper>
            </Grid>
            <Grid item>
                {!hasWon ? (
                    <Paper>
                        {guesses.length === 0 ? (
                            <Typography>Guess the price within {marginOfErrorToWin}%!</Typography>
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
                    </Paper>
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
            </Grid>
        </Grid>
    );
};

export default GameComponent;

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
