import 'package:flutter/foundation.dart';
import '../services/incident_service.dart';

class IncidentProvider with ChangeNotifier {
  final IncidentService _incidentService = IncidentService();

  List<Map<String, dynamic>> _incidents = [];
  bool _isLoading = false;
  String? _error;

  List<Map<String, dynamic>> get incidents => _incidents;
  bool get isLoading => _isLoading;
  String? get error => _error;

  // Listen to incidents stream
  void listenToIncidents({String? category, String? status}) {
    _isLoading = true;
    notifyListeners();

    _incidentService
        .getIncidents(category: category, status: status)
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

  // Filter incidents by category
  List<Map<String, dynamic>> filterByCategory(String category) {
    if (category == 'All') return _incidents;
    return _incidents
        .where((incident) => incident['category'] == category.toLowerCase())
        .toList();
  }

  // Get incidents by severity
  List<Map<String, dynamic>> getIncidentsBySeverity(String severity) {
    return _incidents
        .where((incident) => incident['severity'] == severity)
        .toList();
  }
}
