import * as express from "express";
import * as cors from "cors";
import * as bodyParser from "body-parser";
import * as config from "./api.json"
import { ExpressService } from "./express-api/services/express";
import { DbContext } from "./database/dbContext";

const db = new DbContext();
const expr_svc = new ExpressService(db);
const expr_api = express();

const proc = (q: express.Request, r: express.Response, entity: string, operation: string) => {
    (expr_svc as any)[entity][operation].invoke({ ...q.body, ...q.query })
        .then((res: any) => r.json(res))
        .catch((err: any) => {
            err = err.cause || err;
            r.status(err.status || (err.errors ? 422 : 500));
            r.json({message: err.toString(), detail: err.errors });
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
    // app.post('/account', (q, r) => proc(q, r, 'accounts', 'create'));
    // app.get('/account', (q, r) => proc(q, r, 'accounts', 'get'));
    // app.put('/account', (q, r) => proc(q, r, 'accounts', 'update'));
    // app.delete('/account', (q, r) => proc(q, r, 'accounts', 'delete'));

    // // Order Operations
    // app.get('/order', (q, r) => proc(q, r, 'orders', 'get'));
    // app.put('/order', (q, r) => proc(q, r, 'orders', 'upsert'));
    // app.put('/order/finalise', (q, r) => proc(q, r, 'orders', 'finalise'));
    // app.get('/order/cert', (q, r) => proc(q, r, 'orders', 'getcert'));

    // // Challenge Operations
    // app.get('/challenge', (q, r) => proc(q, r, 'challenges', 'list'));
    // app.get('/challenge/detail', (q, r) => proc(q, r, 'challenges', 'detail'));
    // app.put('/challenge/fulfil', (q, r) => proc(q, r, 'challenges', 'fulfil'));

    // Start!
    expr_api.listen(config.portNumber, () => {
        console.log(`Listening on port ${config.portNumber}`);
    });
});
