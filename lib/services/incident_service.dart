import 'package:cloud_firestore/cloud_firestore.dart';
import 'package:firebase_storage/firebase_storage.dart';
import 'package:firebase_auth/firebase_auth.dart';
import 'dart:io';

class IncidentService {
  final FirebaseFirestore _firestore = FirebaseFirestore.instance;
  final FirebaseStorage _storage = FirebaseStorage.instance;
  final FirebaseAuth _auth = FirebaseAuth.instance;

  // Submit incident report
  Future<String> submitIncident({
    required String category,
    required String title,
    required String description,
    required String severity,
    required double latitude,
    required double longitude,
    required String locationName,
    required bool isAnonymous,
    List<File>? imageFiles,
  }) async {
    try {
      final userId = _auth.currentUser?.uid;
      if (userId == null) {
        throw Exception('User not authenticated');
      }

      // Upload images to Firebase Storage
      // Upload images to Firebase Storage
      // Replace the image upload section in submitIncident method:

      // Upload images to Firebase Storage
      // Upload images to Firebase Storage
      List<String> imageUrls = [];
      if (imageFiles != null && imageFiles.isNotEmpty) {
        print('Starting upload of ${imageFiles.length} images...');

        // Verify storage bucket is configured
        final String bucketName = _storage.bucket;
        print('Storage bucket: $bucketName');

        for (int i = 0; i < imageFiles.length; i++) {
          final File file = imageFiles[i];

          // Check if file exists
          if (!await file.exists()) {
            print('File does not exist: ${file.path}');
            continue;
          }

          // Get file size
          final int fileSize = await file.length();
          print('File size: ${fileSize} bytes');

          // Create unique filename with user ID
          final String timestamp = DateTime.now().millisecondsSinceEpoch
              .toString();
          final String randomId = DateTime.now().microsecondsSinceEpoch
              .toString();
          final String fileName = '${timestamp}_${randomId}_$i.jpg';

          // IMPORTANT: Use this exact path format
          final String storagePath = 'incidents/$userId/$fileName';
          final Reference ref = _storage.ref(storagePath);

          print('Uploading to: $storagePath');

          try {
            // Create metadata
            final metadata = SettableMetadata(
              contentType: 'image/jpeg',
              customMetadata: {'uploadedBy': userId, 'uploadedAt': timestamp},
            );

            // Upload file
            final UploadTask uploadTask = ref.putFile(file, metadata);

            // Monitor upload progress (optional)
            uploadTask.snapshotEvents.listen((TaskSnapshot snapshot) {
              if (snapshot.totalBytes > 0) {
                final progress =
                    (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                print('Upload $i progress: ${progress.toStringAsFixed(2)}%');
              }
            });

            // Wait for completion
            final TaskSnapshot snapshot = await uploadTask;

            // Verify success
            if (snapshot.state == TaskState.success) {
              final String downloadUrl = await snapshot.ref.getDownloadURL();
              imageUrls.add(downloadUrl);
              print('✅ Successfully uploaded image $i: $downloadUrl');
            } else {
              print('❌ Upload failed with state: ${snapshot.state}');
              throw Exception('Upload failed with state: ${snapshot.state}');
            }
          } on FirebaseException catch (e) {
            print('❌ Firebase error for image $i: ${e.code} - ${e.message}');
            // Re-throw to stop submission if upload fails
            rethrow;
          } catch (e) {
            print('❌ Upload error for image $i: $e');
            rethrow;
          }
        }

        print(
          'Upload complete. ${imageUrls.length} images uploaded successfully.',
        );

        if (imageUrls.isEmpty && imageFiles.isNotEmpty) {
          throw Exception('Failed to upload any images');
        }
      }
      // Create incident document
      final docRef = await _firestore.collection('incidents').add({
        'category': category,
        'title': title,
        'description': description,
        'severity': severity,
        'location': GeoPoint(latitude, longitude),
        'locationName': locationName,
        'images': imageUrls,
        'reportedBy': isAnonymous ? 'anonymous' : userId,
        'reporterName': isAnonymous
            ? 'Anonymous'
            : _auth.currentUser?.displayName ?? 'User',
        'isAnonymous': isAnonymous,
        'upvotes': 0,
        'viewCount': 0,
        'reportCount': 1,
        'credibility': 50, // Initial credibility score
        'verified': false, // Not verified yet
        'createdAt': FieldValue.serverTimestamp(),
        'updatedAt': FieldValue.serverTimestamp(),
        'status': 'pending', // Waiting for verification
        'resolvedAt': null, // Null until resolved
        'resolvedBy': null, // Null until resolved
        'resolutionNote': null, // Null until resolved
      });

      // Update user stats
      if (!isAnonymous) {
        await _firestore.collection('users').doc(userId).set({
          'totalReports': FieldValue.increment(1),
          'lastReportAt': FieldValue.serverTimestamp(),
        }, SetOptions(merge: true));
      }

      return docRef.id;
    } catch (e) {
      throw Exception('Failed to submit incident: $e');
    }
  }

  // Get all incidents (real-time stream)
  Stream<List<Map<String, dynamic>>> getIncidentsStream({
    String? category,
    String? status,
    bool onlyVerified = false,
  }) {
    Query query = _firestore
        .collection('incidents')
        .orderBy('createdAt', descending: true);

    // Filter by verification status
    if (onlyVerified) {
      query = query.where('verified', isEqualTo: true);
    }

    // Filter by category
    if (category != null && category != 'All') {
      query = query.where('category', isEqualTo: category);
    }

    // Filter by status
    if (status != null) {
      query = query.where('status', isEqualTo: status);
    }

    return query.limit(100).snapshots().map((snapshot) {
      return snapshot.docs.map((doc) {
        final data = doc.data() as Map<String, dynamic>;
        data['id'] = doc.id;

        // Convert Timestamp to DateTime
        if (data['createdAt'] != null) {
          final timestamp = data['createdAt'] as Timestamp;
          data['time'] = _formatTimeAgo(timestamp.toDate());
        }

        // Format location
        if (data['location'] != null) {
          final GeoPoint geoPoint = data['location'];
          data['lat'] = geoPoint.latitude;
          data['lng'] = geoPoint.longitude;
        }

        return data;
      }).toList();
    });
  }

  // Get single incident by ID
  Future<Map<String, dynamic>?> getIncidentById(String incidentId) async {
    try {
      final doc = await _firestore
          .collection('incidents')
          .doc(incidentId)
          .get();

      if (doc.exists) {
        final data = doc.data()!;
        data['id'] = doc.id;

        // Convert Timestamp
        if (data['createdAt'] != null) {
          final timestamp = data['createdAt'] as Timestamp;
          data['time'] = _formatTimeAgo(timestamp.toDate());
        }

        // Increment view count
        await _firestore.collection('incidents').doc(incidentId).update({
          'viewCount': FieldValue.increment(1),
        });

        return data;
      }
      return null;
    } catch (e) {
      print('Error fetching incident: $e');
      return null;
    }
  }

  // Get user's own reports
  Stream<List<Map<String, dynamic>>> getUserReportsStream(String userId) {
    return _firestore
        .collection('incidents')
        .where('reportedBy', isEqualTo: userId)
        .orderBy('createdAt', descending: true)
        .snapshots()
        .map((snapshot) {
          return snapshot.docs.map((doc) {
            final data = doc.data();
            data['id'] = doc.id;

            if (data['createdAt'] != null) {
              final timestamp = data['createdAt'] as Timestamp;
              data['time'] = _formatTimeAgo(timestamp.toDate());
            }

            return data;
          }).toList();
        });
  }

  // Upvote incident
  Future<void> toggleUpvote(String incidentId, String userId) async {
    final upvoteDoc = await _firestore
        .collection('upvotes')
        .doc('${incidentId}_$userId')
        .get();

    if (!upvoteDoc.exists) {
      // Add upvote
      await _firestore.collection('upvotes').doc('${incidentId}_$userId').set({
        'incidentId': incidentId,
        'userId': userId,
        'createdAt': FieldValue.serverTimestamp(),
      });

      await _firestore.collection('incidents').doc(incidentId).update({
        'upvotes': FieldValue.increment(1),
      });
    } else {
      // Remove upvote
      await _firestore
          .collection('upvotes')
          .doc('${incidentId}_$userId')
          .delete();

      await _firestore.collection('incidents').doc(incidentId).update({
        'upvotes': FieldValue.increment(-1),
      });
    }
  }

  // Check if user has upvoted
  Future<bool> hasUserUpvoted(String incidentId, String userId) async {
    final doc = await _firestore
        .collection('upvotes')
        .doc('${incidentId}_$userId')
        .get();
    return doc.exists;
  }

  // Get dashboard statistics
  Future<Map<String, dynamic>> getDashboardStats() async {
    try {
      final now = DateTime.now();
      final today = DateTime(now.year, now.month, now.day);

      // Active alerts (verified incidents)
      final activeQuery = await _firestore
          .collection('incidents')
          .where('verified', isEqualTo: true)
          .where('status', whereIn: ['pending', 'investigating', 'verified'])
          .get();

      // Verified today
      final verifiedTodayQuery = await _firestore
          .collection('incidents')
          .where('verified', isEqualTo: true)
          .where('createdAt', isGreaterThanOrEqualTo: Timestamp.fromDate(today))
          .get();

      // Total reports
      final totalQuery = await _firestore.collection('incidents').get();

      return {
        'activeAlerts': activeQuery.docs.length,
        'verifiedToday': verifiedTodayQuery.docs.length,
        'totalReports': totalQuery.docs.length,
        'avgResponseTime': '4.2 min', // Calculate based on your logic
      };
    } catch (e) {
      return {
        'activeAlerts': 0,
        'verifiedToday': 0,
        'totalReports': 0,
        'avgResponseTime': '--',
      };
    }
  }

  // Helper: Format time ago
  String _formatTimeAgo(DateTime dateTime) {
    final difference = DateTime.now().difference(dateTime);

    if (difference.inSeconds < 60) {
      return '${difference.inSeconds}s ago';
    } else if (difference.inMinutes < 60) {
      return '${difference.inMinutes}m ago';
    } else if (difference.inHours < 24) {
      return '${difference.inHours}h ago';
    } else if (difference.inDays < 7) {
      return '${difference.inDays}d ago';
    } else {
      return '${(difference.inDays / 7).floor()}w ago';
    }
  }

  // Delete incident (only by owner or admin)
  Future<void> deleteIncident(String incidentId, String userId) async {
    final doc = await _firestore.collection('incidents').doc(incidentId).get();

    if (doc.exists) {
      final data = doc.data()!;

      // Check if user is owner
      if (data['reportedBy'] == userId || data['reportedBy'] == 'anonymous') {
        // Delete images from storage
        if (data['images'] != null && (data['images'] as List).isNotEmpty) {
          for (String imageUrl in data['images']) {
            try {
              final ref = _storage.refFromURL(imageUrl);
              await ref.delete();
            } catch (e) {
              print('Error deleting image: $e');
            }
          }
        }

        // Delete document
        await _firestore.collection('incidents').doc(incidentId).delete();
      } else {
        throw Exception('You do not have permission to delete this incident');
      }
    }
  }
}
