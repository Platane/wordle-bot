# twitter API

## auth

This app uses twitter oauth 2 protocol.

The script twitter/auth.ts allows to generate an access token and a refresh token for any user.

The access token have a life span of one hour. The refresh token never expires, but can only be uses once (and then you get a new one).

So the process is :

every day:

- get a fresh access token with the refresh token, save the new refresh token for the next day.

- uses the access token to post tweet
