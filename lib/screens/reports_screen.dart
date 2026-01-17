// import 'package:flutter/material.dart';
// import 'package:cloud_firestore/cloud_firestore.dart';
// import 'package:firebase_auth/firebase_auth.dart';
// import 'package:nagar_alert_app/screens/discussion_screen.dart';

// class ReportsScreen extends StatefulWidget {
//   const ReportsScreen({Key? key}) : super(key: key);

//   @override
//   State<ReportsScreen> createState() => _ReportsScreenState();
// }

// class _ReportsScreenState extends State<ReportsScreen>
//     with SingleTickerProviderStateMixin {
//   late TabController _tabController;
//   String _selectedFilter = 'All';

//   final FirebaseAuth _auth = FirebaseAuth.instance;
//   final FirebaseFirestore _firestore = FirebaseFirestore.instance;

//   // Complete category → icon & color mapping
//   final Map<String, Map<String, dynamic>> categoryConfig = {
//     'traffic': {'icon': Icons.traffic, 'color': Colors.red},
//     'utility': {'icon': Icons.power_off, 'color': Colors.orange},
//     'disaster': {'icon': Icons.water_damage, 'color': Colors.blue},
//     'protest': {'icon': Icons.group, 'color': Colors.indigo},
//     'crime': {'icon': Icons.warning_amber_rounded, 'color': Colors.deepOrange},
//     'infrastructure': {'icon': Icons.construction, 'color': Colors.amber},
//     'health': {'icon': Icons.local_hospital, 'color': Colors.pink},
//     'others': {'icon': Icons.more_horiz, 'color': Colors.grey},
//   };

//   @override
//   void initState() {
//     super.initState();
//     _tabController = TabController(length: 3, vsync: this);
//   }

//   @override
//   void dispose() {
//     _tabController.dispose();
//     super.dispose();
//   }

//   String _formatTimeAgo(DateTime dateTime) {
//     final difference = DateTime.now().difference(dateTime);
//     if (difference.inMinutes < 1) return 'Just now';
//     if (difference.inMinutes < 60) return '${difference.inMinutes}m ago';
//     if (difference.inHours < 24) return '${difference.inHours}h ago';
//     if (difference.inDays < 7) return '${difference.inDays}d ago';
//     return '${(difference.inDays / 7).floor()}w ago';
//   }

//   // Increment view count when report is viewed
//   Future<void> _incrementViewCount(String incidentId) async {
//     await _firestore.collection('incidents').doc(incidentId).update({
//       'viewCount': FieldValue.increment(1),
//     });
//   }

//   // Upvote functionality
//   Future<void> _upvoteIncident(String incidentId, int currentUpvotes) async {
//     final user = _auth.currentUser;
//     if (user == null) {
//       ScaffoldMessenger.of(
//         context,
//       ).showSnackBar(const SnackBar(content: Text('Please log in to upvote')));
//       return;
//     }

//     final docRef = _firestore.collection('incidents').doc(incidentId);
//     await _firestore.runTransaction((transaction) async {
//       final snapshot = await transaction.get(docRef);
//       if (!snapshot.exists) return;

//       final data = snapshot.data() as Map<String, dynamic>;
//       final upvotedBy = data['upvotedBy'] as List<dynamic>? ?? [];

//       if (upvotedBy.contains(user.uid)) {
//         // Already upvoted → remove upvote
//         transaction.update(docRef, {
//           'upvotes': FieldValue.increment(-1),
//           'upvotedBy': FieldValue.arrayRemove([user.uid]),
//         });
//       } else {
//         // Not upvoted → add upvote
//         transaction.update(docRef, {
//           'upvotes': FieldValue.increment(1),
//           'upvotedBy': FieldValue.arrayUnion([user.uid]),
//         });
//         // Also increment credibility slightly
//         transaction.update(docRef, {'credibility': FieldValue.increment(5)});
//       }
//     });
//   }

//   @override
//   Widget build(BuildContext context) {
//     final User? currentUser = _auth.currentUser;

