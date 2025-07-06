type WithDatabase<T> = T & {
    id: string;
    createdAt: Date;
    updatedAt: Date;
}

type WithDomain<T> = Omit<T, 'id'>;

type Transformed<T> = {
    [K in keyof T]?: Transformed<T[K]>;
};