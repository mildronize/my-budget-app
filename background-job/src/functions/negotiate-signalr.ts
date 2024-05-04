import { input } from '@azure/functions';
import { func } from '../nammatham';

const signalrInput = input.generic({
  type: 'signalRConnectionInfo',
  connectionStringSetting: 'AzureSignalRConnectionString',
  hubName: 'serverless',
});

export default func
  .httpPost('negotiate', {
    authLevel: 'anonymous',
    route: 'negotiate',
    extraInputs: [signalrInput],
  })
  .handler(async c => {
    const signalRInput = c.context.extraInputs.get(signalrInput);
    return c.text(JSON.stringify(signalRInput));


  });
