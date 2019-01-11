import * as express from "express";
import * as cors from "cors";
import * as bodyParser from "body-parser";
import * as apiConfig from "./api.json"
import { ExpressService } from "./express-api/services/express";
import { DbContext } from "./database/db-context";
import { AuthUtils } from "./express-api/utils/auth.js";

const db = new DbContext();
const expr_svc = new ExpressService(db);
const expr_api = express();

const proc = (q: express.Request, r: express.Response, entity: string, operation: string) => {
    
    (expr_svc as any)[entity][operation].invoke({ ...q.body, ...q.query, ...q.params })
        .then((res: any) => r.json(res))
        .catch((err: any) => {
            //console.error(err);
            err = err.cause || err;
            r.status(err.status || (err.errors ? 422 : 500));
            r.json({message: err.toString(), detail: err.errors });
        });
};

/**
 * Secure process: requires a valid bearer token. 
 */
const sec_proc = (q: express.Request, r: express.Response, entity: string, operation: string) => {       
    
    db.dbConfig.findOne().then((config: any) => {
        try {
            const authHeader = q.header('authorization'),
                  token = ((authHeader || '').match(/^[Bb]earer ([\w-]*\.[\w-]*\.[\w-]*)$/) || [])[1] || '',
                  userId = AuthUtils.verifyToken(token, config.AppSecret);
                  
            q.body = { ...q.body, ...q.query, ...q.params };
            q.body.authenticUserId = userId;

            proc(q, r, entity, operation);
        }
        catch(err) {
            r.status(401);
            r.json({ message: 'Error: Access denied' })
        }
    });  
};

// defer api startup til db init
db.syncStructure().then(() => {

    expr_api.use(cors());
    expr_api.use(bodyParser.json());

    // User Operations
    expr_api.post('/user', (q, r) => proc(q, r, 'users', 'register'));
    expr_api.post('/login', (q, r) => proc(q, r, 'users', 'login'));

    // // Account Operations
    expr_api.post('/account', (q, r) => sec_proc(q, r, 'accounts', 'create'));
    expr_api.get('/account', (q, r) => sec_proc(q, r, 'accounts', 'list'));
    expr_api.delete('/account/:accountId', (q, r) => sec_proc(q, r, 'accounts', 'delete'));

    // Order Operations
    expr_api.get('/order', (q, r) => sec_proc(q, r, 'orders', 'get'));
    expr_api.post('/order', (q, r) => sec_proc(q, r, 'orders', 'create'));
    // app.put('/order/finalise', (q, r) => proc(q, r, 'orders', 'finalise'));
    // app.get('/order/cert', (q, r) => proc(q, r, 'orders', 'getcert'));

    // // Challenge Operations
    // app.get('/challenge', (q, r) => proc(q, r, 'challenges', 'list'));
    // app.get('/challenge/detail', (q, r) => proc(q, r, 'challenges', 'detail'));
    // app.put('/challenge/fulfil', (q, r) => proc(q, r, 'challenges', 'fulfil'));

    // Start!
    expr_api.listen(apiConfig.portNumber, () => {
        console.log(`Listening on port ${apiConfig.portNumber}`);
    });
});
