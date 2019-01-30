import * as express from "express";
import * as cors from "cors";
import * as bodyParser from "body-parser";
import * as apiConfig from "./api.json"
import * as path from "path";
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
            do { err = err.cause || err }
            while (err.cause);

            const status = err.status || (err.errors ? 422 : 500);
            let message = err.toString();

            if (err.body) { 
                try { message = JSON.parse(err.body).detail; }
                catch(ex) { console.warn('Failed to get body detail', err.body, ex); }
            }

            r.status(status);
            r.json({ message, detail: err.errors });

            if (status === 500) console.error(err);
        });
};

/**
 * Secure process: requires a valid bearer token. 
 */
const sec_proc = (q: express.Request, r: express.Response, entity: string, operation: string) => {       
    
    try {
        const authHeader = q.header('authorization'),
              token = ((authHeader || '').match(/^[Bb]earer ([\w-]*\.[\w-]*\.[\w-]*)$/) || [])[1] || '',
              userId = AuthUtils.verifyToken(token, apiConfig.secretKeys.jwt);
              
        q.body = { ...q.body, ...q.query, ...q.params };
        q.body.authenticUserId = userId;

        proc(q, r, entity, operation);
    }
    catch(err) {
        r.status(401);
        r.json({ message: 'Error: Access denied' })
    } 
};

// defer api startup til db init
db.syncStructure().then(() => {

    expr_api.use(cors());
    expr_api.use(bodyParser.json());

    // Static resources
    expr_api.get('/style.css', (q, r) => r.sendFile(path.resolve(__dirname, '../ui/style.css')));
    expr_api.get('/main.js', (q, r) => r.sendFile(path.resolve(__dirname, '../ui/main.js')));
    expr_api.get('/loading.svg', (q, r) => r.sendFile(path.resolve(__dirname, '../ui/loading.svg')));
    expr_api.get('/favicon.ico', (q, r) => r.sendFile(path.resolve(__dirname, '../ui/favicon.ico')));
    expr_api.get('/', (q, r) => r.sendFile(path.resolve(__dirname, '../ui/index.html')));

    // User Operations
    expr_api.post('/user', (q, r) => proc(q, r, 'users', 'register'));
    expr_api.post('/login', (q, r) => proc(q, r, 'users', 'login'));

    // Account Operations
    expr_api.post('/account', (q, r) => sec_proc(q, r, 'accounts', 'create'));
    expr_api.get('/account', (q, r) => sec_proc(q, r, 'accounts', 'list'));
    expr_api.delete('/account/:accountId', (q, r) => sec_proc(q, r, 'accounts', 'delete'));
    expr_api.put('/account', (q, r) => sec_proc(q, r, 'accounts', 'update'));

    // Order Operations
    expr_api.get('/order/:orderId', (q, r) => sec_proc(q, r, 'orders', 'get'));
    expr_api.post('/order', (q, r) => sec_proc(q, r, 'orders', 'create'));
    expr_api.delete('/order/:orderId', (q, r) => sec_proc(q, r, 'orders', 'delete'));
    expr_api.put('/order/:orderId/finalise', (q, r) => sec_proc(q, r, 'orders', 'finalise'));
    expr_api.get('/order/:orderId/cert/:certCode/:certType/:password?', (q, r) => sec_proc(q, r, 'orders', 'cert'));

    // Challenge Operations
    expr_api.post('/challenge', (q, r) => sec_proc(q, r, 'challenges', 'submit'));

    // Start!
    expr_api.listen(apiConfig.portNumber, () => {
        console.log(`Listening on port ${apiConfig.portNumber}`);
    });
});
