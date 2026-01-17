// lib/screens/past_incidents_screen.dart

import 'package:flutter/material.dart';
import 'package:cloud_firestore/cloud_firestore.dart';

class PastIncidentsScreen extends StatefulWidget {
  const PastIncidentsScreen({super.key});

  @override
  State<PastIncidentsScreen> createState() => _PastIncidentsScreenState();
}

class _PastIncidentsScreenState extends State<PastIncidentsScreen> {
  final FirebaseFirestore _firestore = FirebaseFirestore.instance;
  DateTime? startDate;
  DateTime? endDate;

  final Map<String, Map<String, dynamic>> categoryConfig = {
    'road': {'icon': Icons.traffic, 'color': Colors.red},
    // 'utility': {'icon': Icons.power_off, 'color': Colors.orange},
    // 'disaster': {'icon': Icons.water_damage, 'color': Colors.blue},
    'garbage': {'icon': Icons.group, 'color': Colors.indigo},
    'crime': {'icon': Icons.warning_amber_rounded, 'color': Colors.deepOrange},
    'infrastructure': {'icon': Icons.construction, 'color': Colors.amber},
    'health': {'icon': Icons.local_hospital, 'color': Colors.pink},
    'anomaly': {'icon': Icons.more_horiz, 'color': Colors.grey},
  };

  Future<void> _selectDateRange(BuildContext context) async {
    final DateTimeRange? picked = await showDateRangePicker(
      context: context,
      firstDate: DateTime(2020),
      lastDate: DateTime.now(),
      initialDateRange: startDate != null && endDate != null
          ? DateTimeRange(start: startDate!, end: endDate!)
          : null,
      builder: (context, child) {
        return Theme(
          data: Theme.of(context).copyWith(
            colorScheme: const ColorScheme.light(
              primary: Colors.indigo,
              onPrimary: Colors.white,
            ),
          ),
          child: child!,
        );
      },
    );

    if (picked != null) {
      setState(() {
        startDate = picked.start;
        endDate = picked.end;
      });
    }
  }

  String _formatTimeAgo(DateTime date) {
    final difference = DateTime.now().difference(date);
    if (difference.inDays > 30) {
      return '${(difference.inDays / 30).floor()} month${difference.inDays > 60 ? 's' : ''} ago';
    }
    if (difference.inDays > 0) {
      return '${difference.inDays} day${difference.inDays > 1 ? 's' : ''} ago';
    }
    if (difference.inHours > 0) return '${difference.inHours} hr ago';
    if (difference.inMinutes > 0) return '${difference.inMinutes} min ago';
    return 'Just now';
  }

