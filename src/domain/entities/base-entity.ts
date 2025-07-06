import crypto from 'node:crypto';

export abstract class BaseEntity<T> {
    public id: string;
    protected props: T;

    constructor(props: T, id?: string) {
        this.props = props;
        this.id = id ?? crypto.randomUUID();
    }
}