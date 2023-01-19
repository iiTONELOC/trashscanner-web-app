import { useState, useEffect } from 'react';
import { formatter } from '../../utils';
import {
    CloseIcon, WarningIcon, ErrorIcon,
    SuccessIcon, InfoIcon
} from '../Icons';

export enum ToastTypes {
    Success = 'success',
    Error = 'error',
    Warning = 'warning',
    Info = 'info'
}

export interface IToastProps {
    message: string;
    type: ToastTypes;
    onClose?: () => void;
}

const toastClassNames = {
    [ToastTypes.Success]: 'Toast-success',
    [ToastTypes.Error]: 'Toast-error',
    [ToastTypes.Warning]: 'Toast-warning',
    [ToastTypes.Info]: 'Toast-info'
};

const toastIcons = {
    [ToastTypes.Success]: <SuccessIcon className='Toast-status-icon' />,
    [ToastTypes.Error]: <ErrorIcon className='Toast-status-icon' />,
    [ToastTypes.Warning]: <WarningIcon className='Toast-status-icon' />,
    [ToastTypes.Info]: <InfoIcon className='Toast-status-icon' />
};


const formatDateTime = (date: Date): string => {
    return new Intl.DateTimeFormat('en-US', {
        year: 'numeric',
        month: 'numeric',
        day: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
        hour12: true
    }).format(new Date(date));
};

export default function Toast(props: { // NOSONAR
    message: string,
    type: ToastTypes,
    title?: string,
    onClose?: () => void,
}): JSX.Element {
    const [isMounted, setIsMounted] = useState<boolean>(false);

    useEffect(() => {
        setIsMounted(true);
        return () => setIsMounted(false);
    }, []);

    const onClose = (e?: React.SyntheticEvent): void => {
        e?.stopPropagation();
        e?.preventDefault();
        const toastEl = document.querySelector('.Toast');
        // add the fadeout class to the toast
        toastEl?.classList.add('Toast-fadeout');

        if (props.onClose) {
            setTimeout(() => {
                props.onClose && props.onClose();
            }, 350);
        }
    };

    const title = props.title !== '' ? props.title : props.type;

    return isMounted ? (
        <article className={`Toast ${toastClassNames[props.type]}`}>
            <section className='Toast-body'>
                <CloseIcon
                    className='Toast-close-button'
                    onClick={onClose} />
                {toastIcons[props.type]}

                <div className='Toast-text-container'>
                    <h2 className='Toast-heading'>
                        <strong>
                            {formatter.headingNormalizer(String(title))} !
                        </strong>
                    </h2>
                    <p className='Toast-message'>
                        {props.message}
                    </p>
                    <p className='Toast-timestamp'>
                        {formatDateTime(new Date())}
                    </p>
                </div>
            </section>
        </article>
    ) : <></>;
}
