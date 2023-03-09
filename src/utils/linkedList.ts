export interface IMyNode<T> {
    value: T;
    next: (IMyNode<T> | null);
}

export interface ILinkedList<T> {
    head: (IMyNode<T> | null);
    length: number;
    add(value: T): void;
    size(): number;
    removeAt(value: number): void;
    toObject(): { [key: number]: T };
    print(): void;
}

export class MyNode<T> implements IMyNode<T> {
    value: T;
    next: (IMyNode<T> | null);

    constructor(value: T) {
        this.value = value;
        this.next = null;
    }
}

export class LinkedList<T> implements ILinkedList<T> {
    head: (IMyNode<T> | null);
    length: number;

    constructor(obj?: ILinkedList<T>) {
        this.head = null;
        this.length = 0;

        if (obj) {
            this.head = obj.head;
            this.length = obj.length;
        }
    }

    add(value: T): void {
        const node = new MyNode(value);
        if (!this.head) {
            this.head = node;
            this.length++;
            return;
        }

        let current = this.head;
        while (current.next) {
            current = current.next;
        }

        current.next = node;
        this.length++;
    }

    removeAt(index: number) {
        // remove a node from the list at a specific index
        // if the index is out of bounds, return null
        if (index < 0 || index >= this.length) {
            return null;
        }

        // if the index is 0, remove the head
        if (index === 0) {
            const temp = this.head;
            this.head = this?.head?.next || null;
            this.length--;
            return temp;
        }

        // if the index is greater than 0, find the node at the index
        // and remove it

        let current: (IMyNode<T> | null) = this.head;
        let previous: (IMyNode<T> | null) = null;
        let i = 0;

        while (i < index) {
            previous = current;
            current = current?.next || null;
            i++;
        }


        previous && (previous.next = previous?.next ? previous.next : null);
        this.length--;
        return current;
    }


    print(): void {
        let current: (IMyNode<T> | null) = this.head;

        while (current) {
            console.log(current.value);
            current = current.next;
        }
    }

    toObject(): { [key: number]: T } {

        const temp: { [key: number]: T } = {};
        let index = 0;
        let current: (IMyNode<T> | null) = this.head;

        // loop over the list
        while (current) {
            // add the current value to the object
            temp[index] = current.value;
            // increment the index
            index++;
            // move to the next node
            current = current.next;
        }

        return temp;
    }

    size(): number {
        return this.length;
    }
}

export default LinkedList;
