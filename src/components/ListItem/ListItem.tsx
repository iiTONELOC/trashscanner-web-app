import './ListItem.css';
import { IProduct } from '../../types';

export default function ListItem(props: IProduct) {

    const { _id, barcode, name, source, url, createdAt, updatedAt } = props;

    return (
        <li className="List-item">
            I am a list item
        </li>
    );
}