//     return Scaffold(
//       backgroundColor: Colors.grey.shade50,
//       body: NestedScrollView(
//         headerSliverBuilder: (context, innerBoxIsScrolled) => [
//           SliverAppBar(
//             floating: true,
//             pinned: true,
//             snap: false,
//             backgroundColor: Colors.white,
//             elevation: 0,
//             expandedHeight: 120,
//             flexibleSpace: FlexibleSpaceBar(
//               background: Container(
//                 decoration: BoxDecoration(
//                   gradient: LinearGradient(
//                     begin: Alignment.topLeft,
//                     end: Alignment.bottomRight,
//                     colors: [Colors.blue.shade50, Colors.indigo.shade50],
//                   ),
//                 ),
//                 child: SafeArea(
//                   child: Padding(
//                     padding: const EdgeInsets.fromLTRB(20, 16, 20, 0),
//                     child: Column(
//                       crossAxisAlignment: CrossAxisAlignment.start,
//                       children: [
//                         Row(
//                           mainAxisAlignment: MainAxisAlignment.spaceBetween,
//                           children: [
//                             Column(
//                               crossAxisAlignment: CrossAxisAlignment.start,
//                               children: [
//                                 ShaderMask(
//                                   shaderCallback: (bounds) => LinearGradient(
//                                     colors: [
//                                       Colors.blue.shade700,
//                                       Colors.indigo.shade600,
//                                     ],
//                                   ).createShader(bounds),
//                                   child: const Text(
//                                     'Reports',
//                                     style: TextStyle(
//                                       fontSize: 28,
//                                       fontWeight: FontWeight.w900,
//                                       color: Colors.white,
//                                       letterSpacing: -0.5,
//                                     ),
//                                   ),
//                                 ),
//                                 const SizedBox(height: 2),
//                                 Text(
//                                   'Track incidents in your area',
//                                   style: TextStyle(
//                                     fontSize: 12,
//                                     color: Colors.grey.shade700,
//                                     fontWeight: FontWeight.w500,
//                                   ),
//                                   overflow: TextOverflow.ellipsis,
//                                   maxLines: 1,
//                                 ),
//                               ],
//                             ),
//                             IconButton(
//                               onPressed: _showFilterBottomSheet,
//                               icon: Container(
//                                 padding: const EdgeInsets.all(8),
//                                 decoration: BoxDecoration(
//                                   color: Colors.white,
//                                   borderRadius: BorderRadius.circular(10),
//                                   boxShadow: [
//                                     BoxShadow(
//                                       color: Colors.black.withOpacity(0.05),
//                                       blurRadius: 10,
//                                     ),
//                                   ],
//                                 ),
//                                 child: Icon(
//                                   Icons.tune_rounded,
//                                   color: Colors.blue.shade600,
//                                   size: 22,
//                                 ),
//                               ),
//                             ),
//                           ],
//                         ),
//                       ],
//                     ),
//                   ),
//                 ),
//               ),
//             ),
//             bottom: PreferredSize(
//               preferredSize: const Size.fromHeight(60),
//               child: Container(
//                 color: Colors.white,
//                 padding: const EdgeInsets.symmetric(vertical: 4),
//                 child: TabBar(
//                   controller: _tabController,
//                   indicatorColor: Colors.blue.shade600,
//                   indicatorWeight: 3,
//                   labelColor: Colors.blue.shade600,
//                   unselectedLabelColor: Colors.grey.shade600,
//                   labelStyle: const TextStyle(
//                     fontSize: 15,
//                     fontWeight: FontWeight.w700,
//                   ),
//                   unselectedLabelStyle: const TextStyle(
//                     fontSize: 15,
//                     fontWeight: FontWeight.w600,
//                   ),
//                   tabs: const [
//                     Tab(text: 'My Reports'),
//                     Tab(text: 'Community'),
//                     Tab(text: 'Saved'),
//                   ],
//                 ),
//               ),
//             ),
//           ),
//         ],
//         body: TabBarView(
//           controller: _tabController,
//           children: [
//             currentUser == null
//                 ? const Center(child: Text('Please log in'))
//                 : _buildMyReportsTab(currentUser.uid),
//             _buildCommunityReportsTab(),
//             _buildSavedReportsTab(),
//           ],
//         ),
//       ),
//     );
//   }

//   Widget _buildMyReportsTab(String userId) {
//     return StreamBuilder<QuerySnapshot>(
//       stream: _firestore
//           .collection('incidents')
//           .where('reportedBy', isEqualTo: userId)
//           .orderBy('createdAt', descending: true)
//           .snapshots(),
//       builder: (context, snapshot) {
//         if (snapshot.hasError)
//           return Center(child: Text('Error: ${snapshot.error}'));
//         if (snapshot.connectionState == ConnectionState.waiting)
//           return const Center(child: CircularProgressIndicator());

//         final docs = snapshot.data!.docs;
//         if (docs.isEmpty)
//           return const Center(
//             child: Text('No reports yet. Be the first to report!'),
//           );

//         final int totalReports = docs.length;
//         final int verifiedCount = docs
//             .where((doc) => (doc.data() as Map)['verified'] == true)
//             .length;
//         final DateTime now = DateTime.now();
//         final int thisMonthCount = docs.where((doc) {
//           final timestamp = (doc.data() as Map)['createdAt'] as Timestamp?;
//           if (timestamp == null) return false;
//           final date = timestamp.toDate();
//           return date.year == now.year && date.month == now.month;
//         }).length;

//         return ListView(
//           padding: const EdgeInsets.all(20),
//           children: [
//             Container(
//               padding: const EdgeInsets.all(20),
//               decoration: BoxDecoration(
//                 gradient: LinearGradient(
//                   colors: [Colors.blue.shade600, Colors.indigo.shade700],
//                 ),
//                 borderRadius: BorderRadius.circular(16),
//                 boxShadow: [
//                   BoxShadow(
//                     color: Colors.blue.shade300.withOpacity(0.4),
//                     blurRadius: 15,
//                     offset: const Offset(0, 8),
//                   ),
//                 ],
//               ),
//               child: Row(
//                 mainAxisAlignment: MainAxisAlignment.spaceAround,
//                 children: [
//                   _buildStatItem(
//                     '$totalReports',
//                     'Total Reports',
//                     Icons.description_rounded,
//                   ),
//                   Container(
//                     width: 1,
//                     height: 40,
//                     color: Colors.white.withOpacity(0.3),
//                   ),
//                   _buildStatItem(
//                     '$verifiedCount',
//                     'Verified',
//                     Icons.verified_rounded,
//                   ),
//                   Container(
//                     width: 1,
//                     height: 40,
//                     color: Colors.white.withOpacity(0.3),
//                   ),
//                   _buildStatItem(
//                     '$thisMonthCount',
//                     'This Month',
//                     Icons.calendar_today_rounded,
//                   ),
//                 ],
//               ),
//             ),
//             const SizedBox(height: 24),
//             ...docs.map((doc) {
//               final data = doc.data() as Map<String, dynamic>;
//               data['id'] = doc.id;
//               if (data['createdAt'] != null)
//                 data['time'] = _formatTimeAgo(
//                   (data['createdAt'] as Timestamp).toDate(),
//                 );

