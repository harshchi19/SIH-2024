import 'package:flutter/material.dart';

class CustomTabBar extends StatelessWidget implements PreferredSizeWidget {
  const CustomTabBar({super.key});

  @override
  Widget build(BuildContext context) {
    return const TabBar(
      isScrollable: true,
      tabs: [
        Tab(text: 'Basic Details'),
        Tab(text: 'Address'),
        Tab(text: 'Medical'),
        Tab(text: 'Non-verbal'),
        Tab(text: 'Reading & Writing'),
        Tab(text: 'Speech History'),
        Tab(text: 'Voice'),
      ],
    );
  }

  @override
  Size get preferredSize => const Size.fromHeight(kToolbarHeight);
}