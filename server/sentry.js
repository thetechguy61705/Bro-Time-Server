var DSN = process.evn.SENTRY_DSN;
if (DSN !== null) {
	require("raven").config(`https:/${DSN}@sentry.io/286240`).install();
}

