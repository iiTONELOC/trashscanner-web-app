import './styles.css';
import type { IIconProps } from '../types';
import EllipsisMenu from '../EllipsisMenu';

export default function DoubleEllipsisMenu(props: IIconProps): JSX.Element {
    return (
        <div
            className={'Double-ellipsis-menu'}
            onClick={props.onClick}
        >
            <EllipsisMenu className={props.className} />
            <EllipsisMenu className={props.className} />
        </div>
    );
}
