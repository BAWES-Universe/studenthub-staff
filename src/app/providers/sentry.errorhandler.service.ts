import { ErrorHandler, Injectable } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { environment } from '../../environments/environment';
import * as Sentry from '@sentry/browser';



@Injectable({
	providedIn: 'root'
})
export class SentryErrorhandlerService extends ErrorHandler {

	// Should we log to sentry or not?
	public sentryLoggingEnabled = false;

  // Array of environments to log
  public environmentsLogged: string[] = ["dev", "prod", "dev-mobile", "prod-mobile"];
  
  constructor() {
    super();

    // Enable sentry logging if current environment is in list of environments to log
		if(this.environmentsLogged.indexOf(environment.envName) > -1) {

      // Enable sentry logging
      this.sentryLoggingEnabled = true;
      
      Sentry.init({
        dsn: 'https://50fe720cb6344764980e53ca00db5860@o70039.ingest.sentry.io/5339276',
        // TryCatch has to be configured to disable XMLHttpRequest wrapping, as we are going to handle
        // http module exceptions manually in Angular's ErrorHandler and we don't want it to capture the same error twice.
        // Please note that TryCatch configuration requires at least @sentry/browser v5.16.0.
        integrations: [new Sentry.Integrations.TryCatch({
          XMLHttpRequest: false,
        })],
      });
    }
  }

  extractError(error) {
    // Try to unwrap zone.js error.
    // https://github.com/angular/angular/blob/master/packages/core/src/util/errors.ts
    if (error && error.ngOriginalError) {
      error = error.ngOriginalError;
    }

    // We can handle messages and Error objects directly.
    if (typeof error === 'string' || error instanceof Error) {
      return error;
    }

    // If it's http module error, extract as much information from it as we can.
    if (error instanceof HttpErrorResponse) {
      // The `error` property of http exception can be either an `Error` object, which we can use directly...
      if (error.error instanceof Error) {
        return error.error;
      }

      // ... or an`ErrorEvent`, which can provide us with the message but no stack...
      if (error.error instanceof ErrorEvent) {
        return error.error.message;
      }

      // ...or the request body itself, which we can use as a message instead.
      if (typeof error.error === 'string') {
        return `Server returned code ${error.status} with body "${error.error}"`;
      }

      // If we don't have any detailed information, fallback to the request message itself.
      return error.message;
    }

    // Skip if there's no error, and let user decide what to do with it.
    return null;
  }

  handleError(error) {
    super.handleError(error);

    const chunkFailedMessage = /Loading chunk [\d]+ failed/;

    if (chunkFailedMessage.test(error.message)) {
      return window.location.reload();
    }

		// Exit function if sentry logging is not enabled
		if(!this.sentryLoggingEnabled) return;

    const extractedError = this.extractError(error) || 'Handled unknown error';

    // Capture handled exception and send it to Sentry.
    const eventId = Sentry.captureException(extractedError);
    console.error(extractedError);
    Sentry.showReportDialog({ eventId });
    // When in development mode, log the error to console for immediate feedback
    // Optionally show user dialog to provide details on what happened.
  }
}
