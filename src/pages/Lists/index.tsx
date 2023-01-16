import './Lists.css';
import { ListCard } from '../../components';
const listNames = ['My List', 'Watch Later', 'Liked Videos', 'History', 'Watched'];


export default function Lists() {
    return (
        <section className='My-lists'>
            <header className='My-list-header'>
                <h1>My <span>Lists</span></h1>
                <p>(15)</p>
            </header>


            <section className='List-container'>
                {listNames.map((listName, index) => {
                    return (
                        <ListCard
                            _id={String(index)}
                            key={String(index)}
                            name={listName}
                            isDefault={true}
                            createdAt={new Date()}
                            updatedAt={new Date()}
                            products={[]}
                        />
                    );
                })}
            </section>
        </section>
    );
}
