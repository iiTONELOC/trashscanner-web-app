import './EditableContent.css';
import FormInput from '../FormInput';
// import { ToastTypes } from '../Toast';
import { useState, useEffect } from 'react';
// import { Authentication } from '../../utils/APIs';
// import { useUserContext, useToastMessageContext } from '../../providers';


// EDITABLE FIELDS
/**
 * Product name
 * List name
 */

export enum EditableContentTypes {
    ProductName = 'product-name',
    ListName = 'list-name'
}

interface FormState {
    [EditableContentTypes.ProductName]: string | null;
    [EditableContentTypes.ListName]: string | null;
}

const defaultFormState: FormState = {
    [EditableContentTypes.ProductName]: '',
    [EditableContentTypes.ListName]: ''
};

export default function EditableContent(props: { // NOSONAR
    contentType: EditableContentTypes;
    defaultContent: string;
}): JSX.Element {
    const [formState, setFormState] = useState<FormState>(defaultFormState);
    const [isMounted, setIsMounted] = useState<boolean | null>(false);
    const { contentType, defaultContent } = props;

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
        const { value } = e.target;
        const safeString = value.replace(/</g, '&lt;').replace(/>/g, '&gt;');
        setFormState({ ...formState, [contentType]: safeString });
    };

    useEffect(() => {
        setIsMounted(true);
        setFormState({ ...formState, [contentType]: defaultContent });
        return () => {
            setIsMounted(false);
            setFormState(defaultFormState);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return isMounted ? (
        <div className='Editable-content-container'>
            <FormInput
                id={contentType}
                label={contentType}
                type='textarea'
                onChange={handleChange}
                value={formState[contentType] || ''}
            />
        </div>
    ) : <></>;
};
