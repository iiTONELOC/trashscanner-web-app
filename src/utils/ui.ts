import React from 'react';

const registerDoubleTap = (e: React.TouchEvent,
    callback: (e: React.Touch | React.MouseEvent) => void) => {
    const time = new Date().getTime();
    const delta = time - (e.currentTarget as any).lastTouch || 0;
    const delay = 300;
    if (delta < delay && delta > 1) {
        callback(e as any);
    }
    (e.currentTarget as any).lastTouch = time;
};

const registerSingleTap = (e: React.TouchEvent,
    callback: (e: React.Touch | React.MouseEvent) => void) => {

    const time = new Date().getTime();
    const delta = time - (e.currentTarget as any).lastTouch || 0;
    const delay = 300;
    if (delta > delay || delta === 0) {
        callback(e as any);
    }

    (e.currentTarget as any).lastTouch = time;
};


const UI = {
    registerDoubleTap,
    registerSingleTap
};

export default UI;
