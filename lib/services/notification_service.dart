// import 'dart:io';

// import 'package:cloud_firestore/cloud_firestore.dart';
// import 'package:firebase_auth/firebase_auth.dart';
// import 'package:firebase_core/firebase_core.dart';
// import 'package:firebase_messaging/firebase_messaging.dart';
// import 'package:flutter/material.dart';
// import 'package:flutter_local_notifications/flutter_local_notifications.dart';

// // Global key for navigation (optional but recommended)
// final GlobalKey<NavigatorState> navigatorKey = GlobalKey<NavigatorState>();

// // Background handler (must be top-level function)
// Future<void> _firebaseMessagingBackgroundHandler(RemoteMessage message) async {
//   await Firebase.initializeApp();
//   print("Handling a background message: ${message.messageId}");
// }

// Future<void> setupFirebaseMessaging() async {
//   // Initialize Firebase
//   await Firebase.initializeApp();

//   // Background handler
//   FirebaseMessaging.onBackgroundMessage(_firebaseMessagingBackgroundHandler);

//   final messaging = FirebaseMessaging.instance;

//   // Request permission (iOS especially needs this)
//   NotificationSettings settings = await messaging.requestPermission(
//     alert: true,
//     badge: true,
//     sound: true,
//   );

//   if (settings.authorizationStatus == AuthorizationStatus.authorized) {
//     print('User granted permission');
//   }

//   // Get FCM token & save it
//   String? token = await messaging.getToken();
//   if (token != null) {
//     await saveFcmTokenToFirestore(token);
//   }

//   // Handle token refresh
//   FirebaseMessaging.instance.onTokenRefresh.listen((newToken) {
//     saveFcmTokenToFirestore(newToken);
//   });

//   // Foreground messages
//   FirebaseMessaging.onMessage.listen((RemoteMessage message) {
//     print('Got foreground message: ${message.notification?.title}');
//     _showLocalNotification(message);
//   });

//   // When app is opened from notification (terminated state)
//   RemoteMessage? initialMessage = await messaging.getInitialMessage();
//   if (initialMessage != null) {
//     _handleMessageOpened(initialMessage);
//   }

//   // When app is in background & user taps notification
//   FirebaseMessaging.onMessageOpenedApp.listen(_handleMessageOpened);
// }

// Future<void> saveFcmTokenToFirestore(String token) async {
//   final user = FirebaseAuth.instance.currentUser;
//   if (user == null) return;

//   await FirebaseFirestore.instance.collection('users').doc(user.uid).set({
//     'fcmToken': token,
//     'fcmTokenUpdatedAt': FieldValue.serverTimestamp(),
//     'platform': Platform.isIOS ? 'ios' : 'android',
//   }, SetOptions(merge: true));
// }

// // Show local notification (custom sound, icon, etc.)
// Future<void> _showLocalNotification(RemoteMessage message) async {
//   final flutterLocalNotificationsPlugin = FlutterLocalNotificationsPlugin();

//   const androidDetails = AndroidNotificationDetails(
//     'high_importance_channel', // channel id
//     'High Importance Notifications',
//     channelDescription: 'Critical alerts for incidents',
//     importance: Importance.max,
//     priority: Priority.high,
//     playSound: true,
//     sound: RawResourceAndroidNotificationSound('alert_sound'), // put in res/raw
//     enableVibration: true,
//   );

//   const iOSDetails = DarwinNotificationDetails(
//     presentAlert: true,
//     presentBadge: true,
//     presentSound: true,
//   );

//   const details = NotificationDetails(android: androidDetails, iOS: iOSDetails);

//   await flutterLocalNotificationsPlugin.show(
//     DateTime.now().millisecondsSinceEpoch % 100000,
//     message.notification?.title ?? 'New Alert',
//     message.notification?.body ?? '',
//     details,
//     payload: message.data['incidentId'], // for deep linking
//   );
// }

// void _handleMessageOpened(RemoteMessage message) {
//   final incidentId = message.data['incidentId'];
//   if (incidentId != null) {
//     // Navigate to incident detail screen
//     navigatorKey.currentState?.pushNamed(
//       '/incident_detail',
//       arguments: incidentId,
//     );
//   }
// }
