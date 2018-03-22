var DSN = process.env.SENTRY_DSN;
module.exports = DSN != null ?
	require("raven").config(`https://${DSN}@sentry.io/286240`).install().captureException :
	console.warn;
