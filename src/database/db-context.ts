import { Sequelize, Model, ModelAttributes, ModelCtor, INTEGER, STRING, BOOLEAN, DATE } from "sequelize";
import * as apiConfig from "../api.json";

export class DbContext {

    public User: ModelCtor<Model>;
    public Account: ModelCtor<Model>;
    public Order: ModelCtor<Model>;

    public async syncStructure(): Promise<void> {
        
        const orm = new Sequelize(`sqlite:${apiConfig.dbConnection}`, {
            logging: apiConfig.dbLogging,
            operatorsAliases: {}
        });

        orm.define('User', this.userAttribs);
        orm.define('Account', this.accountAttribs);
        orm.define('Order', this.orderAttribs);

        this.User = orm.models.User;
        this.Account = orm.models.Account;
        this.Order = orm.models.Order;

        this.Account.belongsTo(this.User, { foreignKey: { name: 'UserID', allowNull: false } });
        this.User.hasMany(this.Account, { foreignKey: { name: 'UserID' } });        

        this.Order.belongsTo(this.Account, { foreignKey: { name: 'AccountID', allowNull: false } });
        this.Account.hasMany(this.Order, { foreignKey: { name: 'AccountID' } });

        await orm.sync();
    }

    private readonly userAttribs: ModelAttributes = {
        UserID: {
            type: INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false
        },
        UserName: {
            type: STRING(25),
            allowNull: false,
            unique: true,
        },
        PasswordHash: {
            type: STRING,
            allowNull: false,
        },
        PasswordSalt: {
            type: STRING,
            allowNull: false,
        },
        LastActivity: {
            type: DATE,
            allowNull: false,
            defaultValue: new Date()
        }
    };

    private readonly accountAttribs: ModelAttributes = {
        AccountID: {
            type: INTEGER,
            primaryKey: true,
            autoIncrement: false,
            allowNull: false
        },
        IsTest: {
            type: BOOLEAN,
            allowNull: false,
        },
        JWKPair: {
            type: STRING(2047),
            allowNull: true,
        },
        Emails: {
            type: STRING(2047),
            allowNull: false
        }
    };

    private readonly orderAttribs: ModelAttributes = {
        OrderID: {
            type: INTEGER,
            primaryKey: true,
            autoIncrement: false,
            allowNull: false
        },
        Domains: {
            type: STRING(2047),
            allowNull: false
        },
        CertPkcs8_Base64: {
            type: STRING(2047),
            allowNull: true,
        }
    };
}
