import './ListCard.css';
import { IList } from '../../types';
import { EllipsisMenu } from '../Icons';
import { useRouterContext } from '../../providers';



function displayMostRecentDate(createdAt: Date, updatedAt: Date): string {
    const date = updatedAt > createdAt ? updatedAt : createdAt;
    // dd Mon yy format
    return new Intl.DateTimeFormat('en-GB', { day: 'numeric', month: 'short', year: '2-digit' })
        .format(new Date(date));
}

function DefaultIcon(): JSX.Element {
    return (
        <div className='List-card-default-icon'>
        </div>
    );
}

export default function ListCard(props: IList): JSX.Element {
    const { name, isDefault, createdAt, updatedAt, products, _id } = props;
    const { handleRouteChange } = useRouterContext();

    const handleMenuClick = (e?: React.SyntheticEvent): void => {
        e?.stopPropagation();
        e?.preventDefault();
        console.log('Card Menu clicked');
    };

    const numProducts = products?.length || 0;

    return (
        <article
            className='List-card'
            onClick={() => handleRouteChange(`/list/${_id}`)}
        >

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
