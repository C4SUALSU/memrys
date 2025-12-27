Step 1: Google Cloud Console
    Go to Google Cloud Console.
    Create a Project (or select an existing one).
    Navigate to APIs & Services -> Credentials.
    Click + CREATE CREDENTIALS -> OAuth client ID.
    You may be asked to configure the OAuth consent screen first:
    Choose External.
    Fill in the App name (e.g., "Memrys") and your Support email.
    Authorized domains: Add onrender.com and supabase.co.
    Save.
    Back in Credentials, create the OAuth client ID:
    Application type: Web application.
    Name: Memrys Web.
    Authorized redirect URIs: Add your Supabase callback URL: https://qsxxgkrqubvspwoodtny.supabase.co/auth/v1/callback (Replace the first part with your actual Supabase project URL)
    Click Create.
    Copy the Client ID and Client Secret.

Step 2: Supabase Dashboard
    Go to your Supabase Dashboard.
    Navigate to Authentication -> Providers.
    Find Google and click Enable.
    Paste the Client ID and Client Secret you copied.
    Save.

Step 3: Test
    Redeploy on Render.
    Go to your site and click Continue with Google.
    You should be redirected to Google, sign in, and land on your Dashboard!