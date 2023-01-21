import './Spinner.css';

export interface ISpinnerProps {
    textColor?: string;
    label?: string;
}


export default function Spinner(props: ISpinnerProps): JSX.Element {
    const textColor = props.textColor || 'Spinner-green-text';
    const spinnerStyles = `Spinner ${textColor}`;

    return (
        <div className='Spinner-container'>
            <div className={spinnerStyles}>
            </div>
            <span className="Spinner-text">{props.label || 'Loading...'}</span>
        </div>
    );
}
