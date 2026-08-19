/**
 * Custom request logger and performance timing middleware
 */
export const requestLogger = (req, res, next) => {
  const start = Date.now();
  
  res.on('finish', () => {
    const duration = Date.now() - start;
    const status = res.statusCode;
    const color = status >= 500 ? '\x1b[31m' : status >= 400 ? '\x1b[33m' : '\x1b[32m';
    const reset = '\x1b[0m';
    
    if (process.env.NODE_ENV === 'development') {
      console.log(`[HTTP] ${req.method} ${req.originalUrl} ${color}${status}${reset} - ${duration}ms`);
    }
  });

  next();
};

export default requestLogger;
