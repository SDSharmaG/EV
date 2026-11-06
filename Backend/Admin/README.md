# Backend setup

## Required environment variables

- `MONGO_URI`: MongoDB Atlas connection string.
- `JWT_SECRET`: long, private secret used to sign login tokens.
- `FRONTEND_URLS`: comma-separated allowed frontend origins for CORS.
- `RESEND_API_KEY`: API key from Resend, used to send booking and password-reset codes.
- `EMAIL_FROM`: verified sender address configured in Resend.
- `GOOGLE_CLIENT_ID`: Google OAuth Web client ID used to verify Google sign-in credentials.
- `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, and `CLOUDINARY_API_SECRET`: image storage credentials. Set all three to enable persistent Cloudinary image uploads.

Set these in the hosting provider's environment settings; do not commit secrets.

## Existing image migration

New station, offer, and user profile image uploads are stored in Cloudinary when all three Cloudinary environment variables are set. To migrate existing local images, run the following from `Backend/Admin` on the machine that has the `uploads` directory. The script uploads only images referenced by MongoDB records and replaces their stored filenames with Cloudinary URLs. It skips records that already have URLs, so it can be safely rerun.

Set `MONGO_URI` to the Atlas connection string and set the three Cloudinary variables in the same PowerShell session, then run:

```powershell
node .\scripts\migrateLocalImagesToCloudinary.js
```

Keep the local `uploads` directory until the migration reports success and the images have been checked on the deployed app. Set the same Cloudinary variables in Render and redeploy the backend code that includes Cloudinary upload support so new uploads also go to Cloudinary.

The user API supports email verification codes for bookings, email password reset, and Google sign-in:

- `POST /api/auth/booking-otp/request` (authenticated)
- `POST /api/auth/booking-otp/verify` (authenticated)
- `POST /api/auth/password-reset/request`
- `POST /api/auth/password-reset/confirm`
- `POST /api/auth/google`

Email verification codes expire after 10 minutes and allow up to five verification attempts.
