import * as Sequelize from "sequelize";
import * as config from "../api.json";

export abstract class DbUtils {

    public static async syncStructure(): Promise<void> {
        
        const orm = new Sequelize('AcmeDB', '', '', {
            dialect: 'sqlite',
            storage: config.dbConnection
        });
        
        const User = orm.define('User', this.USER),
              Account = orm.define('Account', this.ACCOUNT),
              Order = orm.define('Order', this.ORDER);

        Account.belongsTo(User, { foreignKey: { name: 'UserID', allowNull: false } });
        Order.belongsTo(Account, { foreignKey: { name: 'AccountID', allowNull: false } });         

        await orm.sync();
    }

    private static readonly USER = {
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

    private static readonly ACCOUNT = {
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

    private static readonly ORDER = {
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