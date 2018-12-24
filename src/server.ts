import * as express from "express";
import * as config from "./api-config.json";
import { Acme2Service } from "./services/acme2";

const app = express();
const env = config.useProductionApi ? 'production' : 'staging';
const svc = new Acme2Service(env as any);

const proc = (q: express.Request, r: express.Response, entity: string, operation: string) => {
    (svc as any)[entity][operation].invoke({ ...q.body, ...q.query })
        .then((res: any) => r.json(res))
        .catch((err: any) => r.json(err));
};

// Token Operations
app.get('/token', (q, r) => proc(q, r, 'tokens', 'get'));

// Account Operations
app.post('/account', (q, r) => proc(q, r, 'accounts', 'create'));
app.get('/account', (q, r) => proc(q, r, 'accounts', 'get'));
app.put('/account', (q, r) => proc(q, r, 'accounts', 'update'));
app.delete('/account', (q, r) => proc(q, r, 'accounts', 'delete'));

// Order Operations
app.get('/order', (q, r) => proc(q, r, 'orders', 'get'));
app.put('/order', (q, r) => proc(q, r, 'orders', 'upsert'));
app.put('/order/finalise', (q, r) => proc(q, r, 'orders', 'finalise'));
app.get('/order/cert', (q, r) => proc(q, r, 'orders', 'getcert'));

// Challenge Operations
app.get('/challenge', (q, r) => proc(q, r, 'challenges', 'list'));
app.get('/challenge/detail', (q, r) => proc(q, r, 'challenges', 'detail'));
app.put('/challenge/fulfil', (q, r) => proc(q, r, 'challenges', 'fulfil'));

// Start!
app.listen(config.portNumber, () => {
    console.log(`Listening on port ${config.portNumber}`);
});
