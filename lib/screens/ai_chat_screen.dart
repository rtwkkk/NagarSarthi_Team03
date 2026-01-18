import 'package:flutter/material.dart';
import 'package:flutter_chat_ui/flutter_chat_ui.dart';
import 'package:flutter_chat_types/flutter_chat_types.dart' as types;
import 'package:google_generative_ai/google_generative_ai.dart';
import 'package:flutter_spinkit/flutter_spinkit.dart';
import 'package:uuid/uuid.dart';

class AiChatScreen extends StatefulWidget {
  const AiChatScreen({super.key});

  @override
  State<AiChatScreen> createState() => _AiChatScreenState();
}

class _AiChatScreenState extends State<AiChatScreen> {
  final _messages = <types.Message>[];
  final _uuid = const Uuid();

  final _user = const types.User(id: 'user', firstName: 'You');

  final _assistant = const types.User(
    id: 'nagar_helper',
    firstName: 'Nagar Helper',
    imageUrl:
        'https://api.dicebear.com/9.x/bottts/svg?seed=nagarhelper&colors=indigo,blue,purple',
  );

  bool _isThinking = false;
  late final GenerativeModel _gemini;

  final _quickSuggestions = [
    "How to write a good incident report?",
    "I'm feeling very stressed right now...",
    "What should I do in case of road accident?",
    "How can I report something anonymously?",
    "Quick breathing exercise for panic",
  ];

  @override
  void initState() {
    super.initState();

    _gemini = GenerativeModel(model: 'gemini-2.5-flash', apiKey: 'API_KEY');

    _addWelcomeMessage();
  }

  void _addWelcomeMessage() {
    final welcome = types.TextMessage(
      author: _assistant,
      id: _uuid.v4(),
      createdAt: DateTime.now().millisecondsSinceEpoch,
      text:
          "नमस्ते! 🙏\nI'm your Nagar Helper\n\n"
          "Need help with reporting an incident?\n"
          "Feeling overwhelmed or anxious?\n"
          "I'm here for you... always ❤️",
    );

    setState(() {
      _messages.insert(0, welcome);
    });
  }

  Future<void> _handleSendPressed(types.PartialText partialText) async {
    final text = partialText.text.trim();
    if (text.isEmpty) return;

    // Add user message
    final userMessage = types.TextMessage(
      author: _user,
      id: _uuid.v4(),
      createdAt: DateTime.now().millisecondsSinceEpoch,
      text: text,
    );

    setState(() {
      _messages.insert(0, userMessage);
      _isThinking = true;
    });

    try {
      final prompt =
          '''
You are Nagar Helper - a very kind, calm, supportive and professional assistant.
Use warm, natural English + simple Hindi when it feels natural.
Main goals:
• Help write clear, structured incident reports
• Provide emotional support & stress relief techniques
• Give practical safety & first-response guidance
Always:
1. Start with empathy
2. Give clear, numbered or bulleted steps when appropriate
3. End with encouragement

User: $text
''';

      String buffer = '';
      types.TextMessage? aiResponse;

      final stream = _gemini.generateContentStream([Content.text(prompt)]);

      await for (final chunk in stream) {
        final chunkText = chunk.text ?? '';
        if (chunkText.isEmpty) continue;

        buffer += chunkText;

        setState(() {
          if (aiResponse == null) {
            aiResponse = types.TextMessage(
              author: _assistant,
              id: _uuid.v4(),
              createdAt: DateTime.now().millisecondsSinceEpoch,
              text: buffer,
            );
            _messages.insert(0, aiResponse!);
          } else {
            final index = _messages.indexOf(aiResponse!);
            if (index != -1) {
              final updated = aiResponse!.copyWith(text: buffer);
              _messages[index] = updated;
              aiResponse = updated as types.TextMessage;
            }
          }
        });
      }
    } catch (e) {
      final errorMsg = types.TextMessage(
        author: _assistant,
        id: _uuid.v4(),
        createdAt: DateTime.now().millisecondsSinceEpoch,
        text:
            "क्षमा करें... कुछ समस्या हो गई है।\nकृपया थोड़ी देर बाद कोशिश करें 🙏",
      );
      setState(() {
        _messages.insert(0, errorMsg);
      });
    }

    setState(() => _isThinking = false);
  }

