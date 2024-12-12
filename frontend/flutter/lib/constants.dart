import 'package:flutter/material.dart';

const kButtonColor = Color(0xFF5db075); 
const kColor = Color(0xFF319d7f); 
const kPrimaryLightColor = Color(0xFF098882);
const kPrimaryColor = Color(0xFF0e727c); 
const kPrimaryDarkColor = Color(0xFF245d6d); 
const kSecondaryColor = Color(0xFF2f4858); 

const double defaultPadding = 16.0;

// Text Styles
const kAppBarTextStyle = TextStyle(
  fontSize: 18.0,
  fontWeight: FontWeight.bold,
  color: Colors.white,
);

const kHeaderTextStyle = TextStyle(
  fontSize: 16.0,
  fontWeight: FontWeight.w500,
  color: kPrimaryDarkColor,
);

const kLabelTextStyle = TextStyle(
  fontSize: 14.0,
  color: kSecondaryColor,
);

const kButtonTextStyle = TextStyle(
  fontSize: 16.0,
  fontWeight: FontWeight.w600,
  color: Colors.white,
);

const String apiBaseUrl = "http://localhost:3000"; // Change to live URL after deployment
