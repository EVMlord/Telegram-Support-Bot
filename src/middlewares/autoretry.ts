import { autoRetry as retry } from "@grammyjs/auto-retry";

const autoRetry = retry({
  maxRetryAttempts: 2, // only repeat requests twice
  maxDelaySeconds: 5, // fail immediately if we have to wait >5 seconds
  rethrowInternalServerErrors: true, // do not handle internal server errors
  rethrowHttpErrors: true, // do not handle networking errors
});

export { autoRetry };