//               // Apply category config
//               final String categoryKey = (data['category'] ?? 'others')
//                   .toString()
//                   .toLowerCase();
//               final config =
//                   categoryConfig[categoryKey] ?? categoryConfig['others']!;
//               data['icon'] = config['icon'];
//               data['color'] = config['color'];

//               return _buildMyReportCard(data);
//             }).toList(),
//           ],
//         );
//       },
//     );
//   }

//   Widget _buildCommunityReportsTab() {
//     return StreamBuilder<QuerySnapshot>(
//       stream: _firestore
//           .collection('incidents')
//           .orderBy('createdAt', descending: true)
//           .snapshots(),
//       builder: (context, snapshot) {
//         if (snapshot.hasError)
//           return Center(child: Text('Error: ${snapshot.error}'));
//         if (snapshot.connectionState == ConnectionState.waiting)
//           return const Center(child: CircularProgressIndicator());

//         final docs = snapshot.data!.docs;
//         final filtered = _selectedFilter == 'All'
//             ? docs
//             : docs.where((doc) {
//                 final data = doc.data() as Map<String, dynamic>;
//                 return (data['category']?.toString().toLowerCase() ??
//                         'others') ==
//                     _selectedFilter.toLowerCase();
//               }).toList();

//         return ListView(
//           padding: const EdgeInsets.all(20),
//           children: [
//             // Filter chips (unchanged)
//             SingleChildScrollView(
//               scrollDirection: Axis.horizontal,
//               child: Row(
//                 children: [
//                   _buildFilterChip('All', Icons.apps_rounded, Colors.blue),
//                   ...categoryConfig.entries.map((entry) {
//                     return Padding(
//                       padding: const EdgeInsets.only(left: 8),
//                       child: _buildFilterChip(
//                         entry.key[0].toUpperCase() + entry.key.substring(1),
//                         entry.value['icon'],
//                         entry.value['color'],
//                       ),
//                     );
//                   }).toList(),
//                 ],
//               ),
//             ),
//             const SizedBox(height: 20),
//             if (filtered.isEmpty)
//               const Center(child: Text('No reports in this category yet'))
//             else
//               ...filtered.map((doc) {
//                 final data = doc.data() as Map<String, dynamic>;
//                 data['id'] = doc.id;
//                 data['reporter'] = data['isAnonymous'] == true
//                     ? 'Anonymous'
//                     : 'Citizen';
//                 if (data['createdAt'] != null)
//                   data['time'] = _formatTimeAgo(
//                     (data['createdAt'] as Timestamp).toDate(),
//                   );

//                 final String categoryKey = (data['category'] ?? 'others')
//                     .toString()
//                     .toLowerCase();
//                 final config =
//                     categoryConfig[categoryKey] ?? categoryConfig['others']!;
//                 data['icon'] = config['icon'];
//                 data['color'] = config['color'];

//                 // Increment view count when card is built (viewed)
//                 WidgetsBinding.instance.addPostFrameCallback((_) {
//                   _incrementViewCount(doc.id);
//                 });

//                 return _buildCommunityReportCard(data);
//               }).toList(),
//           ],
//         );
//       },
//     );
//   }

//   Widget _buildSavedReportsTab() {
//     return const Center(
//       child: Column(
//         mainAxisAlignment: MainAxisAlignment.center,
//         children: [
//           Icon(Icons.bookmark_outline_rounded, size: 80, color: Colors.grey),
//           SizedBox(height: 16),
//           Text(
//             'No Saved Reports',
//             style: TextStyle(fontSize: 20, fontWeight: FontWeight.w700),
//           ),
//           SizedBox(height: 8),
//           Text(
//             'Tap the bookmark icon on any report to save it here',
//             style: TextStyle(color: Colors.grey),
//           ),
//         ],
//       ),
//     );
//   }

//   Widget _buildStatItem(String value, String label, IconData icon) {
//     return Column(
//       children: [
//         Icon(icon, color: Colors.white.withOpacity(0.8), size: 20),
//         const SizedBox(height: 8),
//         Text(
//           value,
//           style: const TextStyle(
//             fontSize: 22,
//             fontWeight: FontWeight.w900,
//             color: Colors.white,
//           ),
//         ),
//         const SizedBox(height: 4),
//         Text(
//           label,
//           style: TextStyle(
//             fontSize: 11,
//             fontWeight: FontWeight.w600,
//             color: Colors.white.withOpacity(0.8),
//           ),
//         ),
//       ],
//     );
//   }

