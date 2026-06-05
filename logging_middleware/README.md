# Logging Middleware

Reusable log helper for the evaluation service.

## Usage

```js
import { Log } from './logging.js'

Log('frontend', 'info', 'page', 'Loaded notifications view')
```

## Environment

- `LOG_ENDPOINT` (optional): Override the default log API endpoint.
- `LOG_TOKEN` (optional): Bearer token for protected log API.
