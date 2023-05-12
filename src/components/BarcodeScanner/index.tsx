import './styles.css';
import { useDeviceType } from '../../hooks';
import { locateBarcode } from '../../utils';
import { useEffect, useState } from 'react';
import { useMutation } from '@apollo/client';
import { ToastTypes } from '../../components';
import { IPayloads, IAction } from '../../types';
import { ADD_BARCODE_TO_LIST } from '../../utils/graphQL/mutations';
import { reducerActions, useToastMessageContext, IToastMessageContextType } from '../../providers';


export default function BarcodeScanner(props: {
    listId: string;
    cancel: boolean;
    setDetectedBarcode: React.Dispatch<React.SetStateAction<boolean | null>>;
    dispatch: React.Dispatch<IAction<IPayloads>>;
}) {

    const device: 'mobile' | 'desktop' = useDeviceType();
    const [source, setSource] = useState<string | null>('');
    const [manualInput, setManualInput] = useState<string>('');
    const [errorMessage, setErrorMessage] = useState<string>('');
    const [showManualEntry, setShowManualEntry] = useState<boolean>(false);
    const [validatedManualBarcode, setValidatedManualBarcode] = useState<boolean>(false);

    const [addBarcodeToList] = useMutation(ADD_BARCODE_TO_LIST);
    const toaster: IToastMessageContextType = useToastMessageContext();
    const { setDetectedBarcode, dispatch } = props;


    const manualButtonLabel: string = device === 'mobile' ?
        'Use Device Camera' : 'Upload Barcode Image';

    const handleCapture = (target: HTMLInputElement) => {
        if (target.files && target.files.length !== 0) {
            const file = target.files[0];
            const newUrl = URL.createObjectURL(file);
            setSource(newUrl);
        }
    };

    async function addToList(_barcode: string) {

        try {
            const { data } = await addBarcodeToList({
                variables: {
                    listId: props.listId,
                    barcode: _barcode
                }
            });

            // have to update the list's global state
            dispatch({
                type: reducerActions.ADD_ITEM_TO_LIST,
                payload: {
                    addToList: {
                        listId: props.listId,
                        item: data.addToList
                    }
                }
            });

            // show a success toast
            toaster.makeToast({
                type: ToastTypes.Success,
                message: `${_barcode} added to list successfully!`,
                title: 'Success!'
            });

            // this will tell the parent component that a barcode was detected
            // and close the view
            setDetectedBarcode(true);
            setSource('');

        } catch (error) {
            toaster.makeToast({
                type: ToastTypes.Error,
                message: `Could not add ${_barcode} to list!`,
                title: 'Error!'
            });
            setDetectedBarcode(false);
            setSource(null);
        }
    }

    function handleManualInput(e: React.ChangeEvent<HTMLInputElement>) {
        setManualInput(e.target.value);

        // test the input and set the error message if it's invalid
        if (!validateManualInput(e.target.value)) {
            if (e.target.value !== '') {
                setErrorMessage('Invalid barcode - UPC or EAN-13 only');
                setValidatedManualBarcode(false);
            } else {
                setErrorMessage('');
                setValidatedManualBarcode(true);
            }
        } else {
            setErrorMessage('');
            setValidatedManualBarcode(true);
        }
    }

    function validateManualInput(input: string) {
        // only accept UCP or EAN-13 barcodes
        const regex = /^[\d]{12,13}$/;
        return regex.test(input);
    }

    function handleManualSubmit() {
        if (validatedManualBarcode) {
            addToList(manualInput);
        }
    }

    useEffect(() => {
        if (source && source !== '') {

            const imageDimensions = document
                .querySelector('.Image-preview-container')?.getBoundingClientRect();

            // search for the barcode
            locateBarcode(source, {
                width: imageDimensions?.width || 600,
                height: imageDimensions?.height || 800,
            }).then(barcode => {

                addToList(barcode as string);
            }).catch(err => {
                setSource(null);
                setDetectedBarcode(null);
                setShowManualEntry(true);
            });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [source, props.listId]);


    return (
        <div className='Barcode-scanner-container'>
            <h2 className='Barcode-title'>Manual Barcode Scanner</h2>

            {source === null && (<h3 className='Barcode-not-found'>Barcode not detected!</h3>)}

            {source && (
                <div className='Image-preview-container'>
                    <img src={source} alt={'capture'} />
                </div>
            )}

            <input
                className='Capture-input'
                accept="image/*"
                id="icon-button-file"
                type="file"
                capture="environment"
                onChange={e => handleCapture(e.target)}
            />

            <label htmlFor="icon-button-file" className='Capture-label'>
                <button
                    onClick={() => {
                        const input = document.getElementById(
                            'icon-button-file'
                        ) as HTMLInputElement;
                        input.click();
                    }}
                    className='Capture-button'
                >
                    <span className='Text-shadow'>{manualButtonLabel}</span>
                </button>
            </label>

            {showManualEntry && (
                <div className='Manual-entry-container'>
                    <p className='Error-message Text-shadow'>
                        {errorMessage !== '' ? errorMessage : undefined}
                    </p>

                    <label className='Manual-entry-label Text-shadow'>Manually Enter Barcode</label>
                    <input
                        type='text'
                        placeholder='Enter a valid barcode'
                        className='Manual-entry-input'
                        value={manualInput}
                        onChange={handleManualInput}
                        onKeyDown={e => {
                            if (e.key === 'Enter') {
                                validatedManualBarcode && handleManualSubmit();
                            }
                        }}
                    />

                    <button
                        disabled={!validatedManualBarcode}
                        onClick={handleManualSubmit}
                        className='Action-button Manual-entry-button Text-shadow'>
                        {!validatedManualBarcode ? 'Enter a valid barcode' : 'Add Item to List'}
                    </button>
                </div>
            )}
        </div>
    );
}
