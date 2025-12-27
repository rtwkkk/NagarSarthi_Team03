import 'package:flutter/material.dart';
import 'dart:io';

import 'package:image_picker/image_picker.dart';

class ReportIncidentScreen extends StatefulWidget {
  const ReportIncidentScreen({super.key});

  @override
  State<ReportIncidentScreen> createState() => _ReportIncidentScreenState();
}

class _ReportIncidentScreenState extends State<ReportIncidentScreen> {
  final _formKey = GlobalKey<FormState>();
  final _titleController = TextEditingController();
  final _descriptionController = TextEditingController();

  String? _selectedCategory;
  String? _selectedSeverity;
  List<String> _selectedImages = [];
  bool _isAnonymous = false;
  bool _isSubmitting = false;

  final List<Map<String, dynamic>> categories = [
    {
      'id': 'traffic',
      'label': 'Traffic',
      'icon': Icons.traffic,
      'color': Colors.red,
      'description': 'Road blockages, accidents, congestion',
    },
    {
      'id': 'utility',
      'label': 'Utility',
      'icon': Icons.power,
      'color': Colors.orange,
      'description': 'Power, water, gas issues',
    },
    {
      'id': 'disaster',
      'label': 'Disaster',
      'icon': Icons.water_damage,
      'color': Colors.blue,
      'description': 'Floods, earthquakes, natural disasters',
    },
    {
      'id': 'protest',
      'label': 'Protest',
      'icon': Icons.group,
      'color': Colors.indigo,
      'description': 'Gatherings, demonstrations',
    },
    {
      'id': 'crime',
      'label': 'Crime',
      'icon': Icons.warning_amber_rounded,
      'color': Colors.deepOrange,
      'description': 'Suspicious activity, safety concerns',
    },
    {
      'id': 'infrastructure',
      'label': 'Infrastructure',
      'icon': Icons.construction,
      'color': Colors.amber,
      'description': 'Damaged roads, bridges, buildings',
    },
    {
      'id': 'health',
      'label': 'Health',
      'icon': Icons.local_hospital,
      'color': Colors.pink,
      'description': 'Medical emergencies, health hazards',
    },
    {
      'id': 'others',
      'label': 'Others',
      'icon': Icons.more_horiz,
      'color': Colors.grey,
      'description': 'Other civic issues',
    },
  ];

  final List<Map<String, dynamic>> severityLevels = [
    {
      'id': 'low',
      'label': 'Low',
      'color': Colors.green,
      'description': 'Minor issue, no immediate action needed',
    },
    {
      'id': 'medium',
      'label': 'Medium',
      'color': Colors.orange,
      'description': 'Requires attention, not urgent',
    },
    {
      'id': 'high',
      'label': 'High',
      'color': Colors.red,
      'description': 'Urgent, immediate attention required',
    },
  ];

