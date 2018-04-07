/*
Copyright (c) 2018 Sentry (https://sentry.io) and individual contributors.
All rights reserved.

Redistribution and use in source and binary forms, with or without modification,
are permitted provided that the following conditions are met:

* Redistributions of source code must retain the above copyright notice, this list of conditions and the following disclaimer.
* Redistributions in binary form must reproduce the above copyright notice,
  this list of conditions and the following disclaimer in the documentation and/or other materials provided with the distribution.

THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES,
INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED.
IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY,
OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS;
OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY,
OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE,
EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
*/

var raven = require("raven");
var DSN = process.env.SENTRY_DSN;
if (DSN != null) {
	raven.config(`https://${DSN}@sentry.io/286240`, {
		captureUnhandledRejections: true,
		autoBreadcrumbs: true
	}).install();
	module.exports = raven.captureException.bind(raven);
} else {
	module.exports = function log(err, kwargs, cb) {
		if (!cb && typeof kwargs === "function") {
			cb = kwargs;
			kwargs = {};
		} else {
			kwargs = kwargs || {};
		}

		if (!(err instanceof Error)) {
			// This handles when someone does:
			//	throw "something awesome";
			// We synthesize an Error here so we can extract a (rough) stack trace.
			err = new Error(err);
		}

		var eventId = raven.generateEventId();
		console.warn(err, kwargs);
		if (cb != null)
			cb(null, eventId);

		return eventId;
	};
}
