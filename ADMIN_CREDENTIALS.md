# Admin Credentials

## Updated Admin Access

**Email:** lukametr@gmail.com
**Password:** rikoriko
**Role:** ADMIN

## How to Login

1. Go to your deployed SabaApp
2. Click on "Sign In"
3. Use the email and password above
4. After login, you should see the "Admin Panel" button in the dashboard
5. Click "Admin Panel" to manage user subscriptions

## Admin Features

- View all users and their subscription status
- Grant subscriptions with expiry dates
- Revoke active subscriptions
- Search and filter users
- Real-time subscription management

## Production Deployment

The admin user is automatically created when the app starts in production on Railway.
The subscription system includes:

- Daily cron job to check for expired subscriptions
- User access control for document operations
- Email notifications for subscription changes
- Admin panel for user management

## Testing

To test the admin functionality:

1. Login with admin credentials
2. Navigate to Admin Panel
3. Grant a test user subscription
4. Test document access with that user
5. Revoke subscription and verify access is blocked
