/* eslint-disable @next/next/no-img-element */
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { useState, FC, useMemo } from 'react';
import { Game, Product } from '../app';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import { Button, FormControl, FormGroup, TextField } from '@mui/material';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import InputAdornment from '@mui/material/InputAdornment';

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

    const formatter = useMemo(() => new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 0, // (this suffices for whole numbers, but will print 2500.10 as $2,500.1)
        maximumFractionDigits: 0, // (causes 2500.99 to be printed as $2,501)
    }), []);
    const handleChange = (event: any) => {
        const value = event.target.value;
        console.log(value);
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
                <Grid container justifyContent="center">
                    <Grid item>
                        <Box component="img" sx={{ borderRadius: '10px', maxHeight: 200 }} alt="expensive product image" src={game.expensiveProduct.imageUrl} />
                    </Grid>
                </Grid>
            </Grid>
            <Grid item>
                {!hasWon ? (
                    <Paper>
                        <Typography variant='body2'>
                            {guesses.length === 0 ?
                                `Guess the ridiculous price within ${marginOfErrorToWin}%!`
                                : guessDifference > 0 ? 'Price is lower.' : 'Price is higher.'
                            }
                        </Typography>
                        <Grid container alignItems="center" sx={{ mt: 1 }}>
                            <Grid item>
                                <FormControl error={hasError} size='small'>
                                    <InputLabel htmlFor="outlined-adornment-amount">Amount</InputLabel>
                                    <OutlinedInput
                                        id="outlined-adornment-amount"
                                        value={currentGuess}
                                        onChange={handleChange}
                                        startAdornment={<InputAdornment position="start">$</InputAdornment>}
                                        label="Amount"
                                    />
                                </FormControl>
                            </Grid>
                            <Grid item>
                                <Button variant='contained' onClick={handleSubmit} >Guess</Button>
                            </Grid>
                        </Grid>

                        <List>
                            {guesses.map((x, index) =>
                                <ListItem disablePadding key={index}>
                                    {x < game.expensiveProduct.price ? <>⬆️</> : <>⬇️</>} {formatter.format(x)}
                                </ListItem>)}
                        </List>
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
        </Grid >
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
