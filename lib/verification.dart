import 'package:cloud_firestore/cloud_firestore.dart';
import 'package:nagar_alert_app/services/incident_verification_service.dart';

class IncidentSubmissionService {
  final FirebaseFirestore _firestore = FirebaseFirestore.instance;
  final IncidentVerificationService _verificationService =
      IncidentVerificationService(geminiApiKey: 'API_KEY');

  /// Submit incident report and trigger automatic verification
  Future<String?> submitIncidentReport({
    required String category,
    required String title,
    required String description,
    required List<String> imageUrls,
    required String locationName,
    required GeoPoint location,
    required String reportedBy,
    required String reporterName,
    bool isAnonymous = false,
  }) async {
    try {
      // Step 1: Create incident document in Firebase
      final docRef = await _firestore.collection('incidents').add({
        'category': category,
        'title': title,
        'description': description,
        'images': imageUrls,
        'locationName': locationName,
        'location': location,
        'reportedBy': reportedBy,
        'reporterName': reporterName,
        'isAnonymous': isAnonymous,
        'status': 'pending',
        'verified': false,
        'credibility': 50,
        'reportCount': 1,
        'upvotes': 0,
        'viewCount': 0,
        'resolutionNote': null,
        'resolvedAt': null,
        'resolvedBy': null,
        'createdAt': FieldValue.serverTimestamp(),
        'updatedAt': FieldValue.serverTimestamp(),
      });

      final incidentId = docRef.id;
      print('✅ Incident submitted with ID: $incidentId');

      // Step 2: Trigger AI verification asynchronously
      // This runs in the background and doesn't block the user
      _verificationService
          .verifyIncidentAfterSubmission(incidentId)
          .then((success) {
            if (success) {
              print('✅ Verification completed for incident: $incidentId');
            } else {
              print('⚠️ Verification failed for incident: $incidentId');
            }
          })
          .catchError((error) {
            print('❌ Verification error for incident $incidentId: $error');
          });

      return incidentId;
    } catch (e) {
      print('❌ Error submitting incident: $e');
      return null;
    }
  }
}

// Example usage in your Flutter app:
void main() async {
  final submissionService = IncidentSubmissionService();

  // User submits incident report
  final incidentId = await submissionService.submitIncidentReport(
    category: 'Road',
    title: 'Pothole on Main Street',
    description: 'Large pothole causing traffic issues',
    imageUrls: ['https://supabase.url/image.jpg'],
    locationName: 'Main Street, City',
    location: GeoPoint(23.3485456, 85.4139205),
    reportedBy: 'user123',
    reporterName: 'John Doe',
  );

  if (incidentId != null) {
    print('Report submitted! Verification is running in the background.');
    // User can navigate away - verification continues automatically
  }
}

// To check verification results later:
Stream<DocumentSnapshot> getVerificationResults(String incidentId) {
  return FirebaseFirestore.instance
      .collection('incident_verifications')
      .doc(incidentId)
      .snapshots();
}
