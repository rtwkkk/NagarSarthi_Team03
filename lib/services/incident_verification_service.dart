import 'dart:convert';
import 'package:http/http.dart' as http;
import 'package:cloud_firestore/cloud_firestore.dart';

class IncidentVerificationResult {
  final bool isConsistent;
  final int confidenceScore;
  final String verdict; // VERIFIED, INCONSISTENT, SUSPICIOUS
  final String reasoning;
  final String imageAnalysis;
  final Map<String, bool> consistencyChecks;
  final String recommendations;
  final DateTime verifiedAt;

  IncidentVerificationResult({
    required this.isConsistent,
    required this.confidenceScore,
    required this.verdict,
    required this.reasoning,
    required this.imageAnalysis,
    required this.consistencyChecks,
    required this.recommendations,
    required this.verifiedAt,
  });

  factory IncidentVerificationResult.fromJson(Map<String, dynamic> json) {
    return IncidentVerificationResult(
      isConsistent: json['isConsistent'] ?? false,
      confidenceScore: json['confidenceScore'] ?? 0,
      verdict: json['verdict'] ?? 'UNKNOWN',
      reasoning: json['reasoning'] ?? '',
      imageAnalysis: json['imageAnalysis'] ?? '',
      consistencyChecks: Map<String, bool>.from(
        json['consistencyChecks'] ?? {},
      ),
      recommendations: json['recommendations'] ?? '',
      verifiedAt: DateTime.now(),
    );
  }

  Map<String, dynamic> toFirestore() {
    return {
      'isConsistent': isConsistent,
      'confidenceScore': confidenceScore,
      'verdict': verdict,
      'reasoning': reasoning,
      'imageAnalysis': imageAnalysis,
      'consistencyChecks': consistencyChecks,
      'recommendations': recommendations,
      'verifiedAt': Timestamp.fromDate(verifiedAt),
      'createdAt': FieldValue.serverTimestamp(),
    };
  }
}

class IncidentData {
  final String id;
  final String category;
  final String title;
  final String description;
  final List<String> images;
  final String locationName;
  final String reporterName;
  final String reportedBy;

  IncidentData({
    required this.id,
    required this.category,
    required this.title,
    required this.description,
    required this.images,
    required this.locationName,
    required this.reporterName,
    required this.reportedBy,
  });

  factory IncidentData.fromFirestore(DocumentSnapshot doc) {
    Map<String, dynamic> data = doc.data() as Map<String, dynamic>;
    return IncidentData(
      id: doc.id,
      category: data['category'] ?? '',
      title: data['title'] ?? '',
      description: data['description'] ?? '',
      images: List<String>.from(data['images'] ?? []),
      locationName: data['locationName'] ?? '',
      reporterName: data['reporterName'] ?? '',
      reportedBy: data['reportedBy'] ?? '',
    );
  }
}

class IncidentVerificationService {
  final String geminiApiKey;
  final FirebaseFirestore _firestore = FirebaseFirestore.instance;

  IncidentVerificationService({required this.geminiApiKey});

  /// Main method to verify an incident after submission
  /// Call this method immediately after user submits an incident report
  Future<bool> verifyIncidentAfterSubmission(String incidentId) async {
    try {
      print('🔍 Starting verification for incident: $incidentId');

      // Step 1: Fetch incident data from Firebase
      final incidentData = await _fetchIncidentFromFirebase(incidentId);

      if (incidentData.images.isEmpty) {
        print('❌ No images found for incident: $incidentId');
        await _saveVerificationError(
          incidentId,
          'No images found for verification',
          incidentData,
        );
        return false;
      }

      // Step 2: Fetch image from Supabase URL and convert to base64
      print('📥 Fetching image from: ${incidentData.images[0]}');
      final imageBase64 = await _fetchImageAsBase64(incidentData.images[0]);

      // Step 3: Analyze with Gemini API
      print('🤖 Analyzing with Gemini AI...');
      final verificationResult = await _analyzeWithGemini(
        imageBase64,
        incidentData.title,
        incidentData.description,
        incidentData.category,
        incidentData.locationName,
      );

      // Step 4: Save verification result to separate collection mapped by incident ID
      print('💾 Saving verification result to Firebase...');
      await _saveVerificationResult(
        incidentId,
        verificationResult,
        incidentData,
      );

      // Step 5: Update incident document with verification status
      await _updateIncidentVerificationStatus(incidentId, verificationResult);

      print('✅ Verification completed successfully for incident: $incidentId');
      return true;
    } catch (e) {
      print('❌ Error verifying incident $incidentId: $e');
      await _saveVerificationError(incidentId, e.toString(), null);
      return false;
    }
  }

  /// Fetch incident data from Firebase Firestore
  Future<IncidentData> _fetchIncidentFromFirebase(String incidentId) async {
    try {
      final doc = await _firestore
          .collection('incidents')
          .doc(incidentId)
          .get();

      if (!doc.exists) {
        throw Exception('Incident not found in Firebase');
      }

      return IncidentData.fromFirestore(doc);
    } catch (e) {
      throw Exception('Failed to fetch incident from Firebase: $e');
    }
  }

  /// Fetch image from Supabase URL and convert to base64
  Future<String> _fetchImageAsBase64(String imageUrl) async {
    try {
      final response = await http.get(Uri.parse(imageUrl));

      if (response.statusCode != 200) {
        throw Exception('Failed to fetch image: ${response.statusCode}');
      }

      final bytes = response.bodyBytes;
      final base64Image = base64Encode(bytes);

      return base64Image;
    } catch (e) {
      throw Exception('Failed to fetch image from Supabase: $e');
    }
  }

