import React from 'react';

export interface IIconProps {
    className?: string;
    onTouchStart?: (e: React.TouchEvent) => void;
    onTouchEnd?: (e?: React.SyntheticEvent) => void;
    onClick?: (e?: React.SyntheticEvent) => void;
}
