import { useState, useEffect } from 'react';

// Minimum number of pixels to move horizontally to register movement
// we can adjust this to make the swipe more or less sensitive
const MIN_X_DIFF = 0;

export interface ISwipeConfig {
    acceptableClasses: string[];
    swipeDirection: 'horizontal' | 'vertical' | 'both';
}

export enum Direction {
    Up = 'up',
    Down = 'down',
    Left = 'left',
    Right = 'right',
    None = 'none'
}

export interface DirectionInfo {
    direction: Direction;
    deltaT?: number;
    xDiff: number;
    yDiff: number;
    speed?: number;
};

export interface IUseSwipe {
    handleTouchStart: (e: React.TouchEvent) => void;
    handleTouchEnd: (e: React.TouchEvent) => void;
    handleTouchMove: (e: React.TouchEvent) => DirectionInfo;
}

function determineSwipeDirection(
    x1: number,
    x2: number,
    y1: number,
    y2: number
): { direction: Direction, xDiff: number, yDiff: number } {
    const xDiff = x2 - x1;
    const yDiff = y2 - y1;

    const dirInfo: DirectionInfo = {
        direction: Direction.None,
        deltaT: 0,
        xDiff,
        yDiff
    };

    if (Math.abs(xDiff) > Math.abs(yDiff)) {
        if (xDiff > 0) {
            dirInfo.direction = Direction.Right;
        } else {
            dirInfo.direction = Direction.Left;
        }

        dirInfo.xDiff = xDiff;
        dirInfo.yDiff = yDiff;
    }

    // only calculate vertical if the y values are not 0.
    // We really only care about the horizontal direction
    if (y1 !== 0 && y2 !== 0) {
        if (yDiff > 0) {
            dirInfo.direction = Direction.Down;
        } else {
            dirInfo.direction = Direction.Up;
        }

        dirInfo.xDiff = xDiff;
        dirInfo.yDiff = yDiff;
    }

    return dirInfo;
}


export default function useSwipe(props: ISwipeConfig): {
    handleTouchStart: (e: React.TouchEvent) => void,
    handleTouchEnd: (e: React.TouchEvent) => void,
    handleTouchMove: (e: React.TouchEvent) => DirectionInfo
} {
    const [watchDirection, setWatchDirection] = useState<'horizontal' | 'vertical' | 'both'>('both');
    const [acceptableClassNames, setAcceptableClassNames] = useState<string[]>([]);
    const [isMounted, setIsMounted] = useState<boolean>(false);

    const { swipeDirection, acceptableClasses }: ISwipeConfig = props;

    useEffect(() => {
        setIsMounted(true);
        return (): void => {
            setIsMounted(false);
        };
    }, []);

    useEffect(() => {
        if (isMounted) {
            setAcceptableClassNames(acceptableClasses);
            setWatchDirection(swipeDirection);
        }
    }, [isMounted, acceptableClasses, swipeDirection]);

    // check targetClassList to see if it contains any of the acceptableClassNames
    const containsAcceptableClass = (targetClassList: DOMTokenList): boolean => {
        let result = false;

        for (let i = 0; i < targetClassList.length; i++) { // NOSONAR
            if (acceptableClassNames.includes(targetClassList[i])) {
                result = true;
                break;
            }
        }
        return result;
    };

    // attach touchStartTimestamp and touchStartX to the target to track
    // horizontal movement and time taken to complete the movement
    const handleTouchStart = (e: React.TouchEvent): void => {
        const target: HTMLElement = e.target as HTMLElement;
        if (containsAcceptableClass(target.classList)) {
            target.setAttribute('touchStartTimestamp', `${Date.now()}`);
            target.setAttribute('touchStartX', `${e.touches[0].clientX}`);
        }
        // reset the auth timeout in the
    };

    // Remove extra attributes from the target
    const handleTouchEnd = (e: React.TouchEvent): void => {
        const target: HTMLElement = e.target as HTMLElement;
        if (containsAcceptableClass(target.classList)) {
            target.removeAttribute('touchStartTimestamp');
            target.removeAttribute('touchStartX');
        }
    };


    // Determines the movement direction and distance
    const handleTouchMove = (e: React.TouchEvent): DirectionInfo => {
        const target: HTMLElement = e.target as HTMLElement;
        // default is no movement
        const dirInfo = {
            direction: Direction.None,
            deltaT: 0,
            xDiff: 0,
            yDiff: 0,
            speed: 0
        };

        if (containsAcceptableClass(target.classList)) {
            // Timings
            const previousTime = parseInt(target.getAttribute('touchStartTimestamp') as string, 10);
            const currentTime = Date.now();

            // Position
            const touchStartX: number = parseInt(target.getAttribute('touchStartX') as string, 10);
            const touchCurrentX: number = e.touches[0].clientX;

            const directionMoved: DirectionInfo = determineSwipeDirection(touchStartX, touchCurrentX, 0, 0);

            // update the deltaT with the time it took to move
            dirInfo.deltaT = currentTime - previousTime;

            // calculate the speed in milliseconds
            dirInfo.speed = Math.abs(directionMoved.xDiff) / dirInfo.deltaT * 1000;

            // Do not care about vertical movement
            if (watchDirection === 'horizontal') {
                // if we moved past our minimum xDiff, then we can register the movement
                if (directionMoved.direction === Direction.Left
                    && Math.abs(directionMoved.xDiff) > MIN_X_DIFF) {
                    dirInfo.direction = Direction.Left;
                    dirInfo.xDiff = directionMoved.xDiff;
                    dirInfo.yDiff = directionMoved.yDiff;
                } else if (directionMoved.direction === Direction.Right
                    && Math.abs(directionMoved.xDiff) > MIN_X_DIFF) {
                    dirInfo.direction = Direction.Right;
                    dirInfo.xDiff = directionMoved.xDiff;
                    dirInfo.yDiff = directionMoved.yDiff;
                } else {
                    dirInfo.direction = Direction.None;
                    dirInfo.xDiff = 0;
                    dirInfo.yDiff = 0;
                }
            }
        }
        return dirInfo;
    };

    return {
        handleTouchStart,
        handleTouchEnd,
        handleTouchMove
    };
}
