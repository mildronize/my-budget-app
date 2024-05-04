import 'dotenv/config';
import { expressPlugin } from 'nammatham';
import { app, func } from './nammatham';
import addTransactionQueue from './functions/handle-transaction-queue';
import cacheFunction from './functions/cache';
import resetCache from './functions/reset-cache';
import negotiateSignalr from './functions/negotiate-signalr';
import handleLongQueue from './functions/handle-long-queue';

app.addFunctions(
  addTransactionQueue,
  handleLongQueue,
  cacheFunction,
  resetCache,
  negotiateSignalr
);

const dev = process.env.NODE_ENV === 'development';
app.register(
  expressPlugin({
    port: 4000,
    dev,
    allowAllFunctionsAccessByHttp: true,
  })
);
app.start();
