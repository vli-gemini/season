# Season

A 30-day creator community app, designed to end.

## Running the app

```
npm start
```

Then open [http://localhost:8081](http://localhost:8081) in your browser.

## Screens

| Screen | URL |
|---|---|
| Splash | http://localhost:8081/ |
| Onboarding | http://localhost:8081/onboarding |
| Auth | http://localhost:8081/auth |
| Waitlist | http://localhost:8081/waitlist |
| Quiz | http://localhost:8081/quiz |
| Home | http://localhost:8081/home |
| DM | http://localhost:8081/dm |
| Profile | http://localhost:8081/profile |
| Season Wrap | http://localhost:8081/season-wrap |

## Dev notes

- Change `CURRENT_DAY` in `src/config/season.js` to simulate different points in the season
- Ember particles appear on day 24+ and increase toward day 30
- Background gradient shifts from cool purple/teal (day 1) to rust/amber (day 30)
