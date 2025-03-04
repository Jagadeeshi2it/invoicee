# Internal Code Documentation: Clearbit Company Data API Endpoint

[Linked Table of Contents](#linked-table-of-contents)

## Linked Table of Contents

* [1. Overview](#1-overview)
* [2. API Endpoint: GET /api/company](#2-api-endpoint-get-api-company)
    * [2.1 Input Parameters](#21-input-parameters)
    * [2.2 Function Logic and Algorithm](#22-function-logic-and-algorithm)
    * [2.3 Error Handling](#23-error-handling)
    * [2.4 Output](#24-output)


## 1. Overview

This document details the internal workings of the API endpoint that retrieves company data from the Clearbit API.  The endpoint is designed to accept a domain name as input and return relevant company information.  It leverages the Clearbit Company API V2 for data retrieval.

## 2. API Endpoint: GET /api/company

This endpoint retrieves company information based on a provided domain.

### 2.1 Input Parameters

| Parameter | Description | Type | Required |
|---|---|---|---|
| `domain` | The domain name of the company to search for. | String | Yes |


### 2.2 Function Logic and Algorithm

The `GET` function performs the following steps:

1. **Retrieves the domain from the request:** The function extracts the `domain` query parameter from the incoming request URL using `new URL(request.url)`.

2. **Input Validation:** It checks if the `domain` parameter is provided. If not, it returns a 400 Bad Request error.  It also checks if the `CLEARBIT_API_KEY` environment variable is set.  If not, a 500 Internal Server Error is returned, indicating a misconfiguration.

3. **Clearbit API Call:**  A `fetch` request is made to the Clearbit API using the provided domain and the configured API key. The API endpoint used is: `https://company.clearbit.com/v2/companies/find?domain=${domain}`. The `Authorization` header is set using the `Bearer` token authentication method.

4. **Response Handling:** The response from the Clearbit API is checked for successful status (`response.ok`). If the response is not successful, an error is thrown.  Otherwise, the JSON response is parsed.

5. **Data Transformation and Return:** The relevant fields from the Clearbit response are extracted and structured into a new JSON response, including the company's name, location (combining location data from the Clearbit response for a more readable format), phone number, email address, and logo URL. This structured JSON response is then returned to the client.

6. **Error Handling:** Any errors during the API call or JSON parsing are caught, logged to the console, and returned as a 500 Internal Server Error to the client.


### 2.3 Error Handling

The function incorporates robust error handling:

* **Missing Domain:** Returns a 400 Bad Request if the `domain` parameter is missing.
* **Missing API Key:** Returns a 500 Internal Server Error if the `CLEARBIT_API_KEY` environment variable is not set.
* **Clearbit API Errors:** Catches errors during the fetch request and returns a 500 Internal Server Error if the Clearbit API call fails.  Detailed error messages are logged to the console for debugging purposes.
* **JSON Parsing Errors:** Catches any errors encountered while parsing the JSON response from Clearbit and returns a 500 Internal Server Error.


### 2.4 Output

The function returns a JSON object with the following structure in case of success:

| Field | Description | Type |
|---|---|---|
| `name` | Company name | String |
| `location` | Company location (formatted as ", , ") | String |
| `phone` | Company phone number | String |
| `email` | Company email address (first email address from the array) | String |
| `logo` | URL of the company logo | String |

In case of failure, it returns a JSON object with an `error` field and an appropriate HTTP status code (400 or 500).
