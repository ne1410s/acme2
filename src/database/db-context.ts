import { Crypto } from "@ne1410s/crypto";
import * as Sequelize from "sequelize";
import * as apiConfig from "../api.json";

export class DbContext {

    public dbConfig: Sequelize.Model<{}, IDbConfigAttribs>;
    public dbUser: Sequelize.Model<{}, IDbUserAttribs>;
    public dbAccount: Sequelize.Model<{}, IDbAccountAttribs>;
    public dbOrder: Sequelize.Model<{}, IDbOrderAttribs>;

    public async syncStructure(): Promise<void> {
        
        const orm = new Sequelize(`sqlite:${apiConfig.dbConnection}`, {
            logging: apiConfig.dbLogging,
            operatorsAliases: false
        });

        this.dbConfig = orm.define('Config', this.configAttribs);
        this.dbUser = orm.define('User', this.userAttribs);
        this.dbAccount = orm.define('Account', this.accountAttribs);
        this.dbOrder = orm.define('Order', this.orderAttribs);

        this.dbAccount.belongsTo(this.dbUser, { foreignKey: { name: 'UserID', allowNull: false } });
        this.dbOrder.belongsTo(this.dbAccount, { foreignKey: { name: 'AccountID', allowNull: false } });

        await orm.sync();

        const config = await this.dbConfig.findOne() as any;
        if (config == null) {
            const appSecret = await Crypto.randomString();
            await this.dbConfig.create({ ConfigID: 0, AppSecret: appSecret });
        }
    }

    private readonly configAttribs: Sequelize.DefineModelAttributes<IDbConfigAttribs> = {
        ConfigID: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false
        },
        AppSecret: {
            type: Sequelize.STRING,
            allowNull: false
        }
    };

    private readonly userAttribs: Sequelize.DefineModelAttributes<IDbUserAttribs> = {
        UserID: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false
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
            allowNull: false
        },
        IsTest: {
            type: Sequelize.BOOLEAN,
            allowNull: false,
        },
        JWKPair: {
            type: Sequelize.STRING(2047),
            allowNull: true,
        }
    };

    private readonly orderAttribs: Sequelize.DefineModelAttributes<IDbOrderAttribs> = {
        OrderID: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: false,
            allowNull: false
        },
        Domains: {
            type: Sequelize.STRING(2047),
            allowNull: false
        },
        CertPrivateKeyDER: {
            type: Sequelize.STRING(2047),
            allowNull: true,
        }
    };
}

export interface IDbConfigAttribs {
    ConfigID: {},
    AppSecret: {}
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
    JWKPair: {}
    UserID?: {}
}

export interface IDbOrderAttribs {
    OrderID: {},
    Domains: {},
    CertPrivateKeyDER: {}
    AccountID?: {}
}
