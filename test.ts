import "./mod_test.ts"
import "./src/utils_test.ts"
import "./src/defaults_test.ts"
import "./src/cancel/Cancel_test.ts"
import "./src/helpers/buildURL_test.ts"
import "./src/helpers/combineURLs_test.ts"
import "./src/helpers/isAbsoluteURL_test.ts"
import "./src/helpers/normalizeHeaderName_test.ts"
import "./examples_test.ts"

import { runTests } from "./test_deps.ts"

runTests()