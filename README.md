# Rainy Cup Corner v2

A tiny personal ambient sound mixer for cozy rainy-cafe sounds.

## Run locally

```bash
npm install
npm run dev
```

## Add your sounds

Put your audio files in:

```text
public/sounds/
```

Use these file names for version 2:

```text
rain.mp3
wind.mp3
cafe.mp3
birds.mp3
```

The app will still compile without the audio files, but sound will only play after you add them.

## Deploy to Vercel

1. Push this project to GitHub.
2. Import the GitHub repo in Vercel.
3. Deploy.
4. Open the link on your phone.

## Notes

- Browser audio usually requires a user tap first, so press **Start Cozy Mode** to begin.
- Settings are saved in `localStorage`.
- This is a small starter version for personal use.
