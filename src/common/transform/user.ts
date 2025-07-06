import type { IUser } from "src/domain/entities/user/contract";
import type User from "src/domain/entities/user/entity";

type Props = {
    entity: User;
    sensitive?: boolean;
}

export type TransformedUser = Transformed<IUser.Restore>;

export const transformUser = (props: Props): TransformedUser => {
    const { entity, sensitive = true } = props;
    const transformed = entity.toPersistence();

    if (sensitive) {
        // return public data only
        return {
            id: transformed.id,
            role: transformed.role,
        }
    }

    return {
        ...transformed
    }
}