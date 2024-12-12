import 'package:animated_splash_screen/animated_splash_screen.dart';
import 'package:flutter/material.dart';
import 'package:lottie/lottie.dart';
import 'package:vaanivikas/Screens/Login/login_screen.dart';
import 'package:vaanivikas/constants.dart';

class Splashscreen extends StatelessWidget {
  const Splashscreen({super.key});

  @override
  Widget build(BuildContext context) {
    return AnimatedSplashScreen(
      duration: 3000,
      splash: 
      Column(children: [
        Center(
          child: LottieBuilder.asset("assets/images/Animation - 1731851895107.json"),
        )
      ],),
      nextScreen: LoginScreen(),
      splashIconSize: 500,
      backgroundColor: kPrimaryColor,
    );
  }
}