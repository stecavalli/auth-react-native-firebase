# React Native and Firebase Authentication App for Android

[![Platform](https://img.shields.io/badge/platform-React%20Native-blue.svg)](https://reactnative.dev/)
[![Firebase](https://img.shields.io/badge/backend-Firebase-orange.svg)](https://firebase.google.com/)

This is a **React Native** mobile app that uses **Firebase** for user authentication, profile data storage in **Cloud Firestore**, and image handling via **Firebase Storage**.

## ✨ Features

- ✅ User registration with email and password  
- ✅ Store user data in Firestore  
- ✅ User login  
- ✅ User profile with displayable profile image  
- ✅ Edit profile (data and image)  
- ✅ Navigation between Login, Register, Profile, and Edit Profile screens  
- ✅ User state management using React Context  

## 🛠 Tech Stack

- **React Native**: Framework used for building the mobile app.
- **Firebase**:
  - **Firebase Authentication**: Used for user authentication (sign up, login, logout).
  - **Firestore**: Cloud database for storing user data.
  - **Firebase Storage**: Used for storing and managing user profile images.
- **React Context**: For managing global state, particularly for user authentication.
- **React Navigation**: For navigating between different screens in the app.
- **React Native Image Picker**: Library for selecting images from the device's gallery or camera.
- **Official Firebase APIs**: These are used via the @react-native-firebase/auth, @react-native-firebase/firestore, and @react-native-firebase/storage modules.

## 📦 Required Dependencies

**After creating your React Native app, install the following dependencies and packages:**

```bash
npm install

npm install @react-navigation/native
npm install @react-navigation/native-stack
npm install react-native-screens react-native-safe-area-context react-native-gesture-handler react-native-reanimated

npm install @react-native-firebase/app
npm install @react-native-firebase/auth
npm install @react-native-firebase/firestore
npm install @react-native-firebase/storage

npm install react-native-image-picker
```

📚 For full setup, refer to [React Native Firebase docs](https://rnfirebase.io/).

## 📁 Project Structure

```
MyAndroidApp/
│
├── ... other folders
│
├── assets/
│   └── default-avatar.png
│
├── components/
│   └── navigators/
│       └── RootNavigator.tsx
│
├── context/
│   └── UserContext.tsx
│
├── screens/
│   ├── EditProfileScreen.tsx
│   ├── LoginScreen.tsx
│   ├── ProfileScreen.tsx
│   └── RegisterScreen.tsx
│
├── App.tsx
│
└── ... other files
```

## 🚀 Getting Started

1. **Clone the repository**
   ```bash
   git clone https://github.com/stecavalli/auth-react-native-firebase.git
   ```
2. **Create a react native app**
   ```bash
   npx @react-native-community/cli init MyAndroidApp
   cd MyAndroidApp
   ```
   Insert the files downloaded from the repository into the **project root** folder, according to the scheme shown in the Project Structure.<br>
   <br>
   Open Android Studio.<br>
   Go to Settings > Android SDK > SDK Tools.<br>
   Check **NDK (Side by side)** and at the bottom right Show Package Details and select the version that will be installed in C:\Users\YOUR_USER_ACCOUNT\AppData\Local\Android\Sdk\ndk\.<br>
   Click Apply to install it.<br>
   Check **Cmake**.<br>
   Edit the **android/build.gradle** file like this:
   ```bash
   buildscript {
       ext {
           buildToolsVersion = "35.0.0"
           minSdkVersion = 24
           compileSdkVersion = 35
           targetSdkVersion = 35
           ndkVersion = "29.0.13113456"
           kotlinVersion = "2.0.21"
       }
       repositories {
           google()
           mavenCentral()
       }
       dependencies {
	       classpath("com.google.gms:google-services:4.3.15")
           classpath("com.android.tools.build:gradle")
           classpath("com.facebook.react:react-native-gradle-plugin")
           classpath("org.jetbrains.kotlin:kotlin-gradle-plugin")
       }
   }

   allprojects {
       repositories {
           google() 
           mavenCentral()
       }
   }

   apply plugin: "com.facebook.react.rootproject"
   ```
   **Make sure the NDK version is the same as the version previously selected in NDK (Side by side)** <br><br>
   Edit the **android/app/build.gradle** file by adding the following line at the end, after all the lines:
   ```bash
   apply plugin: 'com.google.gms.google-services'
   ```
   Make sure the beginning of the **android/app/src/main/AndroidManifest.xml** file contains your package name and uses-permissions as described here:
   ```bash
   <manifest xmlns:android="http://schemas.android.com/apk/res/android" 
       package="com.myandroidapp"> 

     <uses-permission android:name="android.permission.INTERNET" /> 
     <uses-permission android:name="android.permission.READ_EXTERNAL_STORAGE" /> 
     <uses-permission android:name="android.permission.WRITE_EXTERNAL_STORAGE" /> 
     <uses-permission android:name="android.permission.READ_MEDIA_IMAGES" /> 
        ...
   ```

3. **Configure Firebase**
   - Create a Firebase project at [Firebase Console](https://console.firebase.google.com)
   - Enable **Authentication** (Email/Password)
   - Create a **Cloud Firestore**
   - Enable **Firebase Storage**
   - Add the **google-services.json** file to the **android/app/** folder. This file is created by firebase and you can find it in the project settings.
   - Make sure your firestore rules are like this:
     ```bash
     rules_version = '2';
        service cloud.firestore {
          match /databases/{database}/documents {

          // Each user can only access their own document in the users collection
          match /users/{userId} {
            allow read, write: if request.auth != null && request.auth.uid == userId;
          }

          // Public collection readable by anyone, useful for showing non-sensitive information (optional)
          match /public/{docId} {
            allow read: if true;
            allow write: if false;
          }
        }
     }
     ```
   - and firebase storage ones like this:
     ```bash
     rules_version = '2';
        service firebase.storage {
          match /b/{bucket}/o {
            match /profileImages/{userId}/{allPaths=**} {
              allow read, write: if request.auth != null && request.auth.uid == userId;
            }
          }
     }
     ```
4. **Android Emulator** <br>
   In Android Studio Virtual Device Manager run an Android emulator. <br>
   Run the following command to view connected devices:
   ```bash
   adb devices
   ```
   ![adb devices](https://github.com/stecavalli/auth-react-native-firebase/blob/master/assets/adbdevices.png)
   
4. **Run the app**
   ```bash
   npx react-native run-android
   ```
   
## 🔖 Notes

- Profile image is uploaded to Firebase Storage and its URL is saved in Firestore.
- Logged-in user data is managed via a global React Context.

## 🖼️ Screenshots

| Login Screen | Register Screen | Profile Screen | Edit Profile |
|--------------|-----------------|----------------|---------------|
| ![Login](https://github.com/stecavalli/auth-react-native-firebase/blob/master/assets/login.png) | ![Register](https://github.com/stecavalli/auth-react-native-firebase/blob/master/assets/register.png) | ![Profile](https://github.com/stecavalli/auth-react-native-firebase/blob/master/assets/profile.png) | ![Edit](https://github.com/stecavalli/auth-react-native-firebase/blob/master/assets/edit1.png) |
| | | ![Profile](https://github.com/stecavalli/auth-react-native-firebase/blob/master/assets/profile2.png) | ![Edit](https://github.com/stecavalli/auth-react-native-firebase/blob/master/assets/edit2.png) |

## 🤝 Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

## 📝 License

This project is licensed under the [MIT License](https://opensource.org/license/mit).