//   Widget _buildFilterChip(String label, IconData icon, Color color) {
//     final isSelected = _selectedFilter.toLowerCase() == label.toLowerCase();
//     return FilterChip(
//       label: Row(
//         mainAxisSize: MainAxisSize.min,
//         children: [
//           Icon(icon, size: 16, color: isSelected ? Colors.white : color),
//           const SizedBox(width: 6),
//           Text(
//             label,
//             style: TextStyle(
//               fontWeight: FontWeight.w600,
//               color: isSelected ? Colors.white : Colors.grey.shade700,
//             ),
//           ),
//         ],
//       ),
//       selected: isSelected,
//       onSelected: (selected) =>
//           setState(() => _selectedFilter = isSelected ? label : 'All'),
//       backgroundColor: Colors.white,
//       selectedColor: color,
//       checkmarkColor: Colors.white,
//       padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
//       shape: RoundedRectangleBorder(
//         borderRadius: BorderRadius.circular(20),
//         side: BorderSide(
//           color: isSelected ? color : Colors.grey.shade300,
//           width: 1.5,
//         ),
//       ),
//       elevation: isSelected ? 4 : 0,
//     );
//   }

//   Widget _buildMyReportCard(Map<String, dynamic> report) {
//     final bool isVerified = report['verified'] == true;
//     final Color statusColor = isVerified ? Colors.green : Colors.orange;

//     return Container(
//       margin: const EdgeInsets.only(bottom: 16),
//       decoration: BoxDecoration(
//         color: Colors.white,
//         borderRadius: BorderRadius.circular(16),
//         boxShadow: [
//           BoxShadow(
//             color: Colors.black.withOpacity(0.05),
//             blurRadius: 10,
//             offset: const Offset(0, 4),
//           ),
//         ],
//       ),
//       child: Column(
//         crossAxisAlignment: CrossAxisAlignment.start,
//         children: [
//           Padding(
//             padding: const EdgeInsets.all(16),
//             child: Row(
//               children: [
//                 Container(
//                   padding: const EdgeInsets.all(12),
//                   decoration: BoxDecoration(
//                     color: (report['color'] as Color).withOpacity(0.1),
//                     borderRadius: BorderRadius.circular(12),
//                   ),
//                   child: Icon(report['icon'], color: report['color'], size: 24),
//                 ),
//                 const SizedBox(width: 12),
//                 Expanded(
//                   child: Column(
//                     crossAxisAlignment: CrossAxisAlignment.start,
//                     children: [
//                       Row(
//                         children: [
//                           Container(
//                             padding: const EdgeInsets.symmetric(
//                               horizontal: 8,
//                               vertical: 3,
//                             ),
//                             decoration: BoxDecoration(
//                               color: statusColor.withOpacity(0.1),
//                               borderRadius: BorderRadius.circular(6),
//                             ),
//                             child: Text(
//                               isVerified ? 'VERIFIED' : 'PENDING',
//                               style: TextStyle(
//                                 fontSize: 10,
//                                 fontWeight: FontWeight.w700,
//                                 color: statusColor,
//                               ),
//                             ),
//                           ),
//                           const SizedBox(width: 8),
//                           Text(
//                             report['id'],
//                             style: TextStyle(
//                               fontSize: 12,
//                               fontWeight: FontWeight.w600,
//                               color: Colors.grey.shade500,
//                             ),
//                           ),
//                         ],
//                       ),
//                       const SizedBox(height: 8),
//                       Text(
//                         report['title'],
//                         style: const TextStyle(
//                           fontSize: 16,
//                           fontWeight: FontWeight.w700,
//                           color: Colors.black87,
//                         ),
//                       ),
//                       const SizedBox(height: 4),
//                       Row(
//                         children: [
//                           Icon(
//                             Icons.location_on,
//                             size: 14,
//                             color: Colors.grey.shade500,
//                           ),
//                           const SizedBox(width: 4),
//                           Expanded(
//                             child: Text(
//                               report['locationName'] ?? 'Unknown location',
//                               style: TextStyle(
//                                 fontSize: 13,
//                                 color: Colors.grey.shade600,
//                               ),
//                               overflow: TextOverflow.ellipsis,
//                             ),
//                           ),
//                         ],
//                       ),
//                     ],
//                   ),
//                 ),
//               ],
//             ),
//           ),
//           const Divider(height: 1),
//           Padding(
//             padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
//             child: Row(
//               children: [
//                 Flexible(
//                   child: _buildMetricChip(
//                     Icons.thumb_up_outlined,
//                     (report['upvotes'] ?? 0).toString(),
//                   ),
//                 ),
//                 const SizedBox(width: 12),
//                 Flexible(
//                   child: _buildMetricChip(
//                     Icons.visibility_outlined,
//                     (report['viewCount'] ?? 0).toString(),
//                   ),
//                 ),
//                 const SizedBox(width: 12),
//                 Flexible(
//                   child: _buildMetricChip(
//                     Icons.verified_outlined,
//                     '${report['credibility'] ?? 50}%',
//                   ),
//                 ),
//                 const Spacer(),
//                 Text(
//                   report['time'] ?? 'Unknown',
//                   style: TextStyle(
//                     fontSize: 12,
//                     fontWeight: FontWeight.w600,
//                     color: Colors.grey.shade500,
//                   ),
//                 ),
//               ],
//             ),
//           ),
//         ],
//       ),
//     );
//   }

//   Widget _buildCommunityReportCard(Map<String, dynamic> report) {
//     final bool isVerified = report['verified'] == true;
//     final Color statusColor = isVerified ? Colors.green : Colors.orange;
//     final int upvotes = report['upvotes'] ?? 0;
//     final bool hasUpvoted = (report['upvotedBy'] as List<dynamic>? ?? [])
//         .contains(_auth.currentUser?.uid);

