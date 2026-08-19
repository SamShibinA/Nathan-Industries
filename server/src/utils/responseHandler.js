/**
 * Standardized JSON API Response Helper
 */
export const sendResponse = (res, statusCode, message, data = null, meta = null) => {
  const success = statusCode >= 200 && statusCode < 300;
  
  const responsePayload = {
    success,
    message,
    ...(data !== null && { data }),
    ...(meta !== null && { meta }),
    timestamp: new Date().toISOString(),
  };

  return res.status(statusCode).json(responsePayload);
};

export default sendResponse;
