// import 'package:flutter/material.dart';
// import 'package:table_calendar/table_calendar.dart';
// import '../../../constants.dart';
// import '../widgets/calendar_widget.dart';
// import '../widgets/on_press_actions.dart';

// class MeetingPage extends StatefulWidget {
//   const MeetingPage({super.key});

//   @override
//   State<MeetingPage> createState() => _MeetingPageState();
// }

// class _MeetingPageState extends State<MeetingPage> {
//   CalendarFormat calendarFormat = CalendarFormat.month;
//   DateTime selectedDay = DateTime.now();
//   DateTime focusedDay = DateTime.now();

//   @override
//   Widget build(BuildContext context) {
//     return Scaffold(
//       appBar: AppBar(
//         title: const Text("Appointments"),
//         backgroundColor: kPrimaryLightColor,
//         elevation: 0,
//       ),
//       body: Stack(
//         children: [
//           Column(
//             children: [

//               // meeting calendar
//               TableCalendar(
//                 focusedDay: selectedDay,
//                 firstDay: DateTime(2010),
//                 lastDay: DateTime(2050),
//                 calendarFormat: calendarFormat,
//                 startingDayOfWeek: StartingDayOfWeek.monday,
//                 headerStyle: HeaderStyle(
//                     formatButtonVisible: true,
//                     formatButtonShowsNext: false,
//                     formatButtonDecoration: BoxDecoration(
//                       color: const Color(0xFFB3E5FC),
//                       borderRadius: BorderRadius.circular(8.0),
//                     )
//                 ),

//                 // to style the calendar
//                 calendarStyle: const CalendarStyle(

//                   isTodayHighlighted: true,
//                   // decoration for the current date
//                   todayDecoration: BoxDecoration(
//                     color: Color(0xFFFFB466),
//                     shape: BoxShape.circle,
//                   ),
//                   todayTextStyle: TextStyle(
//                     fontWeight: FontWeight.bold,
//                     color: Colors.white,
//                   ),

//                   // decoration for the selected date
//                   selectedDecoration: BoxDecoration(
//                     color: Color(0xFFE4EFFA),
//                     shape: BoxShape.circle,
//                   ),
//                   selectedTextStyle: TextStyle(
//                     color: Colors.black,
//                   ),
//                 ),

//                 selectedDayPredicate: (DateTime inputDate) {
//                   return isSameDay(selectedDay, inputDate);
//                 },
//                 onFormatChanged: (CalendarFormat inputFormat) {
//                   setState(() {
//                     calendarFormat = inputFormat;
//                   });
//                 },
//                 onDaySelected: (DateTime inputSelectedDay, DateTime inputFocusedDay) {
//                   setState(() {
//                     selectedDay = inputSelectedDay;
//                     focusedDay = inputFocusedDay;
//                   });
//                 },
//               ),
//               const Divider(thickness: 3.0),

//               // meeting cards
//               Expanded(
//                 child: SingleChildScrollView(
//                   child: Container(
//                     margin: const EdgeInsets.only(left: 8.0,right: 8.0,top: 0.0,bottom: 20.0),
//                     child: const Column(
//                       children: [
//                         MeetingCardWidget(),
//                         MeetingCardWidget(),
//                         MeetingCardWidget(),
//                         MeetingCardWidget(),
//                         MeetingCardWidget(),
//                         MeetingCardWidget(),
//                         MeetingCardWidget(),
//                         MeetingCardWidget(),
//                         MeetingCardWidget(),
//                       ],
//                     ),
//                   )
//                 ),
//               ),
//             ],
//           ),
//         ],
//       ),
//       floatingActionButton: FloatingActionButton(
//         shape: RoundedRectangleBorder(
//           borderRadius: BorderRadius.circular(12.0),
//         ),
//         child: const Icon(Icons.add),
//         onPressed: () => OnPressAction.goToMeetingFrom(),
//       ),
//     );
//   }
// }
import 'package:flutter/material.dart';
import 'package:table_calendar/table_calendar.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'dart:convert'; // For JSON encoding/decoding
import '../../../constants.dart';
import '../widgets/appointment_form.dart';
import '../widgets/calendar_widget.dart';
import 'meeting_detail_scree.dart';

class MeetingPage extends StatefulWidget {
  const MeetingPage({super.key});

  @override
  State<MeetingPage> createState() => _MeetingPageState();
}

class _MeetingPageState extends State<MeetingPage> {
  String formatDate(DateTime date) {
    return "${date.day.toString().padLeft(2, '0')}/${date.month.toString().padLeft(2, '0')}/${date.year}";
  }

  String formatTimeOfDay(TimeOfDay time) {
    final hour = time.hour.toString().padLeft(2, '0');
    final minute = time.minute.toString().padLeft(2, '0');
    return '$hour:$minute';
  }

  String getInitials(String name) {
      List<String> names = name.split(" ");
      return names.map((word) => word.isNotEmpty ? word[0].toUpperCase() : "").join();
    }

  CalendarFormat calendarFormat = CalendarFormat.month;
  DateTime selectedDay = DateTime.now();
  DateTime focusedDay = DateTime.now();
  Map<DateTime, List<Map<String, dynamic>>> events = {};

  @override
  void initState() {
    super.initState();
    _loadEvents();
  }

