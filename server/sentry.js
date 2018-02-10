var DSN = process.env.SENTRY_DSN;
if (DSN !== null) {
	require("raven").config(`https://${DSN}@sentry.io/286240`).install();
}
