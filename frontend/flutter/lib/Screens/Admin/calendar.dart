import 'package:flutter/material.dart';
import 'package:vaanivikas/constants.dart';

class MeetingCardWidget extends StatefulWidget {
  final String? title;
  final String? supervisor;
  final String? patient;
  final String? roomNo;
  final DateTime? date;
  final String? startTime;
  final String? endTime;
  final String? description;

  const MeetingCardWidget({
    super.key,
    this.title,
    this.supervisor,
    this.patient,
    this.roomNo,
    this.date,
    this.startTime,
    this.endTime,
    this.description,
  });

  @override
  State<MeetingCardWidget> createState() => _MeetingCardWidgetState();
}

class _MeetingCardWidgetState extends State<MeetingCardWidget> {
  @override
  Widget build(BuildContext context) {
    String formatTimeOfDay(TimeOfDay time) {
      final hour = time.hour.toString().padLeft(2, '0');
      final minute = time.minute.toString().padLeft(2, '0');
      return '$hour:$minute';
    }

    return GestureDetector(
      // onTap: () => Get.to(() => const MeetingDetailScreen()),
      child: Card(
        elevation: 5,
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(12.0),
        ),
        shadowColor: kPrimaryDarkColor.withOpacity(0.5),
        child: Container(
          decoration: BoxDecoration(
            gradient: const LinearGradient(
              colors: [kPrimaryColor, kPrimaryLightColor],
              begin: Alignment.topLeft,
              end: Alignment.bottomRight,
            ),
            borderRadius: BorderRadius.circular(12.0),
            boxShadow: [
              BoxShadow(
                color: kPrimaryDarkColor.withOpacity(0.3),
                blurRadius: 8,
                offset: const Offset(4, 4),
              ),
            ],
          ),
          padding: const EdgeInsets.symmetric(horizontal: 16.0, vertical: 12.0),
          child: Row(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              const Icon(Icons.calendar_month_outlined, color: Colors.white),
              const SizedBox(width: 8.0),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    // Supervisor
                    Text(
                      widget.supervisor ?? 'Supervisor not assigned',
                      style: const TextStyle(
                        fontSize: 15.0,
                        fontWeight: FontWeight.normal,
                        color: Colors.white70,
                      ),
                    ),

                    // Meeting Title
                    Text(
                      widget.title ?? 'No Title Provided',
                      style: const TextStyle(
                        fontSize: 20.0,
                        fontWeight: FontWeight.bold,
                        color: kButtonColor,
                      ),
                    ),
                    const SizedBox(height: 3.0),

                    // Room Number
                    Text(
                      'Room: ${widget.roomNo ?? 'N/A'}',
                      style: const TextStyle(
                        fontSize: 15.0,
                        fontWeight: FontWeight.normal,
                        color: Colors.white70,
                      ),
                    ),

                    // Meeting Time
                    Text(
                      "${widget.startTime ?? 'N/A'} to ${widget.endTime ?? 'N/A'}",
                      style: const TextStyle(
                        fontSize: 15.5,
                        fontWeight: FontWeight.w600,
                        color: Colors.white,
                      ),
                    ),

                    // Description
                    const SizedBox(height: 2.0),
                    Text(
                      widget.description ?? 'No Description Provided',
                      textAlign: TextAlign.left,
                      overflow: TextOverflow.ellipsis,
                      maxLines: 1,
                      style: const TextStyle(
                        fontSize: 14.0,
                        fontWeight: FontWeight.w400,
                        color: Colors.white70,
                      ),
                    ),
                  ],
                ),
              ),
              const SizedBox(width: 20.0),
              Column(
                mainAxisAlignment: MainAxisAlignment.center,
                crossAxisAlignment: CrossAxisAlignment.end,
                children: [
                  // Profile Icon Container
                  Container(
                    width: 40.0,
                    height: 40.0,
                    decoration: BoxDecoration(
                      shape: BoxShape.circle,
                      color: kButtonColor,
                      boxShadow: [
                        BoxShadow(
                          color: kPrimaryDarkColor.withOpacity(0.3),
                          blurRadius: 6,
                          offset: const Offset(0, 4),
                        ),
                      ],
                    ),
                  ),
                ],
              ),
            ],
          ),
        ),
      ),
    );
  }
}