//     return Container(
//       margin: const EdgeInsets.only(bottom: 16),
//       decoration: BoxDecoration(
//         color: Colors.white,
//         borderRadius: BorderRadius.circular(16),
//         boxShadow: [
//           BoxShadow(
//             color: Colors.black.withOpacity(0.05),
//             blurRadius: 10,
//             offset: const Offset(0, 4),
//           ),
//         ],
//       ),
//       child: Column(
//         crossAxisAlignment: CrossAxisAlignment.start,
//         children: [
//           // ... (header with category, time, reporter – unchanged)
//           Padding(
//             padding: const EdgeInsets.all(16),
//             child: Column(
//               crossAxisAlignment: CrossAxisAlignment.start,
//               children: [
//                 Row(
//                   children: [
//                     Container(
//                       padding: const EdgeInsets.all(10),
//                       decoration: BoxDecoration(
//                         color: (report['color'] as Color).withOpacity(0.1),
//                         borderRadius: BorderRadius.circular(10),
//                       ),
//                       child: Icon(
//                         report['icon'],
//                         color: report['color'],
//                         size: 20,
//                       ),
//                     ),
//                     const SizedBox(width: 12),
//                     Expanded(
//                       child: Column(
//                         crossAxisAlignment: CrossAxisAlignment.start,
//                         children: [
//                           Row(
//                             children: [
//                               Text(
//                                 report['category'] ?? 'Unknown',
//                                 style: TextStyle(
//                                   fontSize: 12,
//                                   fontWeight: FontWeight.w700,
//                                   color: report['color'],
//                                 ),
//                               ),
//                               const SizedBox(width: 8),
//                               Container(
//                                 width: 4,
//                                 height: 4,
//                                 decoration: BoxDecoration(
//                                   color: Colors.grey.shade400,
//                                   shape: BoxShape.circle,
//                                 ),
//                               ),
//                               const SizedBox(width: 8),
//                               Text(
//                                 report['time'] ?? 'Unknown',
//                                 style: TextStyle(
//                                   fontSize: 12,
//                                   color: Colors.grey.shade600,
//                                 ),
//                               ),
//                             ],
//                           ),
//                           const SizedBox(height: 4),
//                           Text(
//                             'by ${report['reporter']}',
//                             style: TextStyle(
//                               fontSize: 11,
//                               color: Colors.grey.shade500,
//                             ),
//                           ),
//                         ],
//                       ),
//                     ),
//                     IconButton(
//                       icon: const Icon(Icons.bookmark_outline_rounded),
//                       onPressed: () {},
//                       iconSize: 22,
//                       color: Colors.grey.shade600,
//                     ),
//                   ],
//                 ),
//                 const SizedBox(height: 12),
//                 Text(
//                   report['title'],
//                   style: const TextStyle(
//                     fontSize: 15,
//                     fontWeight: FontWeight.w700,
//                     color: Colors.black87,
//                   ),
//                 ),
//                 const SizedBox(height: 6),
//                 Row(
//                   children: [
//                     Icon(
//                       Icons.location_on,
//                       size: 14,
//                       color: Colors.grey.shade500,
//                     ),
//                     const SizedBox(width: 4),
//                     Expanded(
//                       child: Text(
//                         report['locationName'] ?? 'Unknown',
//                         style: TextStyle(
//                           fontSize: 13,
//                           color: Colors.grey.shade600,
//                         ),
//                         overflow: TextOverflow.ellipsis,
//                       ),
//                     ),
//                   ],
//                 ),
//               ],
//             ),
//           ),
//           const Divider(height: 1),
//           SizedBox(
//             height: 56,
//             child: Padding(
//               padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
//               child: Row(
//                 children: [
//                   // Upvote Button
//                   InkWell(
//                     onTap: () => _upvoteIncident(report['id'], upvotes),
//                     borderRadius: BorderRadius.circular(8),
//                     child: Padding(
//                       padding: const EdgeInsets.symmetric(
//                         horizontal: 12,
//                         vertical: 8,
//                       ),
//                       child: Row(
//                         mainAxisSize: MainAxisSize.min,
//                         children: [
//                           Icon(
//                             Icons.thumb_up,
//                             size: 18,
//                             color: hasUpvoted
//                                 ? Colors.blue.shade600
//                                 : Colors.grey.shade600,
//                           ),
//                           const SizedBox(width: 6),
//                           Text(
//                             upvotes.toString(),
//                             style: TextStyle(
//                               fontSize: 13,
//                               fontWeight: FontWeight.w600,
//                               color: hasUpvoted
//                                   ? Colors.blue.shade600
//                                   : Colors.grey.shade700,
//                             ),
//                           ),
//                         ],
//                       ),
//                     ),
//                   ),
//                   const SizedBox(width: 16),
//                   // Comment Button → Opens Discussion Screen
//                   InkWell(
//                     onTap: () {
//                       Navigator.push(
//                         context,
//                         MaterialPageRoute(
//                           builder: (context) => DiscussionScreen(
//                             incidentId: report['id'],
//                             incidentTitle: report['title'],
//                           ),
//                         ),
//                       );
//                     },
//                     borderRadius: BorderRadius.circular(8),
//                     child: Padding(
//                       padding: const EdgeInsets.symmetric(
//                         horizontal: 12,
//                         vertical: 8,
//                       ),
//                       child: Row(
//                         mainAxisSize: MainAxisSize.min,
//                         children: [
//                           Icon(
//                             Icons.comment_outlined,
//                             size: 18,
//                             color: Colors.grey.shade600,
//                           ),
//                           const SizedBox(width: 6),
//                           Text(
//                             'Comment',
//                             style: TextStyle(
//                               fontSize: 13,
//                               fontWeight: FontWeight.w600,
//                               color: Colors.grey.shade700,
//                             ),
//                           ),
//                         ],
//                       ),
//                     ),
//                   ),
//                   const Spacer(),
//                   Container(
//                     padding: const EdgeInsets.symmetric(
//                       horizontal: 10,
//                       vertical: 4,
//                     ),
//                     decoration: BoxDecoration(
//                       color: statusColor.withOpacity(0.1),
//                       borderRadius: BorderRadius.circular(6),
//                     ),
//                     child: Row(
//                       children: [
//                         Icon(Icons.verified, size: 12, color: statusColor),
//                         const SizedBox(width: 4),
//                         Text(
//                           '${report['credibility'] ?? 50}%',
//                           style: TextStyle(
//                             fontSize: 11,
//                             fontWeight: FontWeight.w700,
//                             color: statusColor,
//                           ),
//                         ),
//                       ],
//                     ),
//                   ),
//                 ],
//               ),
//             ),
//           ),
//         ],
//       ),
//     );
//   }

