# push-notifications-service
Node app to manage iOS and Android device tokens, coordinate with Amazon SNS, and send push notifications


## Installation:

```$npm install```

## Setup AWS ARN Variables:

To use this push notification service you are going to have to set up an AWS SNS Topic for your apps to subscribe to.

Docs are here for configuring SNS:
http://docs.aws.amazon.com/sns/latest/dg/GettingStarted.html

You will need the following ENV variables from your Amazon SNS setup to get the service working:

- AWS_SECRET_ACCESS_KEY
- AWS_ACCESS_KEY_ID
- APPLE_ARN_ID
- ANDROID_ARN_ID
- SNS_TOPIC_ARN

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

You must then send the device token to wherever you host this service:
https://YOURHOST/device/new
with the following body (using the deviceToken param from didRegisterForRemoteNotificationsWithDeviceToken in the iOS example):

```json
{
  "token" : "YOURDEVICETOKEN",
  "device" : "apple"
}
```


## PUSH 'EM!
Now you're ready to send a push notification! All you need to do now is hit this service with a request:

```json
{
    "appleMessage" : "YOU HAVE BEEN NOTIFIED",
    "message" : "TESTING",
}
```

The exact notification format for each device is slightly different, and can be customized. Refer to the routes in ```pushem.js``` for a starting point.

Here are links to keys to customize notifications:
#####APNS:
https://developer.apple.com/library/ios/documentation/NetworkingInternet/Conceptual/RemoteNotificationsPG/Chapters/TheNotificationPayload.html#//apple_ref/doc/uid/TP40008194-CH107-SW1

#####GCM:
https://developers.google.com/cloud-messaging/http-server-ref
