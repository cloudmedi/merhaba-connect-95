import { Request, Response, NextFunction } from 'express';
import { logger } from '../utils/logger';

export const requestLogger = (req: Request, res: Response, next: NextFunction) => {
  const startTime = Date.now();
  
  logger.info(`Incoming ${req.method} request to ${req.path}`, {
    method: req.method,
    path: req.path,
    query: req.query,
    headers: req.headers,
    body: req.body,
    ip: req.ip,
    timestamp: new Date().toISOString()
  });

  // Add response logging
  const oldSend = res.send;
  res.send = function(data) {
    const responseTime = Date.now() - startTime;
    
    logger.info(`Response sent for ${req.method} ${req.path}`, {
      method: req.method,
      path: req.path,
      statusCode: res.statusCode,
      responseTime: `${responseTime}ms`,
      timestamp: new Date().toISOString()
    });
    
    return oldSend.apply(res, [data]);
  };

  next();
};

export const responseLogger = (req: Request, res: Response, next: NextFunction) => {
  const originalSend = res.send;
  
  res.send = function(body) {
    logger.info(`Response details for ${req.method} ${req.path}`, {
      statusCode: res.statusCode,
      headers: res.getHeaders(),
      timestamp: new Date().toISOString()
    });
    
    return originalSend.call(this, body);
  };
  
  next();
};