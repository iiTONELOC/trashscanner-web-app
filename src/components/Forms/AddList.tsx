import FormInput from '../FormInput';
import { validators } from '../../utils';
import { UpcDb, IUpcDb } from '../../utils/APIs';
import React, { useState, useEffect } from 'react';
import { IApiResponse, IList } from '../../types';
import { ToastTypes } from '../../components'
import {
    useGlobalStoreContext,
    reducerActions, useToastMessageContext,
    GlobalStoreContextType, IToastMessageContextType
} from '../../providers';


export interface IAddListFormProps {
    showAddForm: boolean;
    setShowAddForm: (show: boolean) => void;
}

interface IFormState {
    listName: string;
    isDefault: boolean;
}

const defaultFormState: IFormState = {
    listName: '',
    isDefault: false
};

const db: IUpcDb = new UpcDb();

const validateInput = (input: string): string[] => {
    const errors: string[] = [];
    if (!input) {
        errors.push('List name is required');
    }
    if (input.length > 50) {
        errors.push('List name must be less than 50 characters');
    }
    if (input.length < 3) {
        errors.push('List name must be at least 3 characters');
    }
    if (!validators.isAlphaNumeric(input)) {
        errors.push('List name must be alpha numeric');
    }
    return errors;
};


export default function AddListForm(props: IAddListFormProps): JSX.Element { // NOSONAR
    const { setShowAddForm, showAddForm }: IAddListFormProps = props;
    const [isMounted, setIsMounted] = useState<null | boolean>(null);
    const [isFormValid, setIsFormValid] = useState<boolean>(false);
    const [listNameErrors, setListNameErrors] = useState<string[]>([]);
    const [formState, setFormState] = useState<IFormState>(defaultFormState);

    const Toaster: IToastMessageContextType = useToastMessageContext();
    const { dispatch }: GlobalStoreContextType = useGlobalStoreContext();


    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
        const { id, value } = event.target;
        if (id === 'isDefault') {
            setFormState({ ...formState, [id]: Boolean(value) });
        } else {
            setFormState({ ...formState, [id]: value });
            handleFormValidation(value);
        }
    };

    const handleFormValidation = (value: string): void => {
        const errors: string[] = validateInput(value);
        setListNameErrors(errors);
        if (errors.length === 0) {
            setListNameErrors([]);
            setIsFormValid(true);
        } else {
            setIsFormValid(false);
        }
    };

    const handleCreateNewList = (): void => {
        const { listName, isDefault }: IFormState = formState;

        db.createList(listName, isDefault).then((response: IApiResponse<IList>) => {
            if (response.status === 200 || response) {
                const data = response?.data || response;

                dispatch({
                    type: reducerActions.ADD_NEW_LIST,
                    payload: { list: data as IList }
                });
                Toaster.makeToast({
                    message: 'List created successfully',
                    type: ToastTypes.Success,
                    title: 'Success'
                });
            } else {
                throw new Error('Error creating list');
            }
        }).catch((error: Error) => {
            Toaster.makeToast({
                message: 'Error creating list',
                type: ToastTypes.Error,
                title: 'Error',
                timeOut: 9000
            });
        }).finally(() => {
            setShowAddForm(false);
        });
    };

    useEffect(() => {
        setIsMounted(true);
        return () => {
            setIsMounted(false);
            setFormState(defaultFormState);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);


    return isMounted ? (
        <>
            <section className='Lists-add-list-form-container'>
                <form className='Lists-add-list-form'>
                    <FormInput
                        id='listName'
                        label='List Name'
                        value={formState.listName}
                        type='text'
                        onChange={handleInputChange}
                        onBlur={handleInputChange}
                        errors={listNameErrors}
                        placeholder='Enter a name for your list'
                        required
                    />

                    <FormInput
                        id='isDefault'
                        label='Set as Default'
                        value={formState.isDefault as unknown as string}
                        onChange={handleInputChange}
                        onBlur={handleInputChange}
                        type='checkbox'
                        required={false}
                    />
                </form>
                <div className='Action-button-container Lists-add-list'>
                    {!showAddForm ? (
                        <button
                            aria-label={'Add List'}
                            tabIndex={0}
                            onClick={() => setShowAddForm(!showAddForm)}
                            className='Action-button Text-shadow'
                        >
                            + Add List
                        </button>
                    ) : (
                        <div className='Lists-add-form-buttons'>
                            <button
                                aria-label={'Cancel'}
                                tabIndex={0}
                                onClick={() => setShowAddForm(!showAddForm)}
                                className='Button Text-shadow Lists-cancel-add'
                            >
                                Cancel
                            </button>

                            <button
                                aria-label={'Create List'}
                                tabIndex={0}
                                onClick={isFormValid ? handleCreateNewList : () => { }}
                                disabled={!isFormValid}
                                className={`Action-button Text-shadow ${!isFormValid ? 'Disabled' : ''}`}
                            >
                                Create List
                            </button>
                        </div>
                    )}
                </div>
            </section>


        </>
    ) : <></>;
}
