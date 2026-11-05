# Quiz 4 – OTP Phone Verification (React Native / Expo)

**Name:** Your Name
**Roll No:** Your Roll Number

## Overview
An Expo (React Native) app that verifies a phone number with a one-time code using **Firebase Authentication (Phone)**.

**Flow:** enter phone number → send OTP → enter OTP → verify → success or failure message.

## Note about SMS
The free Firebase Spark plan does not send real SMS (error `auth/billing-not-enabled`). I used **Firebase test phone numbers**, which run the full send / enter / verify flow with a fixed code instead of a real SMS. Real SMS needs the paid Blaze plan.

## Run it
npm install
npx expo start --web

## Tech
Expo, React Native, Firebase Auth (web SDK), invisible reCAPTCHA

## Demo
Screen recording: PASTE_LINK_HERE
