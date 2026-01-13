import 'package:flutter/material.dart';
import 'package:cloud_firestore/cloud_firestore.dart';
import 'package:nagar_alert_app/screens/ai_chat_screen.dart';
import 'package:nagar_alert_app/screens/past_incident.dart';
import 'package:nagar_alert_app/screens/report_incidents_page.dart';

class DashboardScreen extends StatefulWidget {
  const DashboardScreen({super.key});

  @override
  State<DashboardScreen> createState() => _DashboardScreenState();
}

class _DashboardScreenState extends State<DashboardScreen> {
  final FirebaseFirestore _firestore = FirebaseFirestore.instance;

  // Updated mapping using 'category' field from Firestore
  final Map<String, Map<String, dynamic>> categoryConfig = {
    'traffic': {'icon': Icons.traffic, 'color': Colors.red},
    'utility': {'icon': Icons.power_off, 'color': Colors.orange},
    'disaster': {'icon': Icons.water_damage, 'color': Colors.blue},
    'protest': {'icon': Icons.group, 'color': Colors.indigo},
    'crime': {'icon': Icons.warning_amber_rounded, 'color': Colors.deepOrange},
    'infrastructure': {'icon': Icons.construction, 'color': Colors.amber},
    'health': {'icon': Icons.local_hospital, 'color': Colors.pink},
    'others': {'icon': Icons.more_horiz, 'color': Colors.grey},
  };

