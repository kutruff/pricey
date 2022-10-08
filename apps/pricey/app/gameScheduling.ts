import { Game } from '.';

export interface TimeOffset {
    hours?: number,
    minutes?: number,
    seconds?: number,
    milliseconds?: number,
}

export const switchToNextGameTimeOfDayUtc: TimeOffset = {
    hours: 4,
    minutes: 0,
    seconds: 0,
};

export function getDateAtUtcTimeOfDay(basisDate: Date, utcTimeOfDay: TimeOffset): Date {
    const year = basisDate.getUTCFullYear();
    const month = basisDate.getUTCMonth();
    const date = basisDate.getUTCDate();

    return new Date((Date.UTC(year, month, date, utcTimeOfDay.hours || 0, utcTimeOfDay.minutes || 0, utcTimeOfDay.seconds || 0, utcTimeOfDay.milliseconds || 0)));
}

const SECONDS_PER_DAY = 1000 * 24 * 60 * 60;

export function getNextUpdateTime(): Date {
    let updateTime = getDateAtUtcTimeOfDay(new Date(), switchToNextGameTimeOfDayUtc);
    if (updateTime.getUTCHours() > (switchToNextGameTimeOfDayUtc.hours || 0) &&
        updateTime.getUTCMinutes() > (switchToNextGameTimeOfDayUtc.minutes || 0) &&
        updateTime.getUTCSeconds() > (switchToNextGameTimeOfDayUtc.seconds || 0)) {
        updateTime = new Date(updateTime.getTime() + SECONDS_PER_DAY);
    }

    return getDateAtUtcTimeOfDay(updateTime, switchToNextGameTimeOfDayUtc);
}

export function getLastUpdateTime(): Date {
    const todayUnixTime = Date.now();
    return getDateAtUtcTimeOfDay(new Date(todayUnixTime), switchToNextGameTimeOfDayUtc);
}

export function findClosestGameToTime(games: Game[], now: number): Game | undefined {
    let closestGame: Game | undefined = undefined;
    let closestGameTime = Number.MAX_SAFE_INTEGER;

    for (const current of games) {
        const currentGameTime = new Date(current.date).getTime();

        if (currentGameTime <= now && (!closestGame || currentGameTime > closestGameTime)) {
            closestGame = current;
            closestGameTime = currentGameTime;
        }
    }

    if (!closestGame) {
        closestGame = games[games.length - 1];
    }
    return closestGame;
}