//   Widget _buildMetricChip(IconData icon, String value) {
//     return Row(
//       mainAxisSize: MainAxisSize.min,
//       children: [
//         Icon(icon, size: 16, color: Colors.grey.shade600),
//         const SizedBox(width: 4),
//         Text(
//           value,
//           style: TextStyle(
//             fontSize: 13,
//             fontWeight: FontWeight.w600,
//             color: Colors.grey.shade700,
//           ),
//         ),
//       ],
//     );
//   }

//   Widget _buildActionButton(IconData icon, String label) {
//     return InkWell(
//       onTap: () {},
//       borderRadius: BorderRadius.circular(8),
//       child: Padding(
//         padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
//         child: Row(
//           mainAxisSize: MainAxisSize.min,
//           children: [
//             Icon(icon, size: 18, color: Colors.grey.shade600),
//             const SizedBox(width: 6),
//             Text(
//               label,
//               style: TextStyle(
//                 fontSize: 13,
//                 fontWeight: FontWeight.w600,
//                 color: Colors.grey.shade700,
//               ),
//             ),
//           ],
//         ),
//       ),
//     );
//   }

//   void _showFilterBottomSheet() {
//     showModalBottomSheet(
//       context: context,
//       backgroundColor: Colors.transparent,
//       builder: (context) => Container(
//         decoration: const BoxDecoration(
//           color: Colors.white,
//           borderRadius: BorderRadius.vertical(top: Radius.circular(20)),
//         ),
//         padding: const EdgeInsets.all(24),
//         child: const Column(
//           mainAxisSize: MainAxisSize.min,
//           crossAxisAlignment: CrossAxisAlignment.start,
//           children: [
//             Text(
//               'Filter Reports',
//               style: TextStyle(fontSize: 20, fontWeight: FontWeight.w800),
//             ),
//             SizedBox(height: 20),
//             Text('Coming soon...', style: TextStyle(color: Colors.grey)),
//           ],
//         ),
//       ),
//     );
//   }
// }

import 'package:flutter/material.dart';
import 'package:cloud_firestore/cloud_firestore.dart';
import 'package:firebase_auth/firebase_auth.dart';
import 'package:nagar_alert_app/screens/report_details_page.dart';

class ReportsScreen extends StatefulWidget {
  const ReportsScreen({Key? key}) : super(key: key);

  @override
  State<ReportsScreen> createState() => _ReportsScreenState();
}

class _ReportsScreenState extends State<ReportsScreen> {
  final FirebaseAuth _auth = FirebaseAuth.instance;
  final FirebaseFirestore _firestore = FirebaseFirestore.instance;

  // Category config matching your app
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

  String _formatTimeAgo(DateTime dateTime) {
    final difference = DateTime.now().difference(dateTime);
    if (difference.inMinutes < 1) return 'Just now';
    if (difference.inMinutes < 60) return '${difference.inMinutes}m ago';
    if (difference.inHours < 24) return '${difference.inHours}h ago';
    if (difference.inDays < 7) return '${difference.inDays}d ago';
    return '${(difference.inDays / 7).floor()}w ago';
  }