  DateTime get twoHoursAgo => DateTime.now().subtract(const Duration(hours: 2));
  DateTime get _now => DateTime.now(); // For easy testing/mocking if needed
  DateTime get _startOfMonth => DateTime(_now.year, _now.month, 1);
  DateTime get _endOfMonth => DateTime(
    _now.year,
    _now.month + 1,
    1,
  ).subtract(const Duration(seconds: 1));

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.grey.shade50,
      appBar: AppBar(
        backgroundColor: Colors.white,
        elevation: 0,
        title: Row(
          children: [
            Stack(
              alignment: Alignment.center,
              children: [
                Container(
                  width: 44,
                  height: 44,
                  decoration: BoxDecoration(
                    gradient: LinearGradient(
                      begin: Alignment.topLeft,
                      end: Alignment.bottomRight,
                      colors: [Colors.blue.shade500, Colors.indigo.shade700],
                    ),
                    borderRadius: BorderRadius.circular(12),
                    boxShadow: [
                      BoxShadow(
                        color: Colors.blue.shade300.withOpacity(0.5),
                        blurRadius: 8,
                        offset: const Offset(0, 3),
                      ),
                    ],
                  ),
                  child: Stack(
                    alignment: Alignment.center,
                    children: [
                      const Icon(
                        Icons.location_on_rounded,
                        size: 26,
                        color: Colors.white,
                      ),
                      Positioned(
                        top: 12,
                        child: Container(
                          width: 8,
                          height: 8,
                          decoration: BoxDecoration(
                            shape: BoxShape.circle,
                            color: Colors.amber.shade400,
                            border: Border.all(color: Colors.white, width: 1.5),
                          ),
                        ),
                      ),
                    ],
                  ),
                ),
              ],
            ),
            const SizedBox(width: 12),
            Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                ShaderMask(
                  shaderCallback: (bounds) => LinearGradient(
                    colors: [Colors.blue.shade700, Colors.indigo.shade600],
                  ).createShader(bounds),
                  child: const Text(
                    'Nagar Alert Hub',
                    style: TextStyle(
                      fontSize: 18,
                      fontWeight: FontWeight.w800,
                      color: Colors.white,
                    ),
                  ),
                ),
                Row(
                  children: [
                    Icon(
                      Icons.location_on,
                      size: 12,
                      color: Colors.grey.shade600,
                    ),
                    const SizedBox(width: 2),
                    Text(
                      'Jamshedpur, Jharkhand',
                      style: TextStyle(
                        fontSize: 11,
                        color: Colors.grey.shade600,
                        fontWeight: FontWeight.w500,
                      ),
                    ),
                  ],
                ),
              ],
            ),
          ],
        ),
        actions: [
          IconButton(
            icon: Stack(
              children: [
                const Icon(
                  Icons.notifications_outlined,
                  color: Colors.black87,
                  size: 26,
                ),
                Positioned(
                  right: 0,
                  top: 0,
                  child: Container(
                    width: 10,
                    height: 10,
                    decoration: const BoxDecoration(
                      color: Colors.red,
                      shape: BoxShape.circle,
                    ),
                  ),
                ),
              ],
            ),
            onPressed: () {},
          ),
          const SizedBox(width: 8),

          IconButton(
            icon: Container(
              padding: const EdgeInsets.all(4),
              decoration: BoxDecoration(
                shape: BoxShape.circle,
                gradient: LinearGradient(
                  begin: Alignment.topLeft,
                  end: Alignment.bottomRight,
                  colors: [Colors.purple.shade400, Colors.indigo.shade600],
                ),
                boxShadow: [
                  BoxShadow(
                    color: Colors.indigo.withOpacity(0.35),
                    blurRadius: 12,
                    offset: const Offset(0, 4),
                  ),
                ],
              ),
              child: const Icon(
                Icons.psychology_rounded, // or Icons.support_agent_rounded
                color: Colors.white,
                size: 26,
              ),
            ),
            onPressed: () {
              Navigator.push(
                context,
                MaterialPageRoute(builder: (context) => const AiChatScreen()),
              );
            },
          ),

          const SizedBox(width: 8),
        ],
      ),
      body: StreamBuilder<QuerySnapshot>(
        stream: _firestore
            .collection('incidents')
            .orderBy('createdAt', descending: true)
            .snapshots(),
        builder: (context, snapshot) {
          if (snapshot.hasError) {
            return Center(child: Text('Error: ${snapshot.error}'));
          }
          if (snapshot.connectionState == ConnectionState.waiting) {
            return const Center(child: CircularProgressIndicator());
          }

          final incidents = snapshot.data!.docs;

          // Filter recent (last 2 hours) and past incidents
          final recentIncidents = incidents.where((doc) {
            final data = doc.data() as Map<String, dynamic>;
            final Timestamp? timestamp = data['createdAt'];
            return timestamp != null && timestamp.toDate().isAfter(twoHoursAgo);
          }).toList();

          final pastIncidents = incidents.where((doc) {
            final data = doc.data() as Map<String, dynamic>;
            final Timestamp? timestamp = data['createdAt'];
            return timestamp != null &&
                timestamp.toDate().isBefore(twoHoursAgo);
          }).toList();

          // Dynamic stats
          final int activeAlerts = incidents.length;
          final int highPriority = incidents.where((doc) {
            final data = doc.data() as Map<String, dynamic>;
            return data['severity'] == 'high';
          }).length;
          final int inProgress = incidents.where((doc) {
            final data = doc.data() as Map<String, dynamic>;
            return data['status'] == 'investigating';
          }).length;
          // === Monthly stats (current month only) ===
          final monthlyIncidents = incidents.where((doc) {
            final data = doc.data() as Map<String, dynamic>;
            final Timestamp? ts = data['createdAt'];
            if (ts == null) return false;
            final date = ts.toDate();
            return date.isAfter(_startOfMonth) && date.isBefore(_endOfMonth);
          }).toList();

          final int monthlyVerifiedCount = monthlyIncidents.where((doc) {
            final data = doc.data() as Map<String, dynamic>;
            return data['verified'] == true;
          }).length;

          final int monthlyTotalReports = monthlyIncidents.fold<int>(0, (
            sum,
            doc,
          ) {
            final data = doc.data() as Map<String, dynamic>;
            return sum + (data['reportCount'] as int? ?? 1);
          });

          // Inside StreamBuilder builder, after monthlyIncidents or allIncidents

          // Calculate average response time for resolved incidents this month
          double avgResponseMinutes = 0;
          int resolvedCount = 0;

          final resolvedIncidentsThisMonth = monthlyIncidents.where((doc) {
            final data = doc.data() as Map<String, dynamic>;
            // Option 1: If you have 'resolvedAt' field
            return data['resolvedAt'] != null;
            // Option 2: Or if you use status == 'resolved'
            // return data['status'] == 'resolved';
          }).toList();

          if (resolvedIncidentsThisMonth.isNotEmpty) {
            int totalMinutes = 0;
            for (var doc in resolvedIncidentsThisMonth) {
              final data = doc.data() as Map<String, dynamic>;
              final Timestamp created = data['createdAt'] as Timestamp;
              final Timestamp? resolved = data['resolvedAt'] as Timestamp?;

              if (resolved != null) {
                final duration = resolved.toDate().difference(created.toDate());
                totalMinutes += duration.inMinutes;
              }
            }
            avgResponseMinutes =
                totalMinutes / resolvedIncidentsThisMonth.length;
            resolvedCount = resolvedIncidentsThisMonth.length;
          }

          // Format nicely
          String displayTime;
          if (avgResponseMinutes < 60) {
            displayTime = '${avgResponseMinutes.toStringAsFixed(1)} minutes';
          } else {
            final hours = (avgResponseMinutes / 60).floor();
            final mins = (avgResponseMinutes % 60).round();
            displayTime = '$hours hr ${mins > 0 ? '$mins min' : ''}';
          }

          String trendText =
              '↓ 12%'; // You can calculate real trend vs last month later
          Color trendColor = Colors.green.shade700;

          return SingleChildScrollView(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Container(
                  color: Colors.white,
                  padding: const EdgeInsets.fromLTRB(20, 24, 20, 20),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Row(
                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                        children: [
                          const Text(
                            'Today\'s Overview',
                            style: TextStyle(
                              fontSize: 22,
                              fontWeight: FontWeight.w800,
                              color: Colors.black87,
                              letterSpacing: -0.5,
                            ),
                          ),
                          Container(
                            padding: const EdgeInsets.symmetric(
                              horizontal: 12,
                              vertical: 6,
                            ),
                            decoration: BoxDecoration(
                              color: Colors.green.shade50,
                              borderRadius: BorderRadius.circular(20),
                              border: Border.all(color: Colors.green.shade200),
                            ),
                            child: Row(
                              children: [
                                Container(
                                  width: 6,
                                  height: 6,
                                  decoration: BoxDecoration(
                                    color: Colors.green.shade500,
                                    shape: BoxShape.circle,
                                  ),
                                ),
                                const SizedBox(width: 6),
                                Text(
                                  'Live',
                                  style: TextStyle(
                                    fontSize: 11,
                                    fontWeight: FontWeight.w700,
                                    color: Colors.green.shade700,
                                  ),
                                ),
                              ],
                            ),
                          ),
                        ],
                      ),
                      const SizedBox(height: 20),
                      Container(
                        width: double.infinity,
                        padding: const EdgeInsets.all(20),
                        decoration: BoxDecoration(
                          gradient: LinearGradient(
                            begin: Alignment.topLeft,
                            end: Alignment.bottomRight,
                            colors: [
                              Colors.blue.shade600,
                              Colors.blue.shade700,
                              Colors.indigo.shade800,
                            ],
                          ),
                          borderRadius: BorderRadius.circular(20),
                          boxShadow: [
                            BoxShadow(
                              color: Colors.blue.shade400.withOpacity(0.4),
                              blurRadius: 20,
                              offset: const Offset(0, 10),
                            ),
                          ],
                        ),
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Row(
                              mainAxisAlignment: MainAxisAlignment.spaceBetween,
                              children: [
                                Container(
                                  padding: const EdgeInsets.all(10),
                                  decoration: BoxDecoration(
                                    color: Colors.white.withOpacity(0.2),
                                    borderRadius: BorderRadius.circular(12),
                                  ),
                                  child: const Icon(
                                    Icons.warning_amber_rounded,
                                    color: Colors.white,
                                    size: 24,
                                  ),
                                ),
                                Container(
                                  padding: const EdgeInsets.symmetric(
                                    horizontal: 10,
                                    vertical: 4,
                                  ),
                                  decoration: BoxDecoration(
                                    color: Colors.orange.shade400,
                                    borderRadius: BorderRadius.circular(8),
                                  ),
                                  child: const Text(
                                    '↑ 12%',
                                    style: TextStyle(
                                      fontSize: 12,
                                      fontWeight: FontWeight.w700,
                                      color: Colors.white,
                                    ),
                                  ),
                                ),
                              ],
                            ),
                            const SizedBox(height: 16),
                            Text(
                              '$activeAlerts',
                              style: const TextStyle(
                                fontSize: 42,
                                fontWeight: FontWeight.w900,
                                color: Colors.white,
                                height: 1.1,
                                letterSpacing: -1,
                              ),
                            ),
                            const SizedBox(height: 4),
                            Text(
                              'Active Alerts Right Now',
                              style: TextStyle(
                                fontSize: 15,
                                fontWeight: FontWeight.w500,
                                color: Colors.white.withOpacity(0.9),
                              ),
                            ),
                            const SizedBox(height: 12),
                            Row(
                              children: [
                                _buildMiniStat(
                                  '$highPriority',
                                  'High Priority',
                                  Colors.red.shade300,
                                ),
                                const SizedBox(width: 16),
                                _buildMiniStat(
                                  '$inProgress',
                                  'In Progress',
                                  Colors.amber.shade300,
                                ),
                              ],
                            ),
                          ],
                        ),
                      ),
                      const SizedBox(height: 16),
                      Row(
                        children: [
                          Expanded(
                            child: _buildModernStatCard(
                              '$monthlyVerifiedCount',
                              'Verified this month',
                              Icons.verified_rounded,
                              Colors.green,
                              'Incidents confirmed in ${_getMonthName(_now.month)}',
                            ),
                          ),
                          const SizedBox(width: 12),
                          Expanded(
                            child: _buildModernStatCard(
                              '$monthlyTotalReports',
                              'Reports this month',
                              Icons.bar_chart_rounded,
                              Colors.purple,
                              'Citizen reports in ${_getMonthName(_now.month)}',
                            ),
                          ),
                        ],
                      ),
                      const SizedBox(height: 12),
                      Container(
                        width: double.infinity,
                        padding: const EdgeInsets.all(18),
                        decoration: BoxDecoration(
                          color: Colors.grey.shade50,
                          borderRadius: BorderRadius.circular(16),
                          border: Border.all(color: Colors.grey.shade200),
                        ),
                        child: Row(
                          children: [
                            Container(
                              padding: const EdgeInsets.all(12),
                              decoration: BoxDecoration(
                                color: Colors.teal.shade50,
                                borderRadius: BorderRadius.circular(12),
                              ),
                              child: Icon(
                                Icons.timer_rounded,
                                color: Colors.teal.shade600,
                                size: 28,
                              ),
                            ),
                            const SizedBox(width: 16),
                            Expanded(
                              child: Column(
                                crossAxisAlignment: CrossAxisAlignment.start,
                                children: [
                                  Text(
                                    'Avg Response Time',
                                    style: TextStyle(
                                      fontSize: 13,
                                      fontWeight: FontWeight.w600,
                                      color: Colors.grey.shade600,
                                    ),
                                  ),
                                  const SizedBox(height: 6),
                                  Row(
                                    crossAxisAlignment:
                                        CrossAxisAlignment.baseline,
                                    textBaseline: TextBaseline.alphabetic,
                                    children: [
                                      Text(
                                        avgResponseMinutes == 0
                                            ? '-'
                                            : displayTime.split(' ')[0],
                                        style: TextStyle(
                                          fontSize: 32,
                                          fontWeight: FontWeight.w900,
                                          color: Colors.teal.shade700,
                                        ),
                                      ),
                                      if (avgResponseMinutes >= 60)
                                        Padding(
                                          padding: const EdgeInsets.only(
                                            left: 4,
                                          ),
                                          child: Text(
                                            displayTime.contains('hr')
                                                ? 'hr'
                                                : 'min',
                                            style: TextStyle(
                                              fontSize: 16,
                                              fontWeight: FontWeight.w600,
                                              color: Colors.teal.shade600,
                                            ),
                                          ),
                                        ),
                                      if (avgResponseMinutes > 0 &&
                                          avgResponseMinutes < 60)
                                        Text(
                                          ' min',
                                          style: TextStyle(
                                            fontSize: 16,
                                            fontWeight: FontWeight.w600,
                                            color: Colors.teal.shade600,
                                          ),
                                        ),
                                    ],
                                  ),
                                  if (avgResponseMinutes > 0)
                                    Text(
                                      displayTime.contains('hr')
                                          ? displayTime.split('hr')[1].trim()
                                          : '',
                                      style: TextStyle(
                                        fontSize: 14,
                                        color: Colors.grey.shade600,
                                      ),
                                    ),
                                  const SizedBox(height: 4),
                                  Text(
                                    resolvedCount == 0
                                        ? 'No resolved incidents yet'
                                        : 'Based on $resolvedCount resolved cases this month',
                                    style: TextStyle(
                                      fontSize: 12,
                                      color: Colors.grey.shade500,
                                    ),
                                  ),
                                ],
                              ),
                            ),
                            // Trend indicator
                            Container(
                              padding: const EdgeInsets.symmetric(
                                horizontal: 10,
                                vertical: 6,
                              ),
                              decoration: BoxDecoration(
                                color: Colors.green.shade50,
                                borderRadius: BorderRadius.circular(8),
                                border: Border.all(
                                  color: Colors.green.shade200,
                                ),
                              ),
                              child: Row(
                                children: [
                                  Icon(
                                    Icons.trending_down_rounded,
                                    size: 16,
                                    color: trendColor,
                                  ),
                                  const SizedBox(width: 4),
                                  Text(
                                    trendText,
                                    style: TextStyle(
                                      fontSize: 13,
                                      fontWeight: FontWeight.w700,
                                      color: trendColor,
                                    ),
                                  ),
                                ],
                              ),
                            ),
                          ],
                        ),
                      ),
                    ],
                  ),
                ),
                const SizedBox(height: 8),
                Padding(
                  padding: const EdgeInsets.fromLTRB(20, 20, 20, 12),
                  child: Text(
                    'Recent Incidents (Last 2 Hours)',
                    style: TextStyle(
                      fontSize: 20,
                      fontWeight: FontWeight.bold,
                      color: Colors.black87,
                    ),
                  ),
                ),
                recentIncidents.isEmpty
                    ? Padding(
                        padding: const EdgeInsets.symmetric(horizontal: 20),
                        child: Text(
                          'No incidents in the last 2 hours.',
                          style: TextStyle(color: Colors.grey.shade600),
                        ),
                      )
                    : ListView.builder(
                        shrinkWrap: true,
                        physics: const NeverScrollableScrollPhysics(),
                        padding: const EdgeInsets.symmetric(horizontal: 20),
                        itemCount: recentIncidents.length,
                        itemBuilder: (context, index) {
                          final doc = incidents[index];
                          final data = doc.data() as Map<String, dynamic>;
                          final String title =
                              data['title'] ?? 'Unknown Incident';
                          final String category =
                              data['category'] ?? 'others'; // ← Use 'category'
                          final String severity = data['severity'] ?? 'medium';
                          final String status = data['status'] ?? 'pending';
                          final int reports = data['reportCount'] ?? 1;
                          final int credibility = data['credibility'] ?? 50;
                          final Timestamp? timestamp = data['createdAt'];
                          final String timeAgo = timestamp != null
                              ? _formatTimeAgo(timestamp.toDate())
                              : 'Just now';
                          // Get correct icon and color from category
                          final String categoryKey = category.toLowerCase();
                          final config =
                              categoryConfig[categoryKey] ??
                              categoryConfig['others']!;
                          final Color color = config['color'];
                          final IconData icon = config['icon'];
                          return _buildIncidentCard({
                            'title': title,
                            'category': category,
                            'severity': severity,
                            'status': status,
                            'time': timeAgo,
                            'reports': reports,
                            'credibility': credibility,
                            'icon': icon,
                            'color': color,
                            'verified': data['verified'] == true,
                          });
                        },
                      ),

                const SizedBox(height: 20),

                Padding(
                  padding: const EdgeInsets.fromLTRB(20, 0, 20, 12),
                  child: Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Text(
                        'Past Incidents',
                        style: TextStyle(
                          fontSize: 20,
                          fontWeight: FontWeight.bold,
                          color: Colors.black87,
                        ),
                      ),
                      TextButton.icon(
                        onPressed: () {
                          Navigator.push(
                            context,
                            MaterialPageRoute(
                              builder: (context) => const PastIncidentsScreen(),
                            ),
                          );
                        },
                        icon: const Icon(Icons.bookmark, size: 18),
                        label: const Text('Click here to view'),
                        style: TextButton.styleFrom(
                          foregroundColor: Colors.blue,
                        ),
                      ),
                    ],
                  ),
                ),
                const SizedBox(height: 100),
              ],
            ),
          );
        },
      ),
      floatingActionButton: Container(
        decoration: BoxDecoration(
          gradient: LinearGradient(
            begin: Alignment.topLeft,
            end: Alignment.bottomRight,
            colors: [
              Colors.blue.shade500,
              Colors.blue.shade600,
              Colors.indigo.shade700,
            ],
          ),
          borderRadius: BorderRadius.circular(30),
          boxShadow: [
            BoxShadow(
              color: Colors.blue.shade400.withOpacity(0.5),
              blurRadius: 15,
              offset: const Offset(0, 8),
            ),
          ],
        ),
        child: FloatingActionButton.extended(
          heroTag: 'report_incident_fab',
          onPressed: () => Navigator.push(
            context,
            MaterialPageRoute(
              builder: (context) => const ReportIncidentScreen(),
            ),
          ),
          backgroundColor: Colors.transparent,
          elevation: 0,
          icon: const Icon(Icons.add_alert, color: Colors.white),
          label: const Text(
            'Report Incident',
            style: TextStyle(
              color: Colors.white,
              fontWeight: FontWeight.w700,
              letterSpacing: 0.3,
            ),
          ),
        ),
      ),
    );
  }

  String _formatTimeAgo(DateTime date) {
    final now = DateTime.now();
    final difference = now.difference(date);
    if (difference.inMinutes < 1) return 'Just now';
    if (difference.inMinutes < 60) return '${difference.inMinutes} min ago';
    if (difference.inHours < 24) return '${difference.inHours} hr ago';
    return '${difference.inDays} day${difference.inDays > 1 ? 's' : ''} ago';
  }

  Widget _buildMiniStat(String value, String label, Color color) {
    return Row(
      children: [
        Container(
          width: 8,
          height: 8,
          decoration: BoxDecoration(color: color, shape: BoxShape.circle),
        ),
        const SizedBox(width: 8),
        Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              value,
              style: const TextStyle(
                fontSize: 18,
                fontWeight: FontWeight.w800,
                color: Colors.white,
              ),
            ),
            Text(
              label,
              style: TextStyle(
                fontSize: 11,
                fontWeight: FontWeight.w500,
                color: Colors.white.withOpacity(0.8),
              ),
            ),
          ],
        ),
      ],
    );
  }

  Widget _buildModernStatCard(
    String value,
    String label,
    IconData icon,
    Color color,
    String subtitle,
  ) {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: Colors.grey.shade200),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withOpacity(0.04),
            blurRadius: 10,
            offset: const Offset(0, 4),
          ),
        ],
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Container(
            padding: const EdgeInsets.all(8),
            decoration: BoxDecoration(
              color: color.withOpacity(0.1),
              borderRadius: BorderRadius.circular(10),
            ),
            child: Icon(icon, color: color, size: 20),
          ),
          const SizedBox(height: 12),
          Text(
            value,
            style: TextStyle(
              fontSize: 26,
              fontWeight: FontWeight.w900,
              color: color,
              letterSpacing: -0.5,
            ),
          ),
          const SizedBox(height: 4),
          Text(
            label,
            style: TextStyle(
              fontSize: 13,
              fontWeight: FontWeight.w600,
              color: Colors.grey.shade700,
            ),
          ),
          const SizedBox(height: 8),
          Text(
            subtitle,
            style: TextStyle(
              fontSize: 11,
              fontWeight: FontWeight.w500,
              color: Colors.grey.shade500,
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildIncidentCard(Map<String, dynamic> incident) {
    final bool isVerified = incident['verified'] == true;

    return Container(
      margin: const EdgeInsets.only(bottom: 12),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(12),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withOpacity(0.04),
            blurRadius: 10,
            offset: const Offset(0, 2),
          ),
        ],
      ),
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              children: [
                Container(
                  padding: const EdgeInsets.all(8),
                  decoration: BoxDecoration(
                    color: (incident['color'] as Color).withOpacity(0.1),
                    borderRadius: BorderRadius.circular(8),
                  ),
                  child: Icon(
                    incident['icon'],
                    color: incident['color'],
                    size: 20,
                  ),
                ),
                const SizedBox(width: 12),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        incident['title'],
                        style: const TextStyle(
                          fontSize: 15,
                          fontWeight: FontWeight.w600,
                          color: Colors.black87,
                        ),
                      ),
                      const SizedBox(height: 4),
                      Row(
                        children: [
                          Container(
                            padding: const EdgeInsets.symmetric(
                              horizontal: 8,
                              vertical: 2,
                            ),
                            decoration: BoxDecoration(
                              color: isVerified
                                  ? Colors.green.shade50
                                  : Colors.orange.shade50,
                              borderRadius: BorderRadius.circular(4),
                            ),
                            child: Text(
                              isVerified ? 'VERIFIED' : 'PENDING',
                              style: TextStyle(
                                fontSize: 10,
                                fontWeight: FontWeight.w600,
                                color: isVerified
                                    ? Colors.green.shade700
                                    : Colors.orange.shade700,
                              ),
                            ),
                          ),
                          const SizedBox(width: 8),
                          Text(
                            incident['time'],
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
              ],
            ),
            const SizedBox(height: 12),
            Row(
              children: [
                _buildIncidentMetric(
                  Icons.people,
                  '${incident['reports']} reports',
                ),
                const SizedBox(width: 16),
                _buildIncidentMetric(
                  Icons.verified,
                  '${incident['credibility']}% credible',
                ),
                const Spacer(),
                Icon(
                  Icons.arrow_forward_ios,
                  size: 16,
                  color: Colors.grey.shade400,
                ),
              ],
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildIncidentMetric(IconData icon, String text) {
    return Row(
      children: [
        Icon(icon, size: 14, color: Colors.grey.shade600),
        const SizedBox(width: 4),
        Text(text, style: TextStyle(fontSize: 12, color: Colors.grey.shade700)),
      ],
    );
  }
}

String _getMonthName(int month) {
  const months = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];
  return months[month - 1];
}



/// CODE FOR CHECKING AND SETTING AVG RESPONSE TIME AFTER THE ADMIN RESOLVES THE ISSUE.

/* 

Future<void> resolveIncident(String incidentId, String note, String adminId) async {
  await FirebaseFirestore.instance
      .collection('incidents')
      .doc(incidentId)
      .update({
    'status': 'resolved',
    'resolvedAt': FieldValue.serverTimestamp(),  // Accurate server time
    'resolvedBy': adminId,                       // or admin name/email
    'resolutionNote': note.trim().isEmpty ? null : note.trim(),
  });
}

 */