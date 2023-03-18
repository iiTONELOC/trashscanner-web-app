export default function ItemCount(props: { count: number, onTouchEnd?: (e: React.TouchEvent) => void }): JSX.Element {
    const showQuantity: boolean = props.count > 1;
    const count = showQuantity ? ` x ${props.count}` : ' ';
    return (
        <>
            {count}
        </>

    );
}