  @override
  Widget build(BuildContext context) {
    final User? currentUser = _auth.currentUser;

    return Scaffold(
      backgroundColor: Colors.grey.shade50,
      body: NestedScrollView(
        headerSliverBuilder: (context, innerBoxIsScrolled) => [
          SliverAppBar(
            floating: true,
            pinned: true,
            snap: false,
            backgroundColor: Colors.white,
            elevation: 0,
            expandedHeight: 140,
            flexibleSpace: FlexibleSpaceBar(
              background: Container(
                decoration: BoxDecoration(
                  gradient: LinearGradient(
                    begin: Alignment.topLeft,
                    end: Alignment.bottomRight,
                    colors: [Colors.blue.shade50, Colors.indigo.shade50],
                  ),
                ),
                child: SafeArea(
                  child: Padding(
                    padding: const EdgeInsets.fromLTRB(20, 16, 20, 0),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        ShaderMask(
                          shaderCallback: (bounds) => LinearGradient(
                            colors: [
                              Colors.blue.shade700,
                              Colors.indigo.shade600,
                            ],
                          ).createShader(bounds),
                          child: const Text(
                            'My Reports',
                            style: TextStyle(
                              fontSize: 32,
                              fontWeight: FontWeight.w900,
                              color: Colors.white,
                              letterSpacing: -0.5,
                            ),
                          ),
                        ),
                        const SizedBox(height: 6),
                        Text(
                          'Track the status of issues you reported',
                          style: TextStyle(
                            fontSize: 14,
                            color: Colors.grey.shade700,
                            fontWeight: FontWeight.w500,
                          ),
                        ),
                      ],
                    ),
                  ),
                ),
              ),
            ),
          ),
        ],
        body: currentUser == null
            ? Center(
                child: Column(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    Icon(
                      Icons.login_rounded,
                      size: 80,
                      color: Colors.grey.shade400,
                    ),
                    const SizedBox(height: 16),
                    const Text('Please log in to view your reports'),
                  ],
                ),
              )
            : _buildMyReportsTab(currentUser.uid),
      ),
    );
  }

  Widget _buildMyReportsTab(String userId) {
    return StreamBuilder<QuerySnapshot>(
      stream: _firestore
          .collection('incidents')
          .where('reportedBy', isEqualTo: userId)
          .orderBy('createdAt', descending: true)
          .snapshots(),
      builder: (context, snapshot) {
        if (snapshot.hasError) {
          return Center(child: Text('Error: ${snapshot.error}'));
        }
        if (snapshot.connectionState == ConnectionState.waiting) {
          return const Center(child: CircularProgressIndicator());
        }

        final docs = snapshot.data!.docs;
        if (docs.isEmpty) {
          return Center(
            child: Column(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                Icon(
                  Icons.report_problem_outlined,
                  size: 80,
                  color: Colors.grey.shade400,
                ),
                const SizedBox(height: 16),
                const Text(
                  'No reports yet',
                  style: TextStyle(fontSize: 20, fontWeight: FontWeight.w700),
                ),
                const SizedBox(height: 8),
                Text(
                  'Your reported issues will appear here\nwith live status updates',
                  style: TextStyle(color: Colors.grey.shade600),
                  textAlign: TextAlign.center,
                ),
              ],
            ),
          );
        }

        // Stats
        final int total = docs.length;
        final int pending = docs
            .where((doc) => (doc['status'] ?? 'pending') == 'pending')
            .length;
        final int verified = docs
            .where((doc) => doc['verified'] == true)
            .length;
        final int resolved = docs
            .where((doc) => (doc['status'] ?? 'pending') == 'resolved')
            .length;

        return ListView(
          padding: const EdgeInsets.all(20),
          children: [
            // Summary Stats Card
            Container(
              padding: const EdgeInsets.all(20),
              decoration: BoxDecoration(
                gradient: LinearGradient(
                  colors: [Colors.blue.shade600, Colors.indigo.shade700],
                ),
                borderRadius: BorderRadius.circular(16),
                boxShadow: [
                  BoxShadow(
                    color: Colors.blue.shade300.withOpacity(0.4),
                    blurRadius: 15,
                    offset: const Offset(0, 8),
                  ),
                ],
              ),
              child: Row(
                mainAxisAlignment: MainAxisAlignment.spaceAround,
                children: [
                  _buildStat('$total', 'Total', Icons.description_rounded),
                  _buildStat('$pending', 'Pending', Icons.schedule_rounded),
                  _buildStat('$verified', 'Verified', Icons.verified_rounded),
                  _buildStat(
                    '$resolved',
                    'Resolved',
                    Icons.check_circle_rounded,
                  ),
                ],
              ),
            ),
            const SizedBox(height: 24),

            // Report Cards
            ...docs.map((doc) {
              final data = doc.data() as Map<String, dynamic>;
              data['id'] = doc.id;

              final String categoryKey = (data['category'] ?? 'others')
                  .toString()
                  .toLowerCase();
              final config =
                  categoryConfig[categoryKey] ?? categoryConfig['others']!;
              data['icon'] = config['icon'];
              data['color'] = config['color'];

              if (data['createdAt'] != null) {
                data['time'] = _formatTimeAgo(
                  (data['createdAt'] as Timestamp).toDate(),
                );
              }

              return _buildStatusCard(data);
            }).toList(),
          ],
        );
      },
    );
  }

  Widget _buildStat(String value, String label, IconData icon) {
    return Column(
      children: [
        Icon(icon, color: Colors.white.withOpacity(0.9), size: 26),
        const SizedBox(height: 8),
        Text(
          value,
          style: const TextStyle(
            fontSize: 26,
            fontWeight: FontWeight.w900,
            color: Colors.white,
          ),
        ),
        const SizedBox(height: 4),
        Text(
          label,
          style: TextStyle(
            fontSize: 12,
            fontWeight: FontWeight.w600,
            color: Colors.white.withOpacity(0.8),
          ),
        ),
      ],
    );
  }

  Widget _buildStatusCard(Map<String, dynamic> report) {
    final String status = report['status'] ?? 'pending';
    final bool isVerified = report['verified'] == true;
    final bool isAssigned = report['assignedTo'] != null;
    final bool isResolved = status == 'resolved';

    Color statusColor;
    String statusText;
    IconData statusIcon;

    if (isResolved) {
      statusColor = Colors.green;
      statusText = 'Resolved';
      statusIcon = Icons.check_circle_rounded;
    } else if (isAssigned) {
      statusColor = Colors.purple;
      statusText = 'Assigned';
      statusIcon = Icons.assignment_turned_in_rounded;
    } else if (isVerified) {
      statusColor = Colors.blue;
      statusText = 'Verified';
      statusIcon = Icons.verified_rounded;
    } else {
      statusColor = Colors.orange;
      statusText = 'Pending';
      statusIcon = Icons.schedule_rounded;
    }

    String? resolutionTime;
    if (isResolved &&
        report['createdAt'] != null &&
        report['resolvedAt'] != null) {
      final created = (report['createdAt'] as Timestamp).toDate();
      final resolved = (report['resolvedAt'] as Timestamp).toDate();
      final duration = resolved.difference(created);
      if (duration.inDays > 0) {
        resolutionTime =
            '${duration.inDays} day${duration.inDays > 1 ? 's' : ''}';
      } else if (duration.inHours > 0) {
        resolutionTime =
            '${duration.inHours} hour${duration.inHours > 1 ? 's' : ''}';
      } else {
        resolutionTime =
            '${duration.inMinutes} minute${duration.inMinutes > 1 ? 's' : ''}';
      }
    }

    return InkWell(
      onTap: () {
        Navigator.push(
          context,
          MaterialPageRoute(
            builder: (context) => ReportDetailScreen(report: report),
          ),
        );
      },
      borderRadius: BorderRadius.circular(16),

      child: Container(
        margin: const EdgeInsets.only(bottom: 20),
        padding: const EdgeInsets.all(16),
        decoration: BoxDecoration(
          color: Colors.white,
          borderRadius: BorderRadius.circular(16),
          boxShadow: [
            BoxShadow(
              color: Colors.black.withOpacity(0.06),
              blurRadius: 12,
              offset: const Offset(0, 6),
            ),
          ],
        ),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              children: [
                Container(
                  padding: const EdgeInsets.all(12),
                  decoration: BoxDecoration(
                    color: (report['color'] as Color).withOpacity(0.1),
                    borderRadius: BorderRadius.circular(12),
                  ),
                  child: Icon(report['icon'], color: report['color'], size: 28),
                ),
                const SizedBox(width: 16),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        report['title'],
                        style: const TextStyle(
                          fontSize: 17,
                          fontWeight: FontWeight.w800,
                          color: Colors.black87,
                        ),
                      ),
                      const SizedBox(height: 6),
                      Row(
                        children: [
                          Icon(
                            Icons.location_on,
                            size: 14,
                            color: Colors.grey.shade600,
                          ),
                          const SizedBox(width: 4),
                          Expanded(
                            child: Text(
                              report['locationName'] ?? 'Unknown location',
                              style: TextStyle(
                                fontSize: 13,
                                color: Colors.grey.shade700,
                              ),
                              overflow: TextOverflow.ellipsis,
                            ),
                          ),
                        ],
                      ),
                    ],
                  ),
                ),
              ],
            ),
            const SizedBox(height: 16),
            Row(
              children: [
                Container(
                  padding: const EdgeInsets.symmetric(
                    horizontal: 12,
                    vertical: 8,
                  ),
                  decoration: BoxDecoration(
                    color: statusColor.withOpacity(0.1),
                    borderRadius: BorderRadius.circular(20),
                    border: Border.all(color: statusColor.withOpacity(0.3)),
                  ),
                  child: Row(
                    mainAxisSize: MainAxisSize.min,
                    children: [
                      Icon(statusIcon, size: 18, color: statusColor),
                      const SizedBox(width: 8),
                      Text(
                        statusText,
                        style: TextStyle(
                          fontSize: 14,
                          fontWeight: FontWeight.w700,
                          color: statusColor,
                        ),
                      ),
                    ],
                  ),
                ),
                if (resolutionTime != null) ...[
                  const SizedBox(width: 12),
                  Text(
                    'Fixed in $resolutionTime',
                    style: TextStyle(
                      fontSize: 13,
                      fontWeight: FontWeight.w600,
                      color: Colors.green.shade700,
                    ),
                  ),
                ],
                const Spacer(),
                Text(
                  report['time'] ?? '',
                  style: TextStyle(fontSize: 12, color: Colors.grey.shade600),
                ),
              ],
            ),
            const SizedBox(height: 16),
            // Progress Timeline
            Row(
              children: [
                _buildDot(true, 'Reported'),
                _buildLine(),
                _buildDot(isVerified, 'Verified'),
                _buildLine(),
                _buildDot(isAssigned, 'Assigned'),
                _buildLine(),
                _buildDot(isResolved, 'Resolved'),
              ],
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildDot(bool active, String label) {
    return Expanded(
      child: Column(
        children: [
          Container(
            width: 12,
            height: 12,
            decoration: BoxDecoration(
              shape: BoxShape.circle,
              color: active ? Colors.blue.shade600 : Colors.grey.shade300,
              border: Border.all(color: Colors.white, width: 3),
              boxShadow: active
                  ? [
                      BoxShadow(
                        color: Colors.blue.withOpacity(0.3),
                        blurRadius: 6,
                      ),
                    ]
                  : null,
            ),
          ),
          const SizedBox(height: 8),
          Text(
            label,
            style: TextStyle(
              fontSize: 11,
              color: active ? Colors.black87 : Colors.grey.shade500,
              fontWeight: active ? FontWeight.w600 : FontWeight.normal,
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildLine() {
    return Expanded(
      flex: 2,
      child: Container(
        height: 2,
        color: Colors.grey.shade300,
        margin: const EdgeInsets.symmetric(horizontal: 4),
      ),
    );
  }
}
