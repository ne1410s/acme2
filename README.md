# ne14.acme2
ES ACME v2 Wrapper

# AWS hosting
## Zip up the following:
 - /dist/
 - /package.json
 - /.ebextensions/
 - /.npmrc
 - /ui/

## NB - Environment Variables, and (non-production, demo-only) values
 - acme::jwt                ->  <Some random string>
 - acme::recaptcha          ->  ???
 - acme::recaptcha::public  ->  ???
 - acme::svchost            ->  http://localhost:8081

[//]: # (See https://www.google.com/recaptcha/admin#list)

## Installing your Certificate
 - IIS: Import the pfx
 - AWS (Single Instance EBS):
  - Include the /.ebextensions/ folder in the deployment
  - Be sure to populate certificates
 - AWS (Load Balanced ELB):
  - In AWS Certificate Manager, import cert and paste the various parts in PEM format
  - In EBS, modify your network configuration accordingly