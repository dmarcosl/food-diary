# Food Diary App

A mobile application to track your meals and their ingredients, built with React, TypeScript, and Capacitor.

## Description

Food Diary helps you keep track of your meals, plan weekly menus, and manage ingredients. It's designed to help you maintain a record of your favorite meals, organize weekly meal planning, and track when you last had specific dishes.

## Features

### Meal Management
- Add meals with dates
- Categorize meals (breakfast, lunch, dinner)
- Track ingredients for each meal
- View meal history
- Edit meal details
- Quick access to meal details from menus

### Menu Planning
- Create weekly menus
- Customize menu days and meal types
- Assign multiple dishes to each meal type
- Quick navigation between menus and dishes
- Edit menu days individually
- Automatic day ordering (Monday to Sunday)
- Edit menu configuration (included days and meal types)
- Multiple dishes per meal type support

### User Interface
- Dark mode support
- Responsive design
- Multi-language support (English and Spanish)
- Customizable sorting options
  - Sort by date
  - Show undated items first
  - Sort in descending/ascending order
- Interactive meal type icons
- Quick navigation between related items
- Confirmation dialogs for important actions

## Technical Features
- Built with React and TypeScript
- Uses Material-UI components
- Local storage with Capacitor Preferences
- Internationalization with react-intl
- Mobile-first responsive design
- State persistence for user preferences
- Modular component architecture
- Type-safe data management

## Installation

1. Clone the repository
```bash
git clone https://github.com/yourusername/food-diary.git
cd food-diary
```

2. Install dependencies
```bash
npm install
```

3. Start development server
```bash
npm start
```

## Building for Production

### Web Build
```bash
npm run build
```

### Android Build
```bash
npx cap add android
npx cap sync
npx cap open android
```

> Note: App icons are already included in the repository. However, if you want to change them:
> 1. Generate new icons using [Icon Kitchen](https://icon.kitchen/)
> 2. Run the icons script:
>    ```bash
>    chmod +x move-icons.sh
>    ./move-icons.sh
>    ```

To generate the APK:
1. Open the project in Android Studio
2. Go to `Build > Build Bundle(s) / APK(s) > Build APK(s)`
3. The APK will be generated at:
   ```
   android/app/build/outputs/apk/debug/app-debug.apk
   ```

### iOS Build (untested)
```bash
npx cap add ios
npx cap sync
npx cap open ios
```

To generate the IPA:
1. Open the project in Xcode
2. Select your target device
3. Go to `Product > Archive`
4. Once archived, click `Distribute App`
5. The IPA will be generated at:
   ```
   ~/Library/Developer/Xcode/Archives/YYYY-MM-DD/App MM-DD-YY, HH.MM.xcarchive
   ```

> Note: iOS build hasn't been tested. You'll need:
> - macOS
> - Xcode installed
> - Apple Developer account
> - Proper certificates and provisioning profiles

## Usage

1. **Adding Meals**
   - Tap the + button
   - Select "Create Dish"
   - Enter meal name
   - Select category (Breakfast/Lunch/Dinner)

2. **Creating Menus**
   - Tap the + button
   - Select "Create Menu"
   - Enter menu name
   - Select days to include
   - Choose meal types to include

3. **Managing Menus**
   - Edit menu configuration
   - Add/remove dishes to specific days
   - Navigate to dish details from menu
   - Delete menus when needed

4. **Managing Meals**
   - Tap a meal to expand
   - Add dates when you eat it
   - Add/edit ingredients
   - View meal history

5. **Settings**
   - Access via menu button (top-right)
   - Toggle dark mode
   - Change language (EN/ES)
   - Change sorting preferences

## Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

## License

This project is licensed under the MIT License - see the LICENSE file for details.