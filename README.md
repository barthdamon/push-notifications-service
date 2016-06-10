# odd-notification-service

This app uses oddcast to accept formatted notifications and send them to AWS SNS.

## Installation:

```$npm install```

## Usage:

This service requires a separate web service for recieving device token registration requests and notification requests.

The API uses the following keys to send notifications:

```json
	organizationTopicArn: 'body.organizationTopicArn',
	applicationTopicArn: 'body.applicationTopicArn',
	applicationArn: 'body.applicationArn',
	deviceToken: 'body.deviceToken',
	message: 'body.message'
```
The organization topic arn is used to send notifications to the entire organization, whereas the application topic arns are used to send notifications to specific applications. The application arn is for when a device is registering, in order for it to subscribe for notifications. The message is the formatted json that contains the message for the push notification.

You can customize the way this service parses your request in 
```
api.js
``` 
but also feel free to just use the router and customize that however you want:
```
routes/router.js
```


## AWS Setup:

To use this push notification service you are going to have to set up an AWS SNS Topic for your apps to subscribe to.

Docs are here for configuring SNS:
http://docs.aws.amazon.com/sns/latest/dg/GettingStarted.html

You are going to need these env variables in your process in order for the AWS sdk to be configured to your account:

- AWS_SECRET_ACCESS_KEY
- AWS_ACCESS_KEY_ID
- AWS_DEFAULT_REGION

You will need the following AWS ARNs from your Amazon SNS setup to get the service working. These need to be attached to requests that you forward to this service. Whether you want to store them in a database or as env variables is totally up to you.

- APPLE_ARN_ID
- ANDROID_ARN_ID
- SNS_TOPIC_ARN
- ANDROID_TOPIC_ARN
- IOS_TOPIC_ARN

The ARN variables are what SNS uses to identify where to send the push notification. To get a APPLE and ANDORID ARN you need to setup
those projects as Applicaitons on AWS SNS. For help getting your apple and android apps setup you can refer to the AWS docs here:

#### Apple:
http://docs.aws.amazon.com/sns/latest/dg/mobile-push-apns.html
#### Android:
http://docs.aws.amazon.com/sns/latest/dg/mobile-push-gcm.html

After setting up your client application(s), you can then create a topic, which this service subscribes incoming devices to. You can of course tweak whether this service sends to a topic, a particular app, or any other criteria.

## Device Configuration

You will need to register devices for push notifications. Each device will need to register with the push notification service in order to recieve notifications.

On iOS you can use:

```swift
func application(application: UIApplication, didRegisterForRemoteNotificationsWithDeviceToken deviceToken: NSData) 
```

You must then send the device token to wherever your separate web server is hosted, and send to this route on this service:
```
/register
```
You will need to send up the device token from the device and then attach that devices application arn in your web service to the request body to register a device with API in this service.

## Sending Notifications
Your web service can send notifications to this service via the following routes:
```
/notify/organization
```

or 

```
/notify/application
```

You can customize the format of the message for both platforms in the json, links to resources for formatting notifications are below:

#####APNS
https://developer.apple.com/library/ios/documentation/NetworkingInternet/Conceptual/RemoteNotificationsPG/Chapters/TheNotificationPayload.html#//apple_ref/doc/uid/TP40008194-CH107-SW1

#####GCM
https://developers.google.com/cloud-messaging/http-server-ref
