import './Forms.css';
import { useRouterContext } from '../../providers';
interface IProps {
    type: string;
    isValid: boolean;
    onAction?: (event: React.MouseEvent<HTMLButtonElement>) => void;
    label?: string;
}

export default function FormAction(props: IProps): JSX.Element {
    const { handleRouteChange } = useRouterContext();

    const label = props.type === 'signup' ? 'Log in' : 'Sign up';
    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();
        handleRouteChange(props.type === 'signup' ? '/login' : '/signup');
    };

    const buttonClass = props.isValid ? 'Action-button Text-shadow' : 'Text-shadow Disabled-button';
    return (
        <div className='Form-action-container'>
            <button
                onClick={props.onAction}
                disabled={!props.isValid}
                className={buttonClass}>
                {props.label || 'Submit'}
            </button>

            <p className='Text-shadow'>
                {props.type === 'signup' ? 'Already have an account?' : 'Don\'t have an account?'}
                <span
                    role={'navigation'}
                    aria-label={label}
                    onClick={handleClick}
                >
                    {` ${label}`}
                </span>
            </p>
        </div>
    );
}
