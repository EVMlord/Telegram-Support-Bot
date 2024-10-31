import { ServerResponse } from "http";

export default function statusHandler(res: ServerResponse) {
  // using _ to indicate unused parameter
  res.setHeader("Content-Type", "text/html");
  res.statusCode = 200;

  res.end(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Server Status</title>
        <style>
            @keyframes typing {
                from { width: 0 }
                to { width: 100% }
            }
            @keyframes blink-caret {
                from, to { border-color: transparent }
                50% { border-color: orange; }
            }

            h1 {
                text-align: center;
                color: green;
                overflow: hidden;
                border-right: .15em solid orange;
                white-space: nowrap;
                margin: 0 auto;
                letter-spacing: .15em;
                animation: typing 3.5s steps(30, end), blink-caret .75s step-end infinite;
                font-size: 2rem;
                max-width: fit-content; /* Ensure the width only covers the text */
            }

            /* Adjust font size for smaller screens */
            @media (max-width: 768px) {
                h1 {
                    font-size: 1.5rem;
                }
            }

            @media (max-width: 480px) {
                h1 {
                    font-size: 1.2rem;
                }
            }
        </style>
    </head>
    <body style="font-family: Arial, sans-serif; display: flex; align-items: center; justify-content: center; height: 100vh; margin: 0;">
        <h1>✅ Server is up and running</h1>
    </body>
  </html>
`);
}
