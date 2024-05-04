import { createProxyMiddleware, responseInterceptor } from 'http-proxy-middleware';
import { getEnv } from './env.js';
const env = getEnv();

/**
 * Configure proxy middleware
 */
export const spyMiddleware = createProxyMiddleware({
  target: env.TARGET_URL,
  changeOrigin: true, // for vhosted sites, changes host header to match to target's host
  selfHandleResponse: true, // manually call res.end(); IMPORTANT: res.end() is called internally by responseInterceptor()
  onProxyRes: responseInterceptor(async (responseBuffer, proxyRes, req, res) => {
    res.setHeader('Powered-by', 'bunsheet/cors-reverse-proxy');
    // res.setHeader('Access-Control-Allow-Origin', '*');
    // res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    // res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    // res.setHeader('Access-Control-Allow-Credentials', 'true');
    return responseBuffer.toString();
  }),
  logLevel: 'debug',
});
