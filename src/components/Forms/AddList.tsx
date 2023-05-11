import { IList } from '../../types';
import FormInput from '../FormInput';
import { validators } from '../../utils';
import { useMutation } from '@apollo/client';
import { ToastTypes } from '../../components';
import React, { useState, useEffect } from 'react';
import { CREATE_NEW_LIST } from '../../utils/graphQL/mutations';
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

    const [createNewList, { error }] = useMutation(CREATE_NEW_LIST);

    const Toaster: IToastMessageContextType = useToastMessageContext();
    const { dispatch, globalState }: GlobalStoreContextType = useGlobalStoreContext();


    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
        const { id, value, checked } = event.target;
        if (id === 'isDefault') {
            setFormState({ ...formState, [id]: checked });
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

    const handleCreateNewList = async (): Promise<void> => {
        const { listName, isDefault }: IFormState = formState;

        try {
            const createdList = await createNewList({ variables: { name: listName, isDefault } });

            if (createdList && !error) {
                const data: IList = createdList.data.addList;

                if (!isDefault) {
                    dispatch({
                        type: reducerActions.ADD_NEW_LIST,
                        payload: { list: data }
                    });
                } else {
                    // A new default list was created, we need to update the global state
                    const existingDefaultList: IList | undefined = Object
                        .values(globalState.lists).find(list => list.isDefault);

                    const updatedExistingDefaultList = {
                        ...existingDefaultList,
                        isDefault: false
                    };
                    // set this list to not default in global state by dispatching an action
                    dispatch({
                        type: reducerActions.UPDATE_LIST,
                        payload: { list: { ...updatedExistingDefaultList as IList } }
                    });

                    // add the new list to global state
                    dispatch({
                        type: reducerActions.ADD_NEW_LIST,
                        payload: { list: data }
                    });
                }

                Toaster.makeToast({
                    message: 'List created successfully',
                    type: ToastTypes.Success,
                    title: 'Success'
                });
            } else {
                throw new Error('Error creating list');
            }
        } catch (error: any) {
            Toaster.makeToast({
                message: error.message,
                type: ToastTypes.Error,
                title: 'Error',
                timeOut: 9000
            });
        } finally {
            setShowAddForm(false);
        }
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
