import './Forms.css';
import { useEffect, useState } from 'react';
import Loading from '../Loading';
import { useNavigate } from 'react-router-dom';

interface IProps {
    type: string;
    isValid: boolean;
    onAction?: (event: React.MouseEvent<HTMLButtonElement>) => void;
    label?: string;
    hasError?: boolean;
}

export default function FormAction(props: IProps): JSX.Element {
    const [isClicked, setIsClicked] = useState<boolean>(false);
    const handleRouteChange = useNavigate();

    const isValid: boolean = props.isValid && !isClicked;
    const label: string = props.type === 'signup' ? 'Log in' : 'Sign up';
    const buttonClass: string = isValid ? 'Action-button Text-shadow' : 'Text-shadow Disabled-button';

    const handleClick = (event: React.MouseEvent<HTMLButtonElement>): void => {
        event.preventDefault();
        handleRouteChange(props.type === 'signup' ? '/login' : '/signup');
    };

    const actionWrapper = (event: React.MouseEvent<HTMLButtonElement>): void => {
        event.preventDefault();
        event.stopPropagation();

        if (props.onAction) {
            setIsClicked(true);
            props.onAction(event);
        }
    };

    useEffect(() => {
        if (props.hasError) {
            setIsClicked(false);
        }
    }, [props.hasError]);


    return (
        <div className='Form-action-container'>
            <button
                onClick={actionWrapper}
                disabled={!props.isValid}
                className={buttonClass}
                onTouchStart={() => setIsClicked(!isClicked)}
            >
                {isClicked ? <Loading label='Processing...' /> : props.label || 'Submit'}

            </button>

            <p className='Text-shadow'>
                {props.type === 'signup' ? 'Already have an account?' : 'Don\'t have an account?'}
                <span
                    aria-label={label}
                    onClick={handleClick}
                >
                    {` ${label}`}
                </span>
            </p>
        </div>
    );
}
