import { EllipsisMenu } from '../Icons';
import './ListCard.css';

export interface IProduct {
    _id: string;
    barcode: string;
    name: string;
    source: {
        _id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
    },
    url: string;
    createdAt: Date;
    updatedAt: Date;
}

export interface IListCardProps {
    _id: string;
    key?: string;
    name: string;
    isDefault: boolean;
    createdAt: Date;
    updatedAt: Date;
    products: IProduct[];
}

function displayMostRecentDate(createdAt: Date, updatedAt: Date): string {
    const date = updatedAt > createdAt ? updatedAt : createdAt;
    // dd Mon yy format
    return date.toLocaleDateString('en-GB',
        { day: 'numeric', month: 'short', year: '2-digit' });
}

function DefaultIcon(): JSX.Element {
    return (
        <div className='List-card-default-icon'>
        </div>
    );
}

export default function ListCard(props: IListCardProps): JSX.Element {
    const { name, isDefault, createdAt, updatedAt, products, key } = props;

    const handleMenuClick = (): void => {
        console.log('Menu Clicked');
    };

    const numProducts = products?.length || 0;

    return (
        <article className='List-card' key={key}>
            <header className='List-card-header'>
                <span>
                    {isDefault && <DefaultIcon />}
                    <p>{displayMostRecentDate(createdAt, updatedAt)}</p>
                </span>
                <EllipsisMenu className='List-card-menu-icon' onClick={handleMenuClick} />
            </header>

            <span className='List-card-info-span'>
                <h2 className='List-card-name'>{name}</h2>
                <p>{numProducts}</p>
            </span>
        </article>
    );
}
