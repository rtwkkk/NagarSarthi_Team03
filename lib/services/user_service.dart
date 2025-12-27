import 'package:cloud_firestore/cloud_firestore.dart';
import 'package:firebase_auth/firebase_auth.dart';

class UserService {
  final FirebaseFirestore _firestore = FirebaseFirestore.instance;
  final FirebaseAuth _auth = FirebaseAuth.instance;

  // Get current user data
  Stream<Map<String, dynamic>?> getCurrentUserData() {
    final userId = _auth.currentUser?.uid;
    if (userId == null) return Stream.value(null);

    return _firestore.collection('users').doc(userId).snapshots().map((doc) {
      if (doc.exists) {
        final data = doc.data()!;
        data['id'] = doc.id;
        return data;
      }
      return null;
    });
  }

  // Create or update user profile
  Future<void> updateUserProfile({
    required String userId,
    String? name,
    String? email,
    String? phone,
    String? avatar,
  }) async {
    final Map<String, dynamic> data = {};
    if (name != null) data['name'] = name;
    if (email != null) data['email'] = email;
    if (phone != null) data['phone'] = phone;
    if (avatar != null) data['avatar'] = avatar;
    data['updatedAt'] = FieldValue.serverTimestamp();

    await _firestore
        .collection('users')
        .doc(userId)
        .set(data, SetOptions(merge: true));
  }

  // Get user statistics
  Future<Map<String, dynamic>> getUserStats(String userId) async {
    final userDoc = await _firestore.collection('users').doc(userId).get();
    final userData = userDoc.data() ?? {};

    final userIncidents = await _firestore
        .collection('incidents')
        .where('reportedBy', isEqualTo: userId)
        .get();

    final verifiedIncidents = userIncidents.docs
        .where((doc) => doc.data()['status'] == 'verified')
        .length;

    return {
      'totalReports': userIncidents.docs.length,
      'verifiedReports': verifiedIncidents,
      'credibilityScore': userData['credibilityScore'] ?? 50,
      'points': userData['points'] ?? 0,
      'accuracy': verifiedIncidents > 0
          ? ((verifiedIncidents / userIncidents.docs.length) * 100).round()
          : 0,
    };
  }

  // Save incident
  Future<void> saveIncident(String userId, String incidentId) async {
    await _firestore.collection('users').doc(userId).update({
      'savedIncidents': FieldValue.arrayUnion([incidentId]),
    });
  }

  // Remove saved incident
  Future<void> removeSavedIncident(String userId, String incidentId) async {
    await _firestore.collection('users').doc(userId).update({
      'savedIncidents': FieldValue.arrayRemove([incidentId]),
    });
  }

  // Get saved incidents
  Stream<List<Map<String, dynamic>>> getSavedIncidents(String userId) async* {
    final userDoc = await _firestore.collection('users').doc(userId).get();
    final savedIds = List<String>.from(userDoc.data()?['savedIncidents'] ?? []);

    if (savedIds.isEmpty) {
      yield [];
      return;
    }

    yield* _firestore
        .collection('incidents')
        .where(FieldPath.documentId, whereIn: savedIds)
        .snapshots()
        .map((snapshot) {
          return snapshot.docs.map((doc) {
            final data = doc.data();
            data['id'] = doc.id;
            return data;
          }).toList();
        });
  }
}
