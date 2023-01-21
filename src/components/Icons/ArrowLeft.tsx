import type { IIconProps } from './types';

export default function ArrowLeft(props: IIconProps): JSX.Element {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none" viewBox="0 0 24 24"
            strokeWidth={1.5} stroke="currentColor"
            onClick={props.onClick || (() => { })}
            className={props.className}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
        </svg>
    );
}

