import { utils } from "src/common/utils";
import { BaseEntity } from "src/domain/entities/base-entity";
import type { IOtp } from "src/domain/entities/otp/contract";

export default class Otp extends BaseEntity<IOtp.Domain> {
    private constructor(props: IOtp.Domain, id?: string) {
        super(props, id);
    }

    public static create(props: IOtp.Create): Otp {
        const { email } = props;

        return new Otp(
            {
                email: email.toLowerCase(),
                code: utils.random.numberAsString(6),
                isUsed: false,
                expiresAt: utils.dates.inFuture('minutes', 15),
                createdAt: new Date(),
                updatedAt: new Date()
            }
        );
    }

    public static restore(props: IOtp.Restore): Otp {
        const { id, ...attrs } = props;

        return new Otp(
            {
                ...attrs,
            },
            id
        );
    }

    toPersistence(): IOtp.Database {
        const { ...attrs } = this.props;

        return {
            ...attrs,
            id: this.id
        }
    }

    get code(): string {
        return this.props.code;
    }
}