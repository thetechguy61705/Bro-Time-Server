if (process.env.NODE_ENV === "production") {
	var package = require(__dirname + "/package.json");
	require("optional-dev-dependency")(
		package.optionalDevDependencies);
}
