const morgan = require('morgan');
const fs = require('fs');
const path = require('path');

// Détecter si on est sur Vercel (système de fichiers en lecture seule)
let isVercel = process.env.VERCEL === '1' || !!process.env.VERCEL_ENV;

// Custom format for logging
morgan.token('reqId', (req) => req.reqId || 'unknown');
morgan.token('userId', (req) => req.user?.id || 'anonymous');

// Create a simple log format
const logFormat = ':remote-addr - :remote-user [:date[clf]] ":method :url HTTP/:http-version" :status :res[content-length] ":referrer" ":user-agent" reqId=:reqId userId=:userId';

// Sur Vercel, utiliser console.log au lieu d'écrire dans des fichiers
let accessLogStream, errorLogStream;
let logsDir;

if (!isVercel) {
  // Create logs directory if it doesn't exist (uniquement en développement)
  logsDir = path.join(__dirname, '..', 'logs');
  if (!fs.existsSync(logsDir)) {
    try {
      fs.mkdirSync(logsDir, { recursive: true });
      console.log('Created logs directory:', logsDir);
    } catch (error) {
      console.warn('Could not create logs directory:', error.message);
      isVercel = true; // Fallback to console logging
    }
  }

  // Create write stream for combined logs (uniquement si pas Vercel)
  try {
    accessLogStream = fs.createWriteStream(
      path.join(logsDir, 'access.log'), 
      { flags: 'a' }
    );

    // Create write stream for error logs
    errorLogStream = fs.createWriteStream(
      path.join(logsDir, 'error.log'), 
      { flags: 'a' }
    );
  } catch (error) {
    console.warn('Could not create log streams, using console logging:', error.message);
    accessLogStream = null;
    errorLogStream = null;
  }
}

// Middleware to add request ID
// Use crypto for generating IDs (built-in, no dependencies)
const crypto = require('crypto');

const addRequestId = (req, res, next) => {
  try {
    // Generate a random 8-character ID using crypto
    req.reqId = crypto.randomBytes(4).toString('hex');
    res.setHeader('X-Request-ID', req.reqId);
    next();
  } catch (error) {
    console.error('Error generating request ID:', error);
    // Fallback ID using Math.random
    req.reqId = Math.random().toString(36).substr(2, 8);
    res.setHeader('X-Request-ID', req.reqId);
    next();
  }
};

// Standard request logger
const requestLogger = isVercel || !accessLogStream
  ? morgan(logFormat, {
      skip: (req, res) => req.url === '/health' // Skip health checks
    })
  : morgan(logFormat, {
      stream: accessLogStream,
      skip: (req, res) => req.url === '/health' // Skip health checks
    });

// Error logger (only logs 4xx and 5xx responses)
const errorLogger = isVercel || !errorLogStream
  ? morgan(logFormat, {
      skip: (req, res) => res.statusCode < 400
    })
  : morgan(logFormat, {
      stream: errorLogStream,
      skip: (req, res) => res.statusCode < 400
    });

// Security logger for suspicious activity
const securityLogger = (req, res, next) => {
  // Log suspicious patterns
  const suspiciousPatterns = [
    /script.*alert/i,
    /union.*select/i,
    /drop.*table/i,
    /<script/i,
    /javascript:/i
  ];
  
  const url = req.url.toLowerCase();
  const userAgent = (req.get('User-Agent') || '').toLowerCase();
  
  for (const pattern of suspiciousPatterns) {
    if (pattern.test(url) || pattern.test(userAgent)) {
      const logEntry = {
        timestamp: new Date().toISOString(),
        type: 'SECURITY_ALERT',
        ip: req.ip || req.connection.remoteAddress,
        method: req.method,
        url: req.url,
        userAgent: req.get('User-Agent'),
        reqId: req.reqId,
        pattern: pattern.source
      };
      
      // Sur Vercel, utiliser console.error au lieu d'écrire dans un fichier
      if (isVercel) {
        console.error('SECURITY_ALERT:', JSON.stringify(logEntry));
      } else {
        try {
          const logsDir = path.join(__dirname, '..', 'logs');
          fs.appendFileSync(
            path.join(logsDir, 'security.log'), 
            JSON.stringify(logEntry) + '\n'
          );
        } catch (error) {
          // Fallback to console if file write fails
          console.error('SECURITY_ALERT:', JSON.stringify(logEntry));
        }
      }
    }
  }
  
  next();
};

module.exports = {
  addRequestId,
  requestLogger,
  errorLogger,
  securityLogger
};
