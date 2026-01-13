const functions = require("firebase-functions/v2/firestore");
const admin = require("firebase-admin");
admin.initializeApp();

exports.onNewIncident = functions
    .document("incidents/{incidentId}")
    .onCreate(async (snap, context) => {
        const incident = snap.data();
        const incidentId = context.params.incidentId;

        // Example filters — customize as needed
        const severity = incident.severity || "medium";
        const category = incident.category || "others";

        // Find users interested in this type of alert
        let query = admin.firestore().collection("users");

        // Example: only users who enabled general alerts
        query = query.where("notificationPreferences.generalAlerts", "==", true);

        // Optional: more specific filters
        if (severity === "high") {
            query = query.where("notificationPreferences.emergencyAlerts", "==", true);
        }

        const usersSnapshot = await query.get();

        if (usersSnapshot.empty) {
            console.log("No users to notify");
            return null;
        }

        const tokens = [];
        usersSnapshot.forEach((doc) => {
            const data = doc.data();
            if (data.fcmToken) {
                tokens.push(data.fcmToken);
            }
        });

        if (tokens.length === 0) return null;

        const message = {
            notification: {
                title: `New ${severity.toUpperCase()} Incident`,
                body: `${incident.title || "Incident"} • ${category}`,
            },
            data: {
                incidentId: incidentId,
                type: "new_incident",
                severity: severity,
                click_action: "FLUTTER_NOTIFICATION_CLICK", // helps with deep linking
            },
            android: {
                priority: severity === "high" ? "high" : "normal",
            },
            tokens: tokens,
        };

        try {
            const response = await admin.messaging().sendEachForMulticast(message);
            console.log(`Successfully sent ${response.successCount} notifications`);
        } catch (error) {
            console.error("Error sending notifications:", error);
        }
    });