import 'package:flutter/material.dart';
import 'package:speech_to_text/speech_to_text.dart' as stt;
import 'package:speech_to_text/speech_recognition_result.dart';
import 'package:permission_handler/permission_handler.dart';

class VoiceInputField extends StatefulWidget {
  final TextEditingController controller;
  final String hintText;
  final int? maxLines;
  final int? maxLength;
  final String? localeId; // e.g. 'hi_IN' for Hindi

  const VoiceInputField({
    super.key,
    required this.controller,
    required this.hintText,
    this.maxLines = 1,
    this.maxLength,
    this.localeId = 'hi_IN', // Default to Hindi - very useful in Bihar
  });

  @override
  State<VoiceInputField> createState() => _VoiceInputFieldState();
}

class _VoiceInputFieldState extends State<VoiceInputField> {
  final stt.SpeechToText _speech = stt.SpeechToText();
  bool _speechInitialized = false;
  bool _isListening = false;
  String _lastRecognizedWords = '';

  @override
  void initState() {
    super.initState();
    _initializeSpeech();
  }

  Future<void> _initializeSpeech() async {
    var status = await Permission.microphone.status;
    if (!status.isGranted) {
      status = await Permission.microphone.request();
    }

    if (!status.isGranted) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(content: Text('Microphone permission denied')),
        );
      }
      return;
    }

    try {
      _speechInitialized = await _speech.initialize(
        onStatus: (status) {
          if (status == 'done' || status == 'notListening') {
            if (mounted) setState(() => _isListening = false);
          }
        },
        onError: (error) {
          if (mounted) {
            ScaffoldMessenger.of(context).showSnackBar(
              SnackBar(content: Text('Speech error: ${error.errorMsg}')),
            );
            setState(() => _isListening = false);
          }
        },
      );
    } catch (e) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text('Failed to initialize speech: $e')),
        );
      }
    }
  }

  Future<void> _toggleListening() async {
    if (!_speechInitialized) {
      await _initializeSpeech();
      if (!_speechInitialized) return;
    }

    if (_isListening) {
      await _speech.stop();
      setState(() => _isListening = false);
    } else {
      setState(() => _isListening = true);

      await _speech.listen(
        onResult: _onSpeechResult,
        listenFor: const Duration(seconds: 60),
        pauseFor: const Duration(seconds: 6),
        partialResults: true,
        cancelOnError: true,
        listenMode: stt.ListenMode.dictation,
        localeId: widget.localeId,
      );
    }
  }

  void _onSpeechResult(SpeechRecognitionResult result) {
    setState(() {
      _lastRecognizedWords = result.recognizedWords;
      widget.controller.text = _lastRecognizedWords;
      // If you want to **append** instead of replace → use: += ' ' + words
    });
  }

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final isDark = theme.brightness == Brightness.dark;

    return Container(
      decoration: BoxDecoration(
        color: isDark ? const Color(0xFF2C2C2C) : Colors.white,
        borderRadius: BorderRadius.circular(12),
        border: Border.all(
          color: isDark ? Colors.grey.shade800 : Colors.grey.shade300,
        ),
      ),
      child: TextFormField(
        controller: widget.controller,
        maxLines: widget.maxLines,
        maxLength: widget.maxLength,
        style: TextStyle(
          fontSize: widget.maxLines! > 1 ? 14 : 15,
          color: isDark ? const Color(0xFFE0E0E0) : Colors.black87,
        ),
        decoration: InputDecoration(
          hintText: widget.hintText,
          hintStyle: TextStyle(
            color: isDark ? Colors.grey.shade600 : Colors.grey.shade400,
          ),
          border: InputBorder.none,
          contentPadding: const EdgeInsets.all(16),
          suffixIcon: IconButton(
            icon: Icon(
              _isListening ? Icons.mic : Icons.mic_none_rounded,
              color: _isListening ? Colors.red : null,
              size: 28,
            ),
            tooltip: _isListening ? 'Stop speaking' : 'Speak',
            onPressed: _toggleListening,
          ),
          counterStyle: TextStyle(
            color: isDark ? Colors.grey.shade500 : Colors.grey.shade600,
          ),
        ),
        validator: widget.maxLines == 1
            ? (value) {
                if (value == null || value.trim().isEmpty) {
                  return 'Please enter a title';
                }
                if (value.trim().length < 10) {
                  return 'Title must be at least 10 characters';
                }
                return null;
              }
            : (value) {
                if (value == null || value.trim().isEmpty) {
                  return 'Please provide a description';
                }
                if (value.trim().length < 20) {
                  return 'Description must be at least 20 characters';
                }
                return null;
              },
      ),
    );
  }
}
