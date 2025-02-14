#!/bin/bash

# Move app icon resources
# First clean destination directories
rm -rf android/app/src/main/res/mipmap-*/ic_launcher*

# Copy only XML files
cp -r icons/android/res/mipmap-anydpi-v26/* android/app/src/main/res/mipmap-anydpi-v26/

# Copy PNGs
cp icons/android/res/mipmap-mdpi/ic_launcher_foreground.png android/app/src/main/res/mipmap-mdpi/
cp icons/android/res/mipmap-mdpi/ic_launcher_background.png android/app/src/main/res/mipmap-mdpi/
cp icons/android/res/mipmap-mdpi/ic_launcher.png android/app/src/main/res/mipmap-mdpi/
cp icons/android/res/mipmap-mdpi/ic_launcher_round.png android/app/src/main/res/mipmap-mdpi/

cp icons/android/res/mipmap-hdpi/ic_launcher_foreground.png android/app/src/main/res/mipmap-hdpi/
cp icons/android/res/mipmap-hdpi/ic_launcher_background.png android/app/src/main/res/mipmap-hdpi/
cp icons/android/res/mipmap-hdpi/ic_launcher.png android/app/src/main/res/mipmap-hdpi/
cp icons/android/res/mipmap-hdpi/ic_launcher_round.png android/app/src/main/res/mipmap-hdpi/

cp icons/android/res/mipmap-xhdpi/ic_launcher_foreground.png android/app/src/main/res/mipmap-xhdpi/
cp icons/android/res/mipmap-xhdpi/ic_launcher_background.png android/app/src/main/res/mipmap-xhdpi/
cp icons/android/res/mipmap-xhdpi/ic_launcher.png android/app/src/main/res/mipmap-xhdpi/
cp icons/android/res/mipmap-xhdpi/ic_launcher_round.png android/app/src/main/res/mipmap-xhdpi/

cp icons/android/res/mipmap-xxhdpi/ic_launcher_foreground.png android/app/src/main/res/mipmap-xxhdpi/
cp icons/android/res/mipmap-xxhdpi/ic_launcher_background.png android/app/src/main/res/mipmap-xxhdpi/
cp icons/android/res/mipmap-xxhdpi/ic_launcher.png android/app/src/main/res/mipmap-xxhdpi/
cp icons/android/res/mipmap-xxhdpi/ic_launcher_round.png android/app/src/main/res/mipmap-xxhdpi/

cp icons/android/res/mipmap-xxxhdpi/ic_launcher_foreground.png android/app/src/main/res/mipmap-xxxhdpi/
cp icons/android/res/mipmap-xxxhdpi/ic_launcher_background.png android/app/src/main/res/mipmap-xxxhdpi/
cp icons/android/res/mipmap-xxxhdpi/ic_launcher.png android/app/src/main/res/mipmap-xxxhdpi/
cp icons/android/res/mipmap-xxxhdpi/ic_launcher_round.png android/app/src/main/res/mipmap-xxxhdpi/

# Create splash screen directories
mkdir -p android/app/src/main/res/drawable{,-land-hdpi,-land-mdpi,-land-xhdpi,-land-xxhdpi,-land-xxxhdpi,-port-hdpi,-port-mdpi,-port-xhdpi,-port-xxhdpi,-port-xxxhdpi}

# Copy icons with correct size for each density
cp icons/android/res/mipmap-mdpi/ic_launcher_foreground.png android/app/src/main/res/drawable/splash.png
cp icons/android/res/mipmap-mdpi/ic_launcher_foreground.png android/app/src/main/res/drawable-land-mdpi/splash.png
cp icons/android/res/mipmap-mdpi/ic_launcher_foreground.png android/app/src/main/res/drawable-port-mdpi/splash.png

cp icons/android/res/mipmap-hdpi/ic_launcher_foreground.png android/app/src/main/res/drawable-land-hdpi/splash.png
cp icons/android/res/mipmap-hdpi/ic_launcher_foreground.png android/app/src/main/res/drawable-port-hdpi/splash.png

cp icons/android/res/mipmap-xhdpi/ic_launcher_foreground.png android/app/src/main/res/drawable-land-xhdpi/splash.png
cp icons/android/res/mipmap-xhdpi/ic_launcher_foreground.png android/app/src/main/res/drawable-port-xhdpi/splash.png

cp icons/android/res/mipmap-xxhdpi/ic_launcher_foreground.png android/app/src/main/res/drawable-land-xxhdpi/splash.png
cp icons/android/res/mipmap-xxhdpi/ic_launcher_foreground.png android/app/src/main/res/drawable-port-xxhdpi/splash.png

cp icons/android/res/mipmap-xxxhdpi/ic_launcher_foreground.png android/app/src/main/res/drawable-land-xxxhdpi/splash.png
cp icons/android/res/mipmap-xxxhdpi/ic_launcher_foreground.png android/app/src/main/res/drawable-port-xxxhdpi/splash.png 