  Future<void> _saveEvents() async {
    final prefs = await SharedPreferences.getInstance();
    final encodedEvents = events.map((key, value) => MapEntry(
          key.toIso8601String(),
          value,
        ));
    prefs.setString('events', json.encode(encodedEvents));
  }

  Future<void> _loadEvents() async {
    final prefs = await SharedPreferences.getInstance();
    final savedEvents = prefs.getString('events');
    if (savedEvents != null) {
      final decodedEvents = Map<String, dynamic>.from(json.decode(savedEvents));
      setState(() {
        events = decodedEvents.map((key, value) => MapEntry(
              DateTime.parse(key),
              List<Map<String, dynamic>>.from(value),
            ));
      });
    }
  }

  void _addEvent(DateTime date, Map<String, dynamic> event) {
    setState(() {
      if (events[date] == null) {
        events[date] = [event];
      } else {
        events[date]!.add(event);
      }
    });
    _saveEvents();
  }

  @override
  Widget build(BuildContext context) {
    final todayEvents = events[selectedDay] ?? [];

    return Scaffold(
      appBar: AppBar(
        title: const Text("Appointments"),
        backgroundColor: kPrimaryLightColor,
        elevation: 0,
      ),
      body: Stack(
        children: [
          Column(
            children: [
              // Calendar widget
              TableCalendar(
                focusedDay: focusedDay,
                firstDay: DateTime(2010),
                lastDay: DateTime(2050),
                calendarFormat: calendarFormat,
                startingDayOfWeek: StartingDayOfWeek.monday,
                headerStyle: HeaderStyle(
                  formatButtonVisible: true,
                  formatButtonShowsNext: false,
                  formatButtonDecoration: BoxDecoration(
                    color: const Color(0xFFB3E5FC),
                    borderRadius: BorderRadius.circular(8.0),
                  ),
                ),
                calendarStyle: const CalendarStyle(
                  isTodayHighlighted: true,
                  todayDecoration: BoxDecoration(
                    color: Color(0xFFFFB466),
                    shape: BoxShape.circle,
                  ),
                  todayTextStyle: TextStyle(
                    fontWeight: FontWeight.bold,
                    color: Colors.white,
                  ),
                  selectedDecoration: BoxDecoration(
                    color: Color(0xFFE4EFFA),
                    shape: BoxShape.circle,
                  ),
                  selectedTextStyle: TextStyle(
                    color: Colors.black,
                  ),
                  markerDecoration: BoxDecoration(
                    color: Colors.green,
                    shape: BoxShape.circle,
                  ),
                ),
                eventLoader: (date) {
                  return events[date] ?? [];
                },
                selectedDayPredicate: (DateTime inputDate) {
                  return isSameDay(selectedDay, inputDate);
                },
                onFormatChanged: (CalendarFormat inputFormat) {
                  setState(() {
                    calendarFormat = inputFormat;
                  });
                },
                onDaySelected:
                    (DateTime inputSelectedDay, DateTime inputFocusedDay) {
                  setState(() {
                    selectedDay = inputSelectedDay;
                    focusedDay = inputFocusedDay;
                  });
                },
              ),
              const Divider(thickness: 3.0),
              // Event cards
              Expanded(
                child: SingleChildScrollView(
                  child: Container(
                    margin: const EdgeInsets.all(8.0),
                    child: Column(
                      children: todayEvents.map((event) {
                        return GestureDetector(
                          onTap: () {
                            Navigator.push(
                              context,
                              MaterialPageRoute(
                                builder: (context) => MeetingDetailPage(
                                  title: event['title'] ??
                                      'No Title', // Provide default value
                                  supervisor:
                                      event['supervisor'] ?? 'No Supervisor',
                                  patient: event['patient'] ?? 'No Patient',
                                  roomNo: event['roomNo'] ?? 'No Room',
                                  date: event['date'] != null
                                      ? formatDate(event['date'])
                                      : 'No Date Available', // Format or provide fallback
                                  startTime: event['startTime'] != null
                                      ? formatTimeOfDay(event['startTime'])
                                      : 'No Start Time',
                                  endTime: event['endTime'] != null
                                      ? formatTimeOfDay(event['endTime'])
                                      : 'No End Time',
                                  description:
                                      event['description'] ?? 'No Description',
                                ),
                              ),
                            );
                          },
                          child: MeetingCardWidget(
                            title: event['title'],
                            supervisor: event['supervisor'],
                            patient: event['patient'],
                            roomNo: event['roomNo'],
                            date: event['date'],
                            startTime: formatTimeOfDay(event['startTime']),
                            endTime: formatTimeOfDay(event['endTime']),
                            description: event['description'],
                          ),
                        );
                      }).toList(),
                    ),
                  ),
                ),
              )
            ],
          ),
        ],
      ),
      floatingActionButton: FloatingActionButton(
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(12.0),
        ),
        child: const Icon(Icons.add),
        onPressed: () async {
          final newEvent = await Navigator.push(
            context,
            MaterialPageRoute(
              builder: (context) => AppointmentForm(selectedDate: selectedDay),
            ),
          );

          if (newEvent != null) {
            _addEvent(selectedDay, newEvent);
          }
        },
      ),
    );
  }
}
