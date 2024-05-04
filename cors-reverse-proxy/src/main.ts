import express from 'express';
import { spyMiddleware } from './spy-middleware.js';
import { extractErorMessage } from './utils.js';
import { getEnv } from './env.js';
import cors from 'cors';

async function main() {
  const app = express();
  const port = getEnv().PORT;
  // Configure CORS
const corsOptions = {
  origin: 'http://localhost:3000', // This should match the domain of your frontend application
  credentials: true, // This allows cookies and credentials to be submitted across domains
  optionsSuccessStatus: 200 // For legacy browser support
};

app.use(cors(corsOptions));

  app.use(spyMiddleware);

  // Start the server
  app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });
}

main().catch(extractErorMessage);
