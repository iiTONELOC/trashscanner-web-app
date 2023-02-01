import React from 'react';

const getCountAndReset = (e: React.TouchEvent): number => {
    // get the current tap count on the element
    const tapCount = (e?.currentTarget as any).tapCount || 0;
    // set the tap count to 1 if it's 0
    (e?.currentTarget as any).tapCount = tapCount + 1;
    // set the tap count to 0 after 300ms

    const target = e?.currentTarget as any;
    setTimeout(() => {
        target.tapCount = 0;
    }, 300);

    return tapCount;
};

const registerDoubleTap = (e: React.TouchEvent,
    callback: (e: React.Touch | React.MouseEvent) => void) => {

    // get the current tap count on the element
    getCountAndReset(e);

    if ((e?.currentTarget as any).tapCount === 2) {
        callback(e as any);
    }
};

const registerSingleTap = (e: React.TouchEvent,
    callback: (e: React.Touch | React.MouseEvent | React.SyntheticEvent) => void) => {

    getCountAndReset(e);
    // if the tap count is 1, call the callback
    if ((e?.currentTarget as any).tapCount === 1) {
        callback(e as any);
    }
};

const UI = {
    registerDoubleTap,
    registerSingleTap
};

export default UI;
