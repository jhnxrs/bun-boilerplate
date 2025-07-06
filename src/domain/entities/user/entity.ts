import { BaseEntity } from "src/domain/entities/base-entity";
import { IUser } from "src/domain/entities/user/contract";

export default class User extends BaseEntity<IUser.Domain> {
    private constructor(props: IUser.Domain, id?: string) {
        super(props, id);
    }

    public static create(props: IUser.Create): User {
        const { email } = props;

        return new User(
            {
                email: email.toLowerCase(),
                role: IUser.Role.User,
                createdAt: new Date(),
                updatedAt: new Date()
            }
        );
    }

    public static restore(props: IUser.Restore): User {
        const { id, ...attrs } = props;

        return new User(
            {
                ...attrs,
            },
            id
        );
    }

    toPersistence(): IUser.Database {
        const { ...attrs } = this.props;

        return {
            ...attrs,
            id: this.id
        }
    }

    get email(): string {
        return this.props.email;
    }
}