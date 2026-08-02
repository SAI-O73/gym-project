Quota increase request for Generative Language API (Gemini)

Project: <REPLACE_WITH_YOUR_PROJECT_ID>
Contact: dsaimtm@gmail.com

Requested Changes:
- Increase `GenerateRequestsPerMinutePerProjectPerModel` for model `gemini-2.0-flash` to 60/min
- Increase `GenerateContentInputTokensPerModelPerMinute` for model `gemini-2.0-flash` to 200000 tokens/min
- Increase daily requests as appropriate for production usage (estimate below)

Justification:
We operate an AI Fitness Coach feature in our web application that answers user questions about workouts, nutrition, recovery, and protein. During development we saw `RESOURCE_EXHAUSTED` errors indicating the project currently has 0 free-tier quota for the `gemini-2.0-flash` model.

Expected usage:
- Approximate concurrent users: 50
- Average requests per user per day: 5
- Average tokens per request (input + output): 600
- Estimated daily requests: 250

Please enable the Generative Language API and raise the quotas above to allow both continued development and an initial production rollout. We will monitor usage and request further increases if required.

If you need additional technical details or a formal business justification, contact: dsaimtm@gmail.com
