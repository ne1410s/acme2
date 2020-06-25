# ne14.acme2

ES ACME v2 Wrapper

# Local development

- Add the environment variables as below
- Run some (fairly usual!) scripts:
  - `npm run build`
  - `npm run start`
- Visit http://localhost:8081/ in your browser
- (`npm run clean` will wipe any local db - including your test data!)
- For test accounts, the call to ACME2's "get orders" url seems to fail with a 405 - Method not allowed
  - (The live accounts are fine tho!)

# AWS hosting

## Zip up the following:

- /.ebextensions/
- /dist/
- /ui/
- /.npmrc
- /package.json

## NB - Environment Variables, and (non-production, demo-only) values

- acme::jwt -> <Some random string>
- acme::recaptcha -> ???
- acme::recaptcha::public -> ???
- acme::svchost -> http://localhost:8081

[//]: # 'See https://www.google.com/recaptcha/admin#list'

## Installing your Certificate

- IIS: Import the pfx
- AWS (Single Instance EBS):
- Include the /.ebextensions/ folder in the deployment
- Populate certificates in /https-instance.config (keep the 6-space indentation for each)
- Be sure not to commit changes to VCS!
- AWS (Load Balanced ELB):
- In AWS Certificate Manager, import cert and paste the various parts in PEM format
- In EBS, modify your network configuration accordingly
