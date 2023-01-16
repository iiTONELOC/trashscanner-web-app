import './Spinner.css';

export interface ISpinnerProps {
    textColor?: string;
}


export default function Spinner(props: ISpinnerProps): JSX.Element {
    const textColor = props.textColor || 'Spinner-green-text';
    const spinnerStyles = `Spinner ${textColor}`;

    return (
        <div className='Spinner-container'>
            <div className={spinnerStyles}>
            </div>
            <span className="Spinner-text">Loading...</span>
        </div >
    );
}