  Widget _buildIncidentCard(Map<String, dynamic> data) {
    final String title = data['title'] ?? 'Unknown Incident';
    final String categoryKey = (data['category'] ?? 'others').toLowerCase();
    final int reports = data['reportCount'] ?? 1;
    final int credibility = data['credibility'] ?? 50;
    final bool isVerified = data['verified'] == true;
    final Timestamp? timestamp = data['createdAt'];
    final String timeAgo = timestamp != null
        ? _formatTimeAgo(timestamp.toDate())
        : 'Unknown time';

    final config = categoryConfig[categoryKey] ?? categoryConfig['others']!;
    final Color color = config['color'];
    final IconData icon = config['icon'];

    return Container(
      margin: const EdgeInsets.only(bottom: 12),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(16),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withOpacity(0.06),
            blurRadius: 12,
            offset: const Offset(0, 4),
          ),
        ],
      ),
      child: Padding(
        padding: const EdgeInsets.all(18),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              children: [
                Container(
                  padding: const EdgeInsets.all(10),
                  decoration: BoxDecoration(
                    color: color.withOpacity(0.12),
                    borderRadius: BorderRadius.circular(12),
                  ),
                  child: Icon(icon, color: color, size: 24),
                ),
                const SizedBox(width: 14),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        title,
                        style: const TextStyle(
                          fontSize: 16,
                          fontWeight: FontWeight.w700,
                          color: Colors.black87,
                        ),
                        maxLines: 2,
                        overflow: TextOverflow.ellipsis,
                      ),
                      const SizedBox(height: 6),
                      Row(
                        children: [
                          Container(
                            padding: const EdgeInsets.symmetric(
                              horizontal: 10,
                              vertical: 4,
                            ),
                            decoration: BoxDecoration(
                              color: isVerified
                                  ? Colors.green.shade50
                                  : Colors.orange.shade50,
                              borderRadius: BorderRadius.circular(6),
                            ),
                            child: Text(
                              isVerified ? 'VERIFIED' : 'PENDING',
                              style: TextStyle(
                                fontSize: 10,
                                fontWeight: FontWeight.bold,
                                color: isVerified
                                    ? Colors.green.shade700
                                    : Colors.orange.shade700,
                              ),
                            ),
                          ),
                          const SizedBox(width: 10),
                          Text(
                            timeAgo,
                            style: TextStyle(
                              fontSize: 12,
                              color: Colors.grey.shade600,
                            ),
                          ),
                        ],
                      ),
                    ],
                  ),
                ),
                Icon(
                  Icons.arrow_forward_ios,
                  size: 18,
                  color: Colors.grey.shade400,
                ),
              ],
            ),
            const SizedBox(height: 16),
            Row(
              children: [
                _buildMetric(Icons.people_outline, '$reports reports'),
                const SizedBox(width: 20),
                _buildMetric(Icons.shield_outlined, '$credibility% credible'),
              ],
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildMetric(IconData icon, String label) {
    return Row(
      children: [
        Icon(icon, size: 16, color: Colors.grey.shade600),
        const SizedBox(width: 6),
        Text(
          label,
          style: TextStyle(
            fontSize: 13,
            color: Colors.grey.shade700,
            fontWeight: FontWeight.w500,
          ),
        ),
      ],
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.grey.shade50,
      appBar: AppBar(
        backgroundColor: Colors.white,
        elevation: 0,
        foregroundColor: Colors.black87,
        title: const Text(
          'Past Incidents',
          style: TextStyle(fontSize: 20, fontWeight: FontWeight.bold),
        ),
        centerTitle: false,
      ),
      body: Column(
        children: [
          // Enhanced Filter Bar
          Container(
            padding: const EdgeInsets.fromLTRB(20, 16, 20, 20),
            decoration: BoxDecoration(
              color: Colors.white,
              boxShadow: [
                BoxShadow(
                  color: Colors.black.withOpacity(0.04),
                  blurRadius: 8,
                  offset: const Offset(0, 2),
                ),
              ],
            ),
            child: Row(
              children: [
                Expanded(
                  child: ElevatedButton.icon(
                    onPressed: () => _selectDateRange(context),
                    icon: const Icon(Icons.date_range_rounded, size: 20),
                    label: Text(
                      startDate == null
                          ? 'Select Date Range'
                          : '${startDate!.toLocal().toString().split(' ')[0]} → ${endDate!.toLocal().toString().split(' ')[0]}',
                      style: const TextStyle(fontWeight: FontWeight.w600),
                    ),
                    style: ElevatedButton.styleFrom(
                      backgroundColor: Colors.indigo.shade600,
                      foregroundColor: Colors.white,
                      padding: const EdgeInsets.symmetric(vertical: 14),
                      shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(14),
                      ),
                      elevation: 0,
                    ),
                  ),
                ),
                const SizedBox(width: 12),
                if (startDate != null)
                  IconButton(
                    onPressed: () => setState(() => startDate = endDate = null),
                    icon: Container(
                      padding: const EdgeInsets.all(8),
                      decoration: BoxDecoration(
                        color: Colors.grey.shade200,
                        shape: BoxShape.circle,
                      ),
                      child: const Icon(Icons.clear, size: 18),
                    ),
                    tooltip: 'Clear filter',
                  ),
              ],
            ),
          ),

          // Incident List
          Expanded(
            child: StreamBuilder<QuerySnapshot>(
              stream: _firestore
                  .collection('incidents')
                  .orderBy('createdAt', descending: true)
                  .snapshots(),
              builder: (context, snapshot) {
                if (snapshot.hasError) {
                  return Center(
                    child: Text(
                      'Error: ${snapshot.error}',
                      style: const TextStyle(color: Colors.red),
                    ),
                  );
                }
                if (!snapshot.hasData) {
                  return const Center(child: CircularProgressIndicator());
                }

                var docs = snapshot.data!.docs;

                // Apply date filter
                if (startDate != null && endDate != null) {
                  docs = docs.where((doc) {
                    final data = doc.data() as Map<String, dynamic>;
                    final Timestamp? ts = data['createdAt'];
                    if (ts == null) return false;
                    final date = ts.toDate();
                    return date.isAfter(
                          startDate!.subtract(const Duration(days: 1)),
                        ) &&
                        date.isBefore(endDate!.add(const Duration(days: 1)));
                  }).toList();
                }

                if (docs.isEmpty) {
                  return Center(
                    child: Padding(
                      padding: const EdgeInsets.all(32),
                      child: Column(
                        mainAxisSize: MainAxisSize.min,
                        children: [
                          Icon(
                            Icons.history_rounded,
                            size: 80,
                            color: Colors.grey.shade300,
                          ),
                          const SizedBox(height: 20),
                          Text(
                            startDate == null
                                ? 'No past incidents yet'
                                : 'No incidents in selected range',
                            style: TextStyle(
                              fontSize: 18,
                              color: Colors.grey.shade600,
                              fontWeight: FontWeight.w600,
                            ),
                          ),
                          const SizedBox(height: 8),
                          Text(
                            'Try adjusting the date range',
                            style: TextStyle(color: Colors.grey.shade500),
                          ),
                        ],
                      ),
                    ),
                  );
                }

                return ListView.builder(
                  padding: const EdgeInsets.fromLTRB(20, 20, 20, 100),
                  itemCount: docs.length,
                  itemBuilder: (context, index) {
                    final data = docs[index].data() as Map<String, dynamic>;
                    return _buildIncidentCard(data);
                  },
                );
              },
            ),
          ),
        ],
      ),
    );
  }
}
