import Quagga, { QuaggaJSResultObject_CodeResult } from '@ericblade/quagga2';

/**
 * From:
 * https://github.com/ericblade/quagga2-react-example/blob/master/src/components/Scanner.js
 */
function getMedian(arr: (number | undefined)[]) {
    if (arr !== undefined) {
        arr.sort((a, b) => (a || 0) - (b || 0));
        const half = Math.floor(arr.length / 2);
        if (arr.length % 2 === 1) {
            return arr[half];
        }
        // @ts-ignore
        return (arr[half - 1] + arr[half]) / 2;
    }

    return 0;
}

function getMedianOfCodeErrors(decodedCodes: QuaggaJSResultObject_CodeResult['decodedCodes']) {
    const errors = decodedCodes.filter(x => x.error !== undefined).map(x => x.error);
    const medianOfErrors = getMedian(errors);
    return medianOfErrors;
}

/**
 * End borrowed code
 */

// decode images as a promise
export const locateBarcode = (
    image?: string | Uint8Array | Buffer,
    size?: {
        width: number;
        height: number;
    }
) => new Promise((resolve, reject) => {
    Quagga.decodeSingle({
        decoder: {
            readers: ['code_128_reader', 'ean_reader']
        },
        inputStream: {
            size: 640,
            willReadFrequently: false,
            singleChannel: false,
        },
        locate: true,
        locator: {
            halfSample: false,
            patchSize: 'medium',
        },
        src: image
    }, function (result) {
        if (result?.codeResult) {
            // get the error rate of the barcode
            const err = getMedianOfCodeErrors(result.codeResult.decodedCodes);
            // if the error rate is less than 15% then we have a good barcode
            if (err && err < 0.2) {
                resolve(result.codeResult.code);
            };
        } else {
            reject('not detected');
        }
    });
});

