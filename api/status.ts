import { VercelResponse } from "@vercel/node";

export default function statusHandler(res: VercelResponse) {
  // using _ to indicate unused parameter
  res.setHeader("Content-Type", "text/html");
  res.status(200).send(`
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Server Status</title>
      </head>
      <body style="font-family: Arial, sans-serif; display: flex; align-items: center; justify-content: center; height: 100vh; margin: 0;">
        <h1 style="text-align: center; color: green;">✅ Server is running</h1>
      </body>
    </html>
  `);
}
