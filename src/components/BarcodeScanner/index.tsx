import './styles.css';
import { locateBarcode } from '../../utils';
import { useEffect, useState } from 'react';
import { ToastTypes } from '../../components';
import { UpcDb, IUpcDb } from '../../utils/APIs';
import { IPayloads, IAction, IList } from '../../types';
import { reducerActions, useToastMessageContext, IToastMessageContextType } from '../../providers';

const upcDb: IUpcDb = new UpcDb();

export default function BarcodeScanner(props: {
    listId: string;
    cancel: boolean;
    setDetectedBarcode: React.Dispatch<React.SetStateAction<boolean | null>>;
    dispatch: React.Dispatch<IAction<IPayloads>>;
}) {
    const [source, setSource] = useState<string | null>('');
    const [manualInput, setManualInput] = useState<string>('');
    const [errorMessage, setErrorMessage] = useState<string>('');
    const [showManualEntry, setShowManualEntry] = useState<boolean>(false);
    const [validatedManualBarcode, setValidatedManualBarcode] = useState<boolean>(false);

    const toaster: IToastMessageContextType = useToastMessageContext();
    const { setDetectedBarcode, dispatch } = props;


    const handleCapture = (target: HTMLInputElement) => {
        if (target.files && target.files.length !== 0) {
            const file = target.files[0];
            const newUrl = URL.createObjectURL(file);
            setSource(newUrl);
        }
    };

    function addToList(_barcode: string) {
        return upcDb.addProductToList(props.listId, _barcode).then(res => {

            // have to update the list's global state
            dispatch({
                type: reducerActions.SET_LISTS,
                payload: {
                    lists: [res.data as IList]
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
        }).catch(err => {
            console.log('Error adding item to list: ', err);
            setDetectedBarcode(false);
            setSource(null);
        });
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
                console.log('Error Detecting Barcode: ', err);
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
                style={{ display: 'none' }}
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
                    <span className='Text-shadow'>Take Picture</span>
                </button>
            </label>

            {showManualEntry && (
                <div className='Manual-entry-container'>
                    <p className='Error-message Text-shadow'>
                        {errorMessage !== '' ? errorMessage : undefined}
                    </p>

                    <input
                        type='text'
                        placeholder='Enter Barcode'
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
