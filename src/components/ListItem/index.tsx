import './ListItem.css';
import { useState } from 'react';
import { IProduct } from '../../types';
import { formatter } from '../../utils';
import { DoubleEllipsisMenu } from '../Icons';


function ListStatus(): JSX.Element {
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

export default function ListItem(props: { product: IProduct, duplicateCount?: number }) {
    const { _id, barcode, name } = props.product;

    return (
        <li className="List-item-product">
            <span className='List-product-span'>
                <ListStatus />
                <p className='List-name-barcode'>{formatter.headingNormalizer(name)} - {barcode[0]}</p>
            </span>

            <span className='List-product-span-controls'>
                <p>x {props.duplicateCount}</p>
                <DoubleEllipsisMenu
                    className='List-item-menu-icon'
                />
            </span>
        </li>
    );
}
