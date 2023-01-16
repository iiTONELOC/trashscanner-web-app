import './Lists.css';
import { IList } from '../../types';
import { suspender } from '../../utils';
import { UpcDb } from '../../utils/APIs';
import { ListCard } from '../../components';

const upcDb = new UpcDb();

const userListData = suspender(upcDb.getMyLists());

export default function Lists() {
    const listData = userListData.read();
    const { data } = listData;
    const numLists = data?.length || 0;


    return (
        <section className='My-lists'>
            <header className='My-list-header'>
                <h1>My <span>Lists</span></h1>
                <p>({numLists})</p>
            </header>


            <section className='List-container'>

                {data && data.map((list: IList, index: number) => {
                    const key = `${index}`;
                    const props = { ...list, key };
                    return (
                        <ListCard
                            {...props}
                        />
                    );
                })}

            </section>
        </section>
    );
}
