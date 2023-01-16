import Spinner from '../Spinner';
import { useEffect, useState } from 'react';

const SpinnerStyles = {
    greenText: 'Spinner-green-text',
    yellowText: 'Spinner-yellow-text',
    orangeText: 'Spinner-orange-text',
    redText: 'Spinner-red-text'
};


export default function Loading(): JSX.Element {
    const [spinnerColor, setSpinnerColor] = useState<string>(SpinnerStyles.greenText);

    const threeSecTimeout = () => setTimeout(() => {
        setSpinnerColor(SpinnerStyles.yellowText);
        sixSecTimeout();
    }, 3000);

    const sixSecTimeout = () => setTimeout(() => {
        setSpinnerColor(SpinnerStyles.orangeText);
        nineSecTimeout();
    }, 3000);

    const nineSecTimeout = () => setTimeout(() => {
        setSpinnerColor(SpinnerStyles.redText);
    }, 3000);

    const updateLoader = (): NodeJS.Timeout => threeSecTimeout();


    const clearTimeouts = (): void => {
        clearTimeout(threeSecTimeout());
        clearTimeout(sixSecTimeout());
        clearTimeout(nineSecTimeout());
    };

    useEffect(() => {
        updateLoader();
        return () => clearTimeouts();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <Spinner textColor={spinnerColor} />
    );
}
