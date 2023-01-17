import './ListItem.css';
import { useState } from 'react';
import { IProduct } from '../../types';
import { formatter } from '../../utils';
import { DoubleEllipsisMenu } from '../Icons';
import IncreaseQuantityButton from './IncreaseQuantityButton';
import DecreaseQuantityButton from './DecreaseQuantityButton';


function RenderListStatus(): JSX.Element {
    const [isCompleted, setIsCompleted] = useState<boolean>(false);

    const handleClick = () => {
        // TODO: Update the product status in the database
        setIsCompleted(!isCompleted);
    };

    return (
        <div className={isCompleted ? 'List-item-status completed' : 'List-item-status'}
            onClick={handleClick}>
        </div>
    );
}

function RenderCount(props: { count: number }): JSX.Element {
    const showQuantity = props.count > 1;
    return (
        <p>{showQuantity ? `x ${props.count}` : ' '}</p>
    );
}

export default function ListItem(props: { product: IProduct, duplicateCount?: number }) {
    const [isQuantityHovered, setIsQuantityHovered] = useState<boolean>(false);
    const { _id, barcode, name } = props.product;

    // get the default list id from the url
    const listId = window.location.pathname.split('/')[2];

    return (
        <li className="List-item-product">

            <span className='List-product-span'>
                <RenderListStatus />
                <p className='List-name-barcode'>{formatter.headingNormalizer(name)} - {barcode[0]}</p>
            </span>

            <span className='List-product-span-controls'
                onMouseEnter={() => setIsQuantityHovered(true)}
                onMouseLeave={() => setIsQuantityHovered(false)}
            >
                <div className='List-count'>
                    <RenderCount count={props.duplicateCount || 1} />

                    {isQuantityHovered && (
                        <div className='List-add-remove-btn-container'>
                            <IncreaseQuantityButton listId={listId} barcode={barcode[0]} />
                            <DecreaseQuantityButton listId={listId} productId={_id} />
                        </div>
                    )}
                </div>

                <DoubleEllipsisMenu
                    className='List-item-menu-icon'
                />
            </span>
        </li>
    );
}
