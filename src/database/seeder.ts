import * as config from "../api.json";
import * as Sequelize from "sequelize";

export abstract class Seeder {

    public static init(): void {
        
        const orm = new Sequelize('AcmeDB', '', '', {
            dialect: 'sqlite',
            storage: config.dbConnection
        });
        
        const User = orm.define('User', {
            UserID: {
                type: Sequelize.INTEGER,
                primaryKey: true,
                autoIncrement: true,
                allowNull: false,
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
            }
        });

        orm.sync()
            .then(() => User.create({
                UserID: 0,
                UserName: 'test123',
                PasswordHash: 'hi',
                PasswordSalt: 'there!',
                LastActivity: new Date()
            }))
            .then(testuser => console.log(testuser));
    }
}