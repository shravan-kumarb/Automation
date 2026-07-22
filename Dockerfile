# Pin to the same Playwright version as package.json(@playwright/test 1.60.0).
# The official image ships the matching browsers + os dependencies preinstalled
FROM mcr.microsoft.com/playwright:v1.60.0-noble

WORKDIR /app

#Install dependencies first to leverage Docker layer catching.
COPY package.json package-lock.json ./
RUN npm catching

#Copy the rest of the framework.
COPY . .

#Default command runs the full suite. Overrides at runtime, e.g.:
#   .docker run --rm saucedemo-tests npm run test:smoke
CMD ["npm","test"]