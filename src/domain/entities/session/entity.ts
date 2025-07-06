import { utils } from "src/common/utils";
import { BaseEntity } from "src/domain/entities/base-entity";
import type { ISession } from "src/domain/entities/session/contract";
import User from "src/domain/entities/user/entity";

export default class Session extends BaseEntity<ISession.Domain> {
    private constructor(props: ISession.Domain, id?: string) {
        super(props, id);
    }

    public static create(props: ISession.Create): Session {
        const { userId, ipAddress, userAgent } = props;

        return new Session(
            {
                token: utils.token(),
                userId,
                userAgent,
                ipAddress,
                expiresAt: utils.dates.inFuture('days', 7),
                createdAt: new Date(),
                updatedAt: new Date(),
            }
        );
    }

    public static restore(props: ISession.Restore): Session {
        const { id, user, ...attrs } = props;

        return new Session(
            {
                ...attrs,
                user: user ? User.restore(user) : undefined,
            },
            id
        );
    }

    update(props: ISession.Update): Session {
        const payload = {
            ...this.props,
            ...props
        }

        return new Session(payload, this.id);
    }

    toPersistence(): ISession.Database {
        const { user, ...attrs } = this.props;

        return {
            ...attrs,
            id: this.id
        }
    }

    get token(): string {
        return this.props.token;
    }

    get userId(): string {
        return this.props.userId;
    }

    // refresh when expiresAt <= 2 days
    get shouldRefresh(): boolean {
        const expiresAt = this.props.expiresAt;
        const now = new Date();
        const timeDifference = expiresAt.getTime() - now.getTime();
        return timeDifference <= 2 * 24 * 60 * 60 * 1000;
    }
}