  /// Analyze incident with Gemini API
  Future<IncidentVerificationResult> _analyzeWithGemini(
    String imageBase64,
    String title,
    String description,
    String category,
    String locationName,
  ) async {
    final prompt =
        '''You are an expert incident verification system. Analyze the following incident report for consistency:

**Incident Category:** $category
**Title:** $title
**Description:** $description
**Location:** $locationName

Based on the uploaded image, determine if:
1. The image matches the described incident type and category
2. The title accurately reflects what's shown in the image
3. The description is consistent with the visual evidence
4. There are any signs of manipulation, misrepresentation, or inconsistency

Provide your analysis in the following JSON format (respond ONLY with valid JSON, no additional text):
{
  "isConsistent": true/false,
  "confidenceScore": 0-100,
  "verdict": "VERIFIED/INCONSISTENT/SUSPICIOUS",
  "reasoning": "Detailed explanation of your analysis",
  "imageAnalysis": "What you see in the image",
  "consistencyChecks": {
    "titleMatch": true/false,
    "descriptionMatch": true/false,
    "categoryMatch": true/false
  },
  "recommendations": "Suggested actions or additional verification needed"
}''';

    try {
      final url = Uri.parse(
        'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent?key=$geminiApiKey',
      );

      final requestBody = {
        'contents': [
          {
            'parts': [
              {'text': prompt},
              {
                'inline_data': {'mime_type': 'image/jpeg', 'data': imageBase64},
              },
            ],
          },
        ],
        'generationConfig': {
          'temperature': 0.4,
          'topK': 32,
          'topP': 1,
          'maxOutputTokens': 2048,
        },
      };

      final response = await http.post(
        url,
        headers: {'Content-Type': 'application/json'},
        body: jsonEncode(requestBody),
      );

      if (response.statusCode != 200) {
        throw Exception(
          'Gemini API error: ${response.statusCode} - ${response.body}',
        );
      }

      final data = jsonDecode(response.body);
      final text = data['candidates'][0]['content']['parts'][0]['text'];

      // Extract JSON from response
      final jsonMatch = RegExp(r'\{[\s\S]*\}').firstMatch(text);
      if (jsonMatch != null) {
        final jsonString = jsonMatch.group(0)!;
        final resultJson = jsonDecode(jsonString);
        return IncidentVerificationResult.fromJson(resultJson);
      }

      throw Exception('Invalid response format from Gemini');
    } catch (e) {
      throw Exception('Gemini analysis failed: $e');
    }
  }

  /// Save verification result to 'incident_verifications' collection
  /// Document ID matches the incident ID for easy mapping
  Future<void> _saveVerificationResult(
    String incidentId,
    IncidentVerificationResult result,
    IncidentData incidentData,
  ) async {
    try {
      // Save to incident_verifications collection with incident ID as document ID
      await _firestore.collection('incident_verifications').doc(incidentId).set(
        {
          // Verification result data
          ...result.toFirestore(),

          // Link to original incident
          'incidentId': incidentId,

          // Snapshot of incident data at time of verification
          'incidentSnapshot': {
            'category': incidentData.category,
            'title': incidentData.title,
            'description': incidentData.description,
            'locationName': incidentData.locationName,
            'reporterName': incidentData.reporterName,
            'reportedBy': incidentData.reportedBy,
            'imageUrl': incidentData.images.isNotEmpty
                ? incidentData.images[0]
                : null,
          },

          // Metadata
          'processingStatus': 'completed',
          'updatedAt': FieldValue.serverTimestamp(),
        },
      );

      print(
        '✅ Verification result saved to incident_verifications/$incidentId',
      );
    } catch (e) {
      throw Exception('Failed to save verification result: $e');
    }
  }

  /// Update the original incident document with verification status
  Future<void> _updateIncidentVerificationStatus(
    String incidentId,
    IncidentVerificationResult result,
  ) async {
    try {
      // Calculate new credibility score based on verdict
      int newCredibility;
      switch (result.verdict) {
        case 'VERIFIED':
          newCredibility = 100;
          break;
        case 'INCONSISTENT':
          newCredibility = 0;
          break;
        case 'SUSPICIOUS':
          newCredibility = 50;
          break;
        default:
          newCredibility = 50;
      }

      await _firestore.collection('incidents').doc(incidentId).update({
        'verified': result.verdict == 'VERIFIED',
        'credibility': newCredibility,
        'verificationStatus': result.verdict,
        'aiVerified': true,
        'aiVerifiedAt': FieldValue.serverTimestamp(),
      });

      print('✅ Incident document updated with verification status');
    } catch (e) {
      print('⚠️ Warning: Failed to update incident status: $e');
      // Don't throw - verification result is already saved
    }
  }

  /// Save verification error to the collection
  Future<void> _saveVerificationError(
    String incidentId,
    String errorMessage,
    IncidentData? incidentData,
  ) async {
    try {
      await _firestore.collection('incident_verifications').doc(incidentId).set(
        {
          'incidentId': incidentId,
          'processingStatus': 'failed',
          'error': errorMessage,
          'verdict': 'ERROR',
          'isConsistent': false,
          'confidenceScore': 0,
          'createdAt': FieldValue.serverTimestamp(),
          'updatedAt': FieldValue.serverTimestamp(),
          if (incidentData != null)
            'incidentSnapshot': {
              'category': incidentData.category,
              'title': incidentData.title,
              'description': incidentData.description,
            },
        },
      );
    } catch (e) {
      print('❌ Failed to save verification error: $e');
    }
  }
}