  void _sendSuggestion(String suggestion) {
    _handleSendPressed(types.PartialText(text: suggestion));
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      extendBodyBehindAppBar: true,
      appBar: AppBar(
        backgroundColor: Colors.transparent,
        elevation: 0,
        title: const Text(
          "Nagar Helper",
          style: TextStyle(
            fontWeight: FontWeight.w700,
            color: Colors.white,
            letterSpacing: 0.4,
          ),
        ),
        flexibleSpace: Container(
          decoration: BoxDecoration(
            gradient: LinearGradient(
              begin: Alignment.topCenter,
              end: Alignment.bottomCenter,
              colors: [
                Colors.indigo.shade900.withOpacity(0.92),
                Colors.indigo.shade800.withOpacity(0.70),
              ],
            ),
          ),
        ),
        iconTheme: const IconThemeData(color: Colors.white),
      ),

      body: Container(
        decoration: const BoxDecoration(
          gradient: LinearGradient(
            begin: Alignment.topCenter,
            end: Alignment.bottomCenter,
            colors: [Color(0xFF0F172A), Color(0xFF1E293B)],
          ),
        ),
        child: SafeArea(
          child: Stack(
            children: [
              // Main chat
              Chat(
                messages: _messages,
                onSendPressed: _handleSendPressed,
                user: _user,
                theme: DefaultChatTheme(
                  backgroundColor: Colors.transparent,
                  inputBackgroundColor: Colors.white.withOpacity(0.07),
                  inputSurfaceTintColor: Colors.transparent,
                  primaryColor: const Color(0xFF6366F1), // indigo-500
                  secondaryColor: const Color(0xFF7C3AED), // violet-600
                  inputBorderRadius: BorderRadius.circular(32),
                  messageBorderRadius: 24,
                  inputTextColor: Colors.white,
                  inputTextStyle: const TextStyle(fontSize: 16),
                  receivedMessageBodyTextStyle: const TextStyle(
                    color: Colors.white,
                    fontSize: 15.6,
                    height: 1.38,
                  ),
                  sentMessageBodyTextStyle: const TextStyle(
                    color: Colors.white,
                    fontSize: 15.6,
                    height: 1.38,
                  ),
                  dateDividerTextStyle: TextStyle(
                    color: Colors.white.withOpacity(0.45),
                    fontSize: 12,
                  ),
                ),
                customBottomWidget: _buildCustomBottom(),
                emptyState: _buildWelcomeEmptyState(),
              ),

              // Thinking indicator
              if (_isThinking)
                Positioned(
                  bottom: 100,
                  left: 0,
                  right: 0,
                  child: Center(
                    child: Container(
                      padding: const EdgeInsets.symmetric(
                        horizontal: 20,
                        vertical: 12,
                      ),
                      decoration: BoxDecoration(
                        color: Colors.black.withOpacity(0.38),
                        borderRadius: BorderRadius.circular(30),
                        border: Border.all(
                          color: Colors.indigo.withOpacity(0.3),
                          width: 1,
                        ),
                      ),
                      child: Row(
                        mainAxisSize: MainAxisSize.min,
                        children: const [
                          SpinKitPulse(color: Color(0xFF818CF8), size: 22),
                          SizedBox(width: 12),
                          Text(
                            "Thinking...",
                            style: TextStyle(
                              color: Colors.white70,
                              fontSize: 15,
                              fontWeight: FontWeight.w500,
                            ),
                          ),
                        ],
                      ),
                    ),
                  ),
                ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildCustomBottom() {
    if (_messages.length > 6) return const SizedBox.shrink();

    return SizedBox(
      height: 64,
      child: ListView.builder(
        padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
        scrollDirection: Axis.horizontal,
        itemCount: _quickSuggestions.length,
        itemBuilder: (context, index) {
          final text = _quickSuggestions[index];
          return Padding(
            padding: const EdgeInsets.only(right: 10),
            child: FilterChip(
              label: Text(
                text,
                style: const TextStyle(color: Colors.white, fontSize: 13.5),
              ),
              backgroundColor: Colors.white.withOpacity(0.09),
              selectedColor: const Color(0xFF6366F1).withOpacity(0.35),
              shape: RoundedRectangleBorder(
                borderRadius: BorderRadius.circular(24),
                side: BorderSide(color: Colors.white.withOpacity(0.15)),
              ),
              onSelected: (_) => _sendSuggestion(text),
            ),
          );
        },
      ),
    );
  }

  Widget _buildWelcomeEmptyState() {
    return Center(
      child: Column(
        mainAxisSize: MainAxisSize.min,
        children: [
          Container(
            padding: const EdgeInsets.all(28),
            decoration: BoxDecoration(
              shape: BoxShape.circle,
              gradient: const LinearGradient(
                begin: Alignment.topLeft,
                end: Alignment.bottomRight,
                colors: [Color(0xFF6366F1), Color(0xFF4338CA)],
              ),
              boxShadow: [
                BoxShadow(
                  color: const Color(0xFF6366F1).withOpacity(0.38),
                  blurRadius: 32,
                  spreadRadius: 4,
                ),
              ],
            ),
            child: const Icon(
              Icons.support_agent_rounded,
              size: 68,
              color: Colors.white,
            ),
          ),
          const SizedBox(height: 32),
          const Text(
            "How can I help you today?",
            style: TextStyle(
              fontSize: 26,
              fontWeight: FontWeight.w700,
              color: Colors.white,
              letterSpacing: -0.2,
            ),
          ),
          const SizedBox(height: 16),
          Text(
            "Incident reporting • Emotional support\nSafety guidance • Anything really...\nI'm listening ❤️",
            textAlign: TextAlign.center,
            style: TextStyle(
              fontSize: 16,
              color: Colors.white.withOpacity(0.78),
              height: 1.45,
            ),
          ),
        ],
      ),
    );
  }
}
