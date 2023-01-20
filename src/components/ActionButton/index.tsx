import { useEffect, useState } from 'react';

export interface IActionButton {
    icon?: JSX.Element;
    text: string;
    onClick: (e?: React.SyntheticEvent) => void;
    className?: string;
}


export default function ActionButton(props: IActionButton): JSX.Element { //NOSONAR
    const { icon, text, onClick, className, ...rest }: IActionButton = props;
    const [isMounted, setIsMounted] = useState<boolean>(false);

    useEffect(() => {
        setIsMounted(true);
        return () => setIsMounted(false);
    }, []);

    return isMounted ? (
        <button
            className={`Action-button Text-shadow ${className}`}
            onClick={onClick}
            {...rest}
        >
            {icon}
            <span className='button-text'>{text}</span>
        </button>
    ) : (
        <></>
    );
}
