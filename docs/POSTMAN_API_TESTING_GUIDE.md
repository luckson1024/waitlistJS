# Postman API Testing Guide for Myzuwa Waitlist Platform

This guide will help you use Postman to test your Laravel API endpoints, including Gemini AI, confirmation email, logo upload, and all admin features. The database schema is provided in `database/myzuwa_schema.sql`. Follow each step carefully.

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

## 5. Import the Database Schema
- Use phpMyAdmin to import `database/myzuwa_schema.sql` before testing.
- Ensure your `.env` is set up for your MySQL database and SSL if available.

---

## 6. Test the Email Capture Endpoint
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

## 7. Test the Waitlist Update Endpoint
1. Use the ID returned from the email capture response.
2. Create a new request:
   - Method: `PUT`
   - URL: `{{base_url}}/waitlist/{id}` (replace `{id}` with the actual ID)
   - Body: `raw` JSON, e.g.:
   ```json
   {
     "full_name": "Jane Doe",
     "country": "Nigeria"
   }
   ```
3. Click "Send".

---

## 8. Test Gemini AI Security Agent
- Use the `/ai/security` endpoint with your Gemini API key set in settings.
- See `API.md` for details.

---

## 9. More Endpoints
- See `API.md` for all available endpoints.
- See `DATABASE.md` and `database/myzuwa_schema.sql` for schema details.

---

**You are now ready to test your API with Postman, including Gemini AI, confirmation email, logo upload, and all admin features!**