  @override
  void dispose() {
    _titleController.dispose();
    _descriptionController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.grey.shade50,
      appBar: AppBar(
        backgroundColor: Colors.white,
        elevation: 0,
        leading: IconButton(
          icon: const Icon(Icons.close_rounded, color: Colors.black87),
          onPressed: () => Navigator.pop(context),
        ),
        title: const Text(
          'Report Incident',
          style: TextStyle(
            fontSize: 20,
            fontWeight: FontWeight.w800,
            color: Colors.black87,
          ),
        ),
        actions: [
          TextButton(
            onPressed: () {
              _formKey.currentState?.reset();
              setState(() {
                _selectedCategory = null;
                _selectedSeverity = null;
                _selectedImages.clear();
                _titleController.clear();
                _descriptionController.clear();
              });
            },
            child: Text(
              'Reset',
              style: TextStyle(
                color: Colors.grey.shade600,
                fontWeight: FontWeight.w600,
              ),
            ),
          ),
        ],
      ),
      body: Form(
        key: _formKey,
        child: SingleChildScrollView(
          padding: const EdgeInsets.all(20),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              // Progress Indicator
              _buildProgressIndicator(),
              const SizedBox(height: 32),

              // Category Selection
              _buildSectionTitle(
                'Select Category',
                'Choose the type of incident',
                true,
              ),
              const SizedBox(height: 16),
              _buildCategoryGrid(),
              const SizedBox(height: 32),

              // Severity Level
              if (_selectedCategory != null) ...[
                _buildSectionTitle(
                  'Severity Level',
                  'How urgent is this?',
                  true,
                ),
                const SizedBox(height: 16),
                _buildSeveritySelector(),
                const SizedBox(height: 32),
              ],

              // Title
              if (_selectedCategory != null) ...[
                _buildSectionTitle(
                  'Incident Title',
                  'Brief summary of the issue',
                  true,
                ),
                const SizedBox(height: 12),
                _buildTitleField(),
                const SizedBox(height: 32),
              ],

              // Description
              if (_selectedCategory != null) ...[
                _buildSectionTitle(
                  'Description',
                  'Provide detailed information',
                  true,
                ),
                const SizedBox(height: 12),
                _buildDescriptionField(),
                const SizedBox(height: 32),
              ],

              // Image Attachments
              if (_selectedCategory != null) ...[
                _buildSectionTitle(
                  'Attach Images',
                  'Add photos for better context (Optional)',
                  false,
                ),
                const SizedBox(height: 12),
                _buildImageAttachments(),
                const SizedBox(height: 32),
              ],

              // Location Info
              if (_selectedCategory != null) ...[
                _buildLocationCard(),
                const SizedBox(height: 32),
              ],

              // Anonymous Reporting
              if (_selectedCategory != null) ...[
                _buildAnonymousToggle(),
                const SizedBox(height: 32),
              ],

              // Submit Button
              if (_selectedCategory != null) ...[
                _buildSubmitButton(),
                const SizedBox(height: 20),
              ],
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildProgressIndicator() {
    int currentStep = 0;
    if (_selectedCategory != null) currentStep = 1;
    if (_titleController.text.isNotEmpty) currentStep = 2;
    if (_descriptionController.text.isNotEmpty) currentStep = 3;

    return Column(
      children: [
        Row(
          children: [
            Expanded(
              child: LinearProgressIndicator(
                value: currentStep / 3,
                backgroundColor: Colors.grey.shade200,
                valueColor: AlwaysStoppedAnimation<Color>(Colors.blue.shade600),
                minHeight: 6,
                borderRadius: BorderRadius.circular(3),
              ),
            ),
            const SizedBox(width: 12),
            Text(
              '${((currentStep / 3) * 100).toInt()}%',
              style: TextStyle(
                fontSize: 14,
                fontWeight: FontWeight.w700,
                color: Colors.blue.shade600,
              ),
            ),
          ],
        ),
        const SizedBox(height: 8),
        Text(
          currentStep == 0
              ? 'Select a category to begin'
              : currentStep == 1
              ? 'Add incident title'
              : currentStep == 2
              ? 'Provide description'
              : 'Ready to submit',
          style: TextStyle(
            fontSize: 12,
            color: Colors.grey.shade600,
            fontWeight: FontWeight.w500,
          ),
        ),
      ],
    );
  }

  Widget _buildSectionTitle(String title, String subtitle, bool required) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Row(
          children: [
            Text(
              title,
              style: const TextStyle(
                fontSize: 18,
                fontWeight: FontWeight.w800,
                color: Colors.black87,
              ),
            ),
            if (required) ...[
              const SizedBox(width: 4),
              const Text(
                '*',
                style: TextStyle(
                  fontSize: 18,
                  fontWeight: FontWeight.w800,
                  color: Colors.red,
                ),
              ),
            ],
          ],
        ),
        const SizedBox(height: 4),
        Text(
          subtitle,
          style: TextStyle(
            fontSize: 13,
            color: Colors.grey.shade600,
            fontWeight: FontWeight.w500,
          ),
        ),
      ],
    );
  }

