!#bin/bash
# // export const BASE_PATH = "https://ka7383vyjg.execute-api.us-east-1.amazonaws.com/dev/".replace(/\/+$/, "");
# export const BASE_PATH = "http://127.0.0.1:8000".replace(/\/+$/, "");
# /**
cp ~/dev/nexbotapi/schema.json ~/dev/react-nexbot/openapi.json
docker run --rm -v ${PWD}:/local openapitools/openapi-generator-cli:v6.5.0 generate \
-i /local/openapi.json \
-g typescript-axios \
-o /local/src/api

# add import to BASE_PATH in /src/api/base.ts
sed -i '' '1s/^/import { BASE_PATH } from "@config\/config";\'$'\n/' ~/dev/react-nexbot/src/api/base.ts

# remove declaration of base path in file
sed -i '' 's/export const BASE_PATH = .*/export { BASE_PATH };/' ~/dev/react-nexbot/src/api/base.ts

