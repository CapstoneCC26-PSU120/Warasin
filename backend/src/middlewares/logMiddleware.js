export const logMiddleware = (req, res, next) => {
  const start = Date.now();
  const { method, originalUrl, body, query } = req;

  res.on("finish", () => {
    const duration = Date.now() - start;
    const { statusCode } = res;

    // ANSI console color codes for nice terminal formatting
    let color = "\x1b[32m"; // Green for 2xx
    if (statusCode >= 500) {
      color = "\x1b[31;1m"; // Bold Red for 5xx
    } else if (statusCode >= 400) {
      color = "\x1b[31m"; // Red for 4xx
    } else if (statusCode >= 300) {
      color = "\x1b[33m"; // Yellow for 3xx
    }

    const reset = "\x1b[0m";
    const dim = "\x1b[2m";

    console.log(
      `[${new Date().toISOString()}] ${color}${method}${reset} ${originalUrl} - Status: ${color}${statusCode}${reset} (${duration}ms)`
    );

    if (query && Object.keys(query).length > 0) {
      console.log(`${dim}  Query params: ${JSON.stringify(query)}${reset}`);
    }

    if (body && Object.keys(body).length > 0) {
      // Sanitize passwords to prevent logging sensitive data
      const sanitizedBody = { ...body };
      if (sanitizedBody.password) sanitizedBody.password = "********";
      console.log(`${dim}  Request body: ${JSON.stringify(sanitizedBody)}${reset}`);
    }
  });

  next();
};
