// lib/providers/incident_provider.dart

import 'package:flutter/foundation.dart';
import 'dart:async';
import '../services/incident_service.dart';

class IncidentProvider with ChangeNotifier {
  final IncidentService _incidentService = IncidentService();

  List<Map<String, dynamic>> _incidents = [];
  bool _isLoading = false;
  String? _error;
  StreamSubscription? _incidentSubscription;

  List<Map<String, dynamic>> get incidents => _incidents;
  bool get isLoading => _isLoading;
  String? get error => _error;

  // Listen to incidents stream
  void listenToIncidents({String? category, bool onlyVerified = false}) {
    _isLoading = true;
    notifyListeners();

    // Cancel previous subscription if exists
    _incidentSubscription?.cancel();

    _incidentSubscription = _incidentService
        .getIncidentsStream(category: category, onlyVerified: onlyVerified)
        .listen(
          (incidents) {
            _incidents = incidents;
            _isLoading = false;
            _error = null;
            notifyListeners();
          },
          onError: (error) {
            _error = error.toString();
            _isLoading = false;
            notifyListeners();
          },
        );
  }

  // Filter incidents by category (client-side filtering)
  List<Map<String, dynamic>> filterByCategory(String category) {
    if (category == 'All') return _incidents;
    return _incidents
        .where(
          (incident) =>
              incident['category']?.toLowerCase() == category.toLowerCase(),
        )
        .toList();
  }

  // Get incidents by severity
  List<Map<String, dynamic>> getIncidentsBySeverity(String severity) {
    return _incidents
        .where(
          (incident) =>
              incident['severity']?.toLowerCase() == severity.toLowerCase(),
        )
        .toList();
  }

  // Get incidents by status
  List<Map<String, dynamic>> getIncidentsByStatus(String status) {
    return _incidents
        .where(
          (incident) =>
              incident['status']?.toLowerCase() == status.toLowerCase(),
        )
        .toList();
  }

  // Get verified incidents only
  List<Map<String, dynamic>> getVerifiedIncidents() {
    return _incidents
        .where((incident) => incident['verified'] == true)
        .toList();
  }

  // Get pending incidents
  List<Map<String, dynamic>> getPendingIncidents() {
    return _incidents
        .where((incident) => incident['verified'] == false)
        .toList();
  }

  // Refresh incidents
  void refreshIncidents({String? category, bool onlyVerified = false}) {
    listenToIncidents(category: category, onlyVerified: onlyVerified);
  }

  // Clear error
  void clearError() {
    _error = null;
    notifyListeners();
  }

  @override
  void dispose() {
    _incidentSubscription?.cancel();
    super.dispose();
  }
}
