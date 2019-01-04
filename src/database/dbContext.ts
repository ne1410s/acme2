import * as Sequelize from "sequelize";
import * as config from "../api.json";

export class DbContext {

    public dbUser: Sequelize.Model<{}, IDbUserAttribs>;
    public dbAccount: Sequelize.Model<{}, IDbAccountAttribs>;
    public dbOrder: Sequelize.Model<{}, IDbOrderAttribs>;

    public async syncStructure(): Promise<void> {
        
        const orm = new Sequelize(`sqlite:${config.dbConnection}`);
        
        // const orm = new Sequelize('AcmeDB', '', '', {
        //     dialect: 'sqlite',
        //     storage: config.dbConnection
        // });
        
        this.dbUser = orm.define('User', this.userAttribs),
        this.dbAccount = orm.define('Account', this.accountAttribs),
        this.dbOrder = orm.define('Order', this.orderAttribs);

        this.dbAccount.belongsTo(this.dbUser, { foreignKey: { name: 'UserID', allowNull: false } });
        this.dbOrder.belongsTo(this.dbAccount, { foreignKey: { name: 'AccountID', allowNull: false } });

        await orm.sync();
    }

    private readonly userAttribs: Sequelize.DefineModelAttributes<IDbUserAttribs> = {
        UserID: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        UserName: {
            type: Sequelize.STRING(25),
            allowNull: false,
            unique: true,
        },
        PasswordHash: {
            type: Sequelize.STRING,
            allowNull: false,
        },
        PasswordSalt: {
            type: Sequelize.STRING,
            allowNull: false,
        },
        LastActivity: {
            type: Sequelize.DATE,
            allowNull: false,
            defaultValue: new Date()
        }
    };

    private readonly accountAttribs: Sequelize.DefineModelAttributes<IDbAccountAttribs> = {
        AccountID: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: false,
        },
        IsTest: {
            type: Sequelize.BOOLEAN,
            allowNull: false,
        },
        PrivateKeyJWK: {
            type: Sequelize.STRING(2047),
            allowNull: true,
        }
    };

    private readonly orderAttribs: Sequelize.DefineModelAttributes<IDbOrderAttribs> = {
        OrderID: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: false,
        },
        CertPrivateKeyDER: {
            type: Sequelize.STRING(2047),
            allowNull: true,
        }
    };
}

export interface IDbUserAttribs {
    UserID: {},
    UserName: {},
    PasswordHash: {},
    PasswordSalt: {},
    LastActivity: {}
}

export interface IDbAccountAttribs {
    AccountID: {},
    IsTest: {},
    PrivateKeyJWK: {}
}

export interface IDbOrderAttribs {
    OrderID: {},
    CertPrivateKeyDER: {}
}
