# Global Wallet - Build Guide

This guide provides step-by-step instructions for building the Global Wallet Android APK.

## Prerequisites

- Node.js 18+ installed
- npm or yarn package manager
- Expo CLI installed globally
- EAS CLI installed globally
- Android Studio (optional, for debugging)

## Environment Setup

1. **Install Dependencies:**
```bash
npm install
```

2. **Configure Environment Variables:**
Copy `.env.example` to `.env` and fill in your credentials:
```bash
cp .env.example .env
```

Required environment variables:
- `SUPABASE_URL`: Your Supabase project URL
- `SUPABASE_KEY`: Your Supabase anon/public key
- `API_URL`: Your Express server URL
- `ADMIN_MOBILE`: Mobile number for admin access

## Development Build

To run the app in development mode:

```bash
npx expo start
```

Press `a` to run on Android emulator or device.

## Production Build (APK)

### Option 1: EAS Build (Recommended)

1. **Install EAS CLI:**
```bash
npm install -g eas-cli
```

2. **Login to Expo:**
```bash
eas login
```

3. **Configure Build:**
The `eas.json` file is already configured for production builds.

4. **Build APK:**
```bash
eas build --platform android --profile preview
```

This will build an APK that can be installed directly on Android devices.

5. **Build AAB (for Play Store):**
```bash
eas build --platform android --profile production
```

This builds an Android App Bundle (.aab) for Play Store submission.

### Option 2: Local Build

1. **Configure Android Local Build:**
```bash
eas build --platform android --local
```

2. **Or use Expo Application Services:**
```bash
npx expo run:android
```

## Build Configuration

### Android Permissions

The app requires the following permissions (configured in `app.json`):
- `INTERNET` - Required for API calls
- `ACCESS_NETWORK_STATE` - Check network connectivity
- `VIBRATE` - Haptic feedback
- `CAMERA` - For QR code scanning (future feature)
- `READ_EXTERNAL_STORAGE` - For uploading payment receipts
- `WRITE_EXTERNAL_STORAGE` - For saving files
- `RECEIVE_BOOT_COMPLETED` - For notifications (future)

### App Signing

For EAS builds, signing is handled automatically:

1. **First build:** EAS generates a keystore automatically
2. **Download keystore:** After first build, download and backup the keystore
3. **Subsequent builds:** EAS uses the same keystore

To manage your keystore:
```bash
eas credentials:manage
```

## Testing Before Build

### Type Checking
```bash
npm run check:types
```

### Linting
```bash
npm run lint
```

### Format Check
```bash
npm run check:format
```

### Auto-fix Lint/Format Issues
```bash
npm run lint:fix
npm run format
```

## Build Verification

After the build is complete:

1. **Download the APK** from EAS dashboard
2. **Install on device:**
```bash
adb install global-wallet-1.0.0.apk
```
3. **Test core features:**
   - User registration and login
   - PIN entry and recovery
   - Dashboard navigation
   - Add funds (payment screen)
   - Withdrawal request
   - Profile management
   - Admin panel (for admin users)
   - Notifications
   - Privacy policy and terms of service
   - Account deletion

## Play Store Submission

### Pre-submission Checklist

- [ ] App version is incremented in `app.json`
- [ ] All environment variables are configured
- [ ] Privacy policy URL is set
- [ ] Terms of service are accessible
- [ ] Account deletion feature is implemented
- [ ] Age verification is mentioned
- [ ] Data safety form is completed in Play Console
- [ ] Screenshots are prepared (at least 2)
- [ ] App icon and feature graphic are ready
- [ ] Content rating questionnaire is completed

### Play Store Screenshots

Required screenshots:
- Phone: 1080x1920px (minimum 2)
- Tablet: 2732x2048px (optional)

Screenshot requirements:
- Dashboard screen
- Referral screen
- Profile screen
- Payment/Add Funds screen
- Withdrawal screen

### Content Rating

- Category: Finance
- Age Rating: Everyone (or appropriate based on features)
- Content descriptors: None

## Troubleshooting

### Build Fails with "Module not found"
- Clear cache: `npm start -- --clear`
- Reinstall dependencies: `rm -rf node_modules && npm install`

### APK Size Too Large
- Enable ProGuard (already configured in `android/proguard-rules.pro`)
- Optimize images in `assets/images/`
- Use bundle splitting (configured in `eas.json`)

### Signing Issues
- Verify EAS credentials: `eas credentials:check`
- Regenerate keystore if needed: `eas credentials:reset android.keystore`

### App Crashes on Launch
- Check `app.json` configuration
- Verify environment variables are set
- Check Supabase connection
- Review build logs for errors

## Server Deployment

The Express server (`server/index.ts`) needs to be deployed separately:

### Recommended Platforms
- Railway
- Render
- Heroku
- DigitalOcean App Platform

### Deployment Steps
1. Push server code to git repository
2. Connect repository to hosting platform
3. Configure environment variables
4. Deploy
5. Update `API_URL` in app environment variables

## Security Notes

- Never commit `.env` files
- Never commit keystore files (`.jks`, `.keystore`)
- Never commit service account keys
- Use environment variables for all secrets
- Rotate API keys regularly
- Keep Supabase service role key secret

## Support

For build issues:
- Check Expo documentation: https://docs.expo.dev
- Check EAS build documentation: https://docs.expo.dev/build/introduction
- Check React Native docs: https://reactnative.dev

## Version History

- `1.0.0` - Initial production release
  - User authentication with mobile + PIN
  - Wallet balance tracking
  - Expense tracking
  - Two-tier referral system
  - Admin panel
  - Payment verification
  - Withdrawal requests
  - Notifications
  - Privacy policy and terms of service
  - Account deletion
  - Session timeout (24h)
  - Device fingerprinting
  - Play Store compliance features
