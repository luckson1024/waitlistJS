# Postman API Testing Guide for Myzuwa Waitlist Platform

This guide will help you use Postman to test your Laravel API endpoints, even if you are new to Postman. Follow each step carefully.

---

## 1. What is Postman?
Postman is a free tool for testing APIs. It lets you send requests to your backend and see the responses, making it easy to debug and verify your API.

---

## 2. Install Postman
- Download and install Postman from https://www.postman.com/downloads/
- Open the Postman app after installation.

---

## 3. Basic Postman Concepts
- **Request:** An API call (e.g., POST, GET, PUT, DELETE)
- **Collection:** A group of saved requests
- **Environment:** A set of variables (e.g., API base URL)

---

## 4. Set Up Your API Environment
1. Click the gear icon (⚙️) in the top right and select "Manage Environments".
2. Click "Add" to create a new environment (e.g., `Myzuwa Local`).
3. Add a variable:
   - **Key:** `base_url`
   - **Value:** `http://127.0.0.1:8000/api/v1` (or your deployed API base URL)
4. Click "Save" and select this environment from the dropdown at the top right.

---

## 5. Test the Email Capture Endpoint
### a. Create a New Request
1. Click "+ New" > "HTTP Request".
2. Set method to `POST`.
3. In the URL field, enter: `{{base_url}}/waitlist/email-capture`
4. Go to the "Body" tab, select `raw` and choose `JSON` from the dropdown.
5. Enter the following JSON:
   ```json
   {
     "email": "test@example.com"
   }
   ```
6. Click "Send".

### b. Check the Response
- **Success:** You should see a JSON response with `success: true` and a waitlist entry ID.
- **Error:** If you see an error, check the message for details (e.g., validation error, server error).

---

## 6. Test the Waitlist Update Endpoint
1. Use the ID returned from the email capture response.
2. Create a new request:
   - Method: `PUT`
   - URL: `{{base_url}}/waitlist/{id}` (replace `{id}` with the actual ID)
   - Body: `raw` JSON, e.g.:
     ```json
     {
       "name": "John Doe",
       "country": "Nigeria",
       "phone": "+2348012345678"
     }
     ```
3. Click "Send" and check the response.

---

## 7. Test Admin Login (if implemented)
1. Create a new request:
   - Method: `POST`
   - URL: `{{base_url}}/auth/login`
   - Body: `raw` JSON:
     ```json
     {
       "email": "admin@myzuwa.com",
       "password": "yourpassword"
     }
     ```
2. Click "Send". You should receive a token if successful.

---

## 8. Test Other Endpoints
- Use the same approach for other endpoints (see `API.md` for details).
- Always set the correct HTTP method, URL, and body.
- For authenticated endpoints, add an `Authorization` header:
  - Key: `Authorization`
  - Value: `Bearer {token}` (replace `{token}` with your actual token)

---

## 9. Troubleshooting
- If you get a CORS error, make sure your backend allows requests from your frontend or Postman.
- If you get a 404, check the URL and method.
- If you get a 422, check your request body for missing or invalid fields.
- Check your Laravel logs (`storage/logs/laravel.log`) for backend errors.

---

## 10. Saving and Reusing Requests
- Click "Save" after creating a request to add it to a collection for future use.
- You can export and share collections with your team.

---

## 11. More Resources
- [Postman Learning Center](https://learning.postman.com/)
- [Myzuwa API Documentation](./API.md)

---

**You are now ready to test your API with Postman!**
