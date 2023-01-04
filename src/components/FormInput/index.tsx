export interface IFormInputProps<T> {
    id: string;
    label: string;
    type: string;
    required?: boolean;
    placeholder?: string;
    value: string;
    errors?: string[];
    setValidated?: React.Dispatch<React.SetStateAction<boolean>>;
    onChange?: (event: React.ChangeEvent<T>) => void;
    onBlur?: (event: React.FocusEvent<T>) => void;
    onFocus?: (event: React.FocusEvent<T>) => void;
}

export default function FormInput(props: IFormInputProps<HTMLInputElement>): JSX.Element {
    return (
        <>
            <div className='Form-label-container'>
                <label htmlFor={props.id}>{props.label}</label>
                <span>
                    {
                        props.errors?.map(
                            (error, i) => <p className='Text-shadow'
                                key={`${props.label}-${i}`}>{error}</p> // NOSONAR
                        )
                    }
                </span>
            </div>

            <input {...props} />
        </>
    );
}