  Widget _buildCategoryGrid() {
    return GridView.builder(
      shrinkWrap: true,
      physics: const NeverScrollableScrollPhysics(),
      gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
        crossAxisCount: 2,
        crossAxisSpacing: 12,
        mainAxisSpacing: 12,
        childAspectRatio: 1.1,
      ),
      itemCount: categories.length,
      itemBuilder: (context, index) {
        final category = categories[index];
        final isSelected = _selectedCategory == category['id'];

        return GestureDetector(
          onTap: () {
            setState(() {
              _selectedCategory = category['id'];
            });
          },
          child: Container(
            decoration: BoxDecoration(
              color: isSelected
                  ? (category['color'] as Color).withOpacity(0.1)
                  : Colors.white,
              borderRadius: BorderRadius.circular(16),
              border: Border.all(
                color: isSelected
                    ? (category['color'] as Color)
                    : Colors.grey.shade300,
                width: isSelected ? 2.5 : 1.5,
              ),
              boxShadow: isSelected
                  ? [
                      BoxShadow(
                        color: (category['color'] as Color).withOpacity(0.3),
                        blurRadius: 12,
                        offset: const Offset(0, 6),
                      ),
                    ]
                  : [],
            ),
            child: Padding(
              padding: const EdgeInsets.all(16),
              child: Column(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  Container(
                    padding: const EdgeInsets.all(12),
                    decoration: BoxDecoration(
                      color: (category['color'] as Color).withOpacity(0.15),
                      borderRadius: BorderRadius.circular(12),
                    ),
                    child: Icon(
                      category['icon'],
                      color: category['color'],
                      size: 32,
                    ),
                  ),
                  const SizedBox(height: 12),
                  Text(
                    category['label'],
                    style: TextStyle(
                      fontSize: 15,
                      fontWeight: FontWeight.w700,
                      color: isSelected ? category['color'] : Colors.black87,
                    ),
                  ),
                  const SizedBox(height: 4),
                  Text(
                    category['description'],
                    style: TextStyle(fontSize: 10, color: Colors.grey.shade600),
                    textAlign: TextAlign.center,
                    maxLines: 2,
                    overflow: TextOverflow.ellipsis,
                  ),
                ],
              ),
            ),
          ),
        );
      },
    );
  }

  Widget _buildSeveritySelector() {
    return Row(
      children: severityLevels.map((severity) {
        final isSelected = _selectedSeverity == severity['id'];
        return Expanded(
          child: GestureDetector(
            onTap: () {
              setState(() {
                _selectedSeverity = severity['id'];
              });
            },
            child: Container(
              margin: const EdgeInsets.symmetric(horizontal: 4),
              padding: const EdgeInsets.symmetric(vertical: 16, horizontal: 12),
              decoration: BoxDecoration(
                color: isSelected
                    ? (severity['color'] as Color).withOpacity(0.1)
                    : Colors.white,
                borderRadius: BorderRadius.circular(12),
                border: Border.all(
                  color: isSelected
                      ? (severity['color'] as Color)
                      : Colors.grey.shade300,
                  width: isSelected ? 2 : 1.5,
                ),
              ),
              child: Column(
                children: [
                  Container(
                    width: 12,
                    height: 12,
                    decoration: BoxDecoration(
                      color: severity['color'],
                      shape: BoxShape.circle,
                    ),
                  ),
                  const SizedBox(height: 8),
                  Text(
                    severity['label'],
                    style: TextStyle(
                      fontSize: 14,
                      fontWeight: FontWeight.w700,
                      color: isSelected ? severity['color'] : Colors.black87,
                    ),
                  ),
                  const SizedBox(height: 4),
                  Text(
                    severity['description'],
                    style: TextStyle(fontSize: 9, color: Colors.grey.shade600),
                    textAlign: TextAlign.center,
                    maxLines: 2,
                  ),
                ],
              ),
            ),
          ),
        );
      }).toList(),
    );
  }

  Widget _buildTitleField() {
    return Container(
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(12),
        border: Border.all(color: Colors.grey.shade300),
      ),
      child: TextFormField(
        controller: _titleController,
        style: const TextStyle(fontSize: 15, fontWeight: FontWeight.w600),
        decoration: InputDecoration(
          hintText: 'e.g., Heavy traffic on MG Road',
          hintStyle: TextStyle(
            color: Colors.grey.shade400,
            fontWeight: FontWeight.normal,
          ),
          border: InputBorder.none,
          contentPadding: const EdgeInsets.all(16),
          counterText: '',
        ),
        maxLength: 100,
        validator: (value) {
          if (value == null || value.isEmpty) {
            return 'Please enter a title';
          }
          if (value.length < 10) {
            return 'Title must be at least 10 characters';
          }
          return null;
        },
        onChanged: (value) {
          setState(() {}); // Update progress
        },
      ),
    );
  }

  Widget _buildDescriptionField() {
    return Container(
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(12),
        border: Border.all(color: Colors.grey.shade300),
      ),
      child: TextFormField(
        controller: _descriptionController,
        style: const TextStyle(fontSize: 14),
        decoration: InputDecoration(
          hintText:
              'Describe the incident in detail. Include what happened, when, and any other relevant information...',
          hintStyle: TextStyle(color: Colors.grey.shade400, fontSize: 14),
          border: InputBorder.none,
          contentPadding: const EdgeInsets.all(16),
          counterText: '',
        ),
        maxLines: 6,
        maxLength: 500,
        validator: (value) {
          if (value == null || value.isEmpty) {
            return 'Please provide a description';
          }
          if (value.length < 20) {
            return 'Description must be at least 20 characters';
          }
          return null;
        },
        onChanged: (value) {
          setState(() {}); // Update progress
        },
      ),
    );
  }

  Widget _buildImageAttachments() {
    return Column(
      children: [
        if (_selectedImages.isNotEmpty) ...[
          SizedBox(
            height: 120,
            child: ListView.builder(
              scrollDirection: Axis.horizontal,
              itemCount: _selectedImages.length,
              itemBuilder: (context, index) {
                return Container(
                  width: 120,
                  margin: const EdgeInsets.only(right: 12),
                  decoration: BoxDecoration(
                    color: Colors.grey.shade200,
                    borderRadius: BorderRadius.circular(12),
                    border: Border.all(color: Colors.grey.shade300),
                  ),
                  child: Stack(
                    children: [
                      Center(
                        child: Icon(
                          Icons.image,
                          size: 48,
                          color: Colors.grey.shade400,
                        ),
                      ),
                      // Simulated image placeholder
                      Center(
                        child: Text(
                          'Image ${index + 1}',
                          style: TextStyle(
                            fontSize: 12,
                            fontWeight: FontWeight.w600,
                            color: Colors.grey.shade600,
                          ),
                        ),
                      ),
                      Positioned(
                        top: 8,
                        right: 8,
                        child: GestureDetector(
                          onTap: () {
                            setState(() {
                              _selectedImages.removeAt(index);
                            });
                          },
                          child: Container(
                            padding: const EdgeInsets.all(4),
                            decoration: const BoxDecoration(
                              color: Colors.red,
                              shape: BoxShape.circle,
                            ),
                            child: const Icon(
                              Icons.close,
                              color: Colors.white,
                              size: 16,
                            ),
                          ),
                        ),
                      ),
                    ],
                  ),
                );
              },
            ),
          ),
          const SizedBox(height: 12),
        ],
        Row(
          children: [
            Expanded(
              child: OutlinedButton.icon(
                onPressed: _selectedImages.length < 5 ? _pickImage : null,
                icon: const Icon(Icons.camera_alt_rounded),
                label: const Text('Take Photo'),
                style: OutlinedButton.styleFrom(
                  padding: const EdgeInsets.symmetric(vertical: 14),
                  side: BorderSide(color: Colors.blue.shade600, width: 1.5),
                  shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(12),
                  ),
                  foregroundColor: Colors.blue.shade600,
                ),
              ),
            ),
            const SizedBox(width: 12),
            Expanded(
              child: OutlinedButton.icon(
                onPressed: _selectedImages.length < 5
                    ? _pickImageFromGallery
                    : null,
                icon: const Icon(Icons.photo_library_rounded),
                label: const Text('From Gallery'),
                style: OutlinedButton.styleFrom(
                  padding: const EdgeInsets.symmetric(vertical: 14),
                  side: BorderSide(color: Colors.blue.shade600, width: 1.5),
                  shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(12),
                  ),
                  foregroundColor: Colors.blue.shade600,
                ),
              ),
            ),
          ],
        ),
        if (_selectedImages.length >= 5) ...[
          const SizedBox(height: 8),
          Text(
            'Maximum 5 images allowed',
            style: TextStyle(
              fontSize: 12,
              color: Colors.orange.shade700,
              fontWeight: FontWeight.w500,
            ),
          ),
        ],
      ],
    );
  }

  Widget _buildLocationCard() {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        gradient: LinearGradient(
          begin: Alignment.topLeft,
          end: Alignment.bottomRight,
          colors: [Colors.blue.shade50, Colors.indigo.shade50],
        ),
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: Colors.blue.shade200),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              Container(
                padding: const EdgeInsets.all(10),
                decoration: BoxDecoration(
                  color: Colors.blue.shade600,
                  borderRadius: BorderRadius.circular(10),
                ),
                child: const Icon(
                  Icons.location_on,
                  color: Colors.white,
                  size: 20,
                ),
              ),
              const SizedBox(width: 12),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    const Text(
                      'Current Location',
                      style: TextStyle(
                        fontSize: 14,
                        fontWeight: FontWeight.w700,
                        color: Colors.black87,
                      ),
                    ),
                    const SizedBox(height: 2),
                    Text(
                      'MG Road, Sector 14, Narnaund',
                      style: TextStyle(
                        fontSize: 13,
                        color: Colors.grey.shade700,
                      ),
                    ),
                  ],
                ),
              ),
            ],
          ),
          const SizedBox(height: 12),
          TextButton.icon(
            onPressed: () {
              // Open location picker
            },
            icon: const Icon(Icons.edit_location_alt_rounded, size: 18),
            label: const Text('Change Location'),
            style: TextButton.styleFrom(
              foregroundColor: Colors.blue.shade700,
              padding: EdgeInsets.zero,
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildAnonymousToggle() {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: Colors.grey.shade300),
      ),
      child: Row(
        children: [
          Container(
            padding: const EdgeInsets.all(10),
            decoration: BoxDecoration(
              color: Colors.purple.shade50,
              borderRadius: BorderRadius.circular(10),
            ),
            child: Icon(
              Icons.privacy_tip_rounded,
              color: Colors.purple.shade600,
              size: 24,
            ),
          ),
          const SizedBox(width: 12),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                const Text(
                  'Report Anonymously',
                  style: TextStyle(
                    fontSize: 15,
                    fontWeight: FontWeight.w700,
                    color: Colors.black87,
                  ),
                ),
                const SizedBox(height: 2),
                Text(
                  'Your identity will be hidden from others',
                  style: TextStyle(fontSize: 12, color: Colors.grey.shade600),
                ),
              ],
            ),
          ),
          Switch(
            value: _isAnonymous,
            onChanged: (value) {
              setState(() {
                _isAnonymous = value;
              });
            },
            activeColor: Colors.purple.shade600,
          ),
        ],
      ),
    );
  }

  Widget _buildSubmitButton() {
    final canSubmit =
        _selectedCategory != null &&
        _selectedSeverity != null &&
        _titleController.text.isNotEmpty &&
        _descriptionController.text.isNotEmpty;

    return Container(
      width: double.infinity,
      height: 54,
      decoration: BoxDecoration(
        gradient: canSubmit
            ? LinearGradient(
                begin: Alignment.topLeft,
                end: Alignment.bottomRight,
                colors: [
                  Colors.blue.shade500,
                  Colors.blue.shade600,
                  Colors.indigo.shade700,
                ],
              )
            : null,
        color: canSubmit ? null : Colors.grey.shade300,
        borderRadius: BorderRadius.circular(12),
        boxShadow: canSubmit
            ? [
                BoxShadow(
                  color: Colors.blue.shade400.withOpacity(0.4),
                  blurRadius: 12,
                  offset: const Offset(0, 6),
                ),
              ]
            : [],
      ),
      child: ElevatedButton(
        onPressed: canSubmit && !_isSubmitting ? _handleSubmit : null,
        style: ElevatedButton.styleFrom(
          backgroundColor: Colors.transparent,
          shadowColor: Colors.transparent,
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(12),
          ),
          disabledBackgroundColor: Colors.transparent,
        ),
        child: _isSubmitting
            ? const SizedBox(
                height: 24,
                width: 24,
                child: CircularProgressIndicator(
                  color: Colors.white,
                  strokeWidth: 3,
                ),
              )
            : Row(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  Icon(
                    Icons.send_rounded,
                    color: canSubmit ? Colors.white : Colors.grey.shade500,
                  ),
                  const SizedBox(width: 8),
                  Text(
                    'Submit Report',
                    style: TextStyle(
                      fontSize: 16,
                      fontWeight: FontWeight.w700,
                      color: canSubmit ? Colors.white : Colors.grey.shade500,
                      letterSpacing: 0.5,
                    ),
                  ),
                ],
              ),
      ),
    );
  }

  void _pickImage() async {
    // Simulate image picker
    final ImagePicker picker = ImagePicker();
    final XFile? image = await picker.pickImage(source: ImageSource.camera);

    setState(() {
      _selectedImages.add('image_${_selectedImages.length + 1}.jpg');
    });

    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: const Text('Image captured successfully'),
        backgroundColor: Colors.green,
        behavior: SnackBarBehavior.floating,
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
      ),
    );
  }

  void _pickImageFromGallery() async {
    // Simulate image picker
    final ImagePicker picker = ImagePicker();
    final XFile? image = await picker.pickImage(source: ImageSource.gallery);

    setState(() {
      _selectedImages.add('image_${_selectedImages.length + 1}.jpg');
    });

    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: const Text('Image selected from gallery'),
        backgroundColor: Colors.green,
        behavior: SnackBarBehavior.floating,
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
      ),
    );
  }

  void _handleSubmit() async {
    if (_formKey.currentState?.validate() ?? false) {
      setState(() {
        _isSubmitting = true;
      });

      // Simulate API call
      await Future.delayed(const Duration(seconds: 2));

      if (mounted) {
        setState(() {
          _isSubmitting = false;
        });

        // Show success dialog
        showDialog(
          context: context,
          barrierDismissible: false,
          builder: (context) => AlertDialog(
            shape: RoundedRectangleBorder(
              borderRadius: BorderRadius.circular(20),
            ),
            content: Column(
              mainAxisSize: MainAxisSize.min,
              children: [
                Container(
                  padding: const EdgeInsets.all(16),
                  decoration: BoxDecoration(
                    color: Colors.green.shade50,
                    shape: BoxShape.circle,
                  ),
                  child: Icon(
                    Icons.check_circle_rounded,
                    color: Colors.green.shade600,
                    size: 64,
                  ),
                ),
                const SizedBox(height: 24),
                const Text(
                  'Report Submitted!',
                  style: TextStyle(
                    fontSize: 22,
                    fontWeight: FontWeight.w800,
                    color: Colors.black87,
                  ),
                ),
                const SizedBox(height: 12),
                Text(
                  'Your incident report has been submitted successfully. Authorities will be notified.',
                  style: TextStyle(fontSize: 14, color: Colors.grey.shade600),
                  textAlign: TextAlign.center,
                ),
                const SizedBox(height: 24),
                Container(
                  padding: const EdgeInsets.all(12),
                  decoration: BoxDecoration(
                    color: Colors.blue.shade50,
                    borderRadius: BorderRadius.circular(12),
                  ),
                  child: Row(
                    mainAxisSize: MainAxisSize.min,
                    children: [
                      Icon(
                        Icons.confirmation_number_rounded,
                        color: Colors.blue.shade700,
                        size: 20,
                      ),
                      const SizedBox(width: 8),
                      Text(
                        'Report ID: RPT-${DateTime.now().millisecondsSinceEpoch.toString().substring(7)}',
                        style: TextStyle(
                          fontSize: 12,
                          fontWeight: FontWeight.w700,
                          color: Colors.blue.shade700,
                        ),
                      ),
                    ],
                  ),
                ),
                const SizedBox(height: 24),
                SizedBox(
                  width: double.infinity,
                  child: ElevatedButton(
                    onPressed: () {
                      Navigator.pop(context); // Close dialog
                      Navigator.pop(context); // Close report screen
                    },
                    style: ElevatedButton.styleFrom(
                      backgroundColor: Colors.blue.shade600,
                      padding: const EdgeInsets.symmetric(vertical: 14),
                      shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(12),
                      ),
                    ),
                    child: const Text(
                      'Done',
                      style: TextStyle(
                        fontSize: 16,
                        fontWeight: FontWeight.w700,
                        color: Colors.white,
                      ),
                    ),
                  ),
                ),
              ],
            ),
          ),
        );
      }
    } else {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: const Text('Please fill all required fields'),
          backgroundColor: Colors.red,
          behavior: SnackBarBehavior.floating,
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(10),
          ),
        ),
      );
    }
  }
}
