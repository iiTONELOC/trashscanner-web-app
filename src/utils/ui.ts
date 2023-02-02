import React from 'react';

const getCountAndReset = (e: React.TouchEvent): number => {

    const target = e?.currentTarget as any;

    // get the current tap count on the element
    const tapCount = target.tapCount || 0;
    // set the tap count to 1 if it's 0
    target.tapCount = tapCount + 1;
    // set the tap count to 0 after 300ms

    setTimeout(() => {
        target.tapCount = 0;
    }, 300);

    return tapCount;
};

const registerDoubleTap = (e: React.TouchEvent,
    callback: (e: React.Touch | React.MouseEvent) => void) => {

    const eve = e as any;
    const target = eve?.currentTarget;
    // get the current tap count on the element
    getCountAndReset(eve);

    if (target.tapCount === 2) {
        callback(e as any);
    }
};

const registerSingleTap = (e: React.TouchEvent,
    callback: (e: React.Touch | React.MouseEvent | React.SyntheticEvent) => void) => {
    const eve = e as any;
    const target = eve?.currentTarget;

    getCountAndReset(eve);
    // if the tap count is 1, call the callback
    if (target.tapCount === 1) {
        callback(e as any);
    }
};

const UI = {
    registerDoubleTap,
    registerSingleTap
};

export default UI;
