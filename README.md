# Season

A 30-day creator community app, designed to end.

## Setup

```bash
npm install
```

## Running

### Web browser

```bash
npm run web
```

Then open [http://localhost:8081](http://localhost:8081) in your browser. Works in Chrome, Safari, or Firefox — no install needed.

### iOS simulator (Mac only)

```bash
npm run ios
```

Requires Xcode and iOS Simulator installed.

### Android emulator

```bash
npm run android
```

Requires Android Studio and an AVD configured.

### Physical device (Expo Go)

```bash
npm start
```

Scan the QR code in the terminal with the **Expo Go** app ([iOS](https://apps.apple.com/app/expo-go/id982107779) / [Android](https://play.google.com/store/apps/details?id=host.exp.exponent)).

---

## Screen routes (web)

Navigate directly to any screen at `http://localhost:8081`:

| Screen | URL |
|---|---|
| Splash | [/](http://localhost:8081/) |
| Onboarding | [/onboarding](http://localhost:8081/onboarding) |
| Quiz | [/quiz](http://localhost:8081/quiz) |
| Waitlist | [/waitlist](http://localhost:8081/waitlist) |
| Match Reveal | [/match](http://localhost:8081/match) |
| Auth | [/auth](http://localhost:8081/auth) |
| Home | [/home](http://localhost:8081/home) |
| DM List | [/dms](http://localhost:8081/dms) |
| DM | [/dm](http://localhost:8081/dm) |
| Member Profile | [/member](http://localhost:8081/member) |
| Group Settings | [/group](http://localhost:8081/group) |
| Profile | [/profile](http://localhost:8081/profile) |
| Season Wrap | [/season-wrap](http://localhost:8081/season-wrap) |
| Season Ending | [/season-ending](http://localhost:8081/season-ending) |

---

## Dev notes

- Change `CURRENT_DAY` in `src/config/season.js` to simulate different points in the season
- Ember particles appear on day 24+ and increase toward day 30
- Background gradient shifts from cool purple/teal (day 1) to rust/amber (day 30)
