# Requirements

- Docker
- Docker-compose

## For Germany visa only

- [2recaptcha](https://2captcha.com/) account with credits (you can obtain credits solving captchas)

# Run

You have to run the following command for the bot you want to run.

docker-compose up -d

# Configuration

Every index.js has a cron which is running every minute, for some use cases you would want to change it (e.g. Germany visa requires a 2recaptcha account that uses credits, every request consumes them). Also you have to complete the sender and receiver for the email. Remember to allow your email account to send messages by [less secure apps](https://myaccount.google.com/lesssecureapps?pli=1&rapt=AEjHL4OQSVVGNd1c2CpJnx0bG81xw9FVmPUxGKlcW0IqnKyJXTI8jng3eOman7G804wlUvDq8EXi_uTUiI6lNB4k8T9jXLVP9Q)