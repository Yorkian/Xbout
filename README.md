# Xbout - Chrome Extension

Display a user’s account location 🌍, device type (🍎 Apple / 🤖 Android), and registration year directly on X (Twitter) pages.

![x](https://github.com/Yorkian/Xbout/blob/main/Pic.png?raw=true)

## Features

* 🌏 Asia/Oceania regions
* 🌎 Americas
* 🌍 Europe/Africa
* 🇺🇸🇨🇳🇯🇵 Specific country flags
* 🍎 Apple device users
* 🤖 Android device users
* Chrome icon for web users
* **2009** registration year

## Display Example

```
@elonmusk · Nov 24 · 🇺🇸｜🍎｜2009
```

## Installation

1. Download all files in this folder
2. Open Chrome and visit `chrome://extensions/`
3. Enable “Developer mode” in the top-right corner
4. Click “Load unpacked”
5. Select the folder containing these files
6. Done! Visit X.com to see the effect
7. Or install from the [Chrome Web Store](https://chromewebstore.google.com/detail/xbout/fbghhoaacmbjmbmekocphjnkdjoplgad)  [Greasy Fork](https://greasyfork.org/zh-CN/scripts/557057-xbout)  [Mozilla](https://addons.mozilla.org/en-US/firefox/addon/xbout/)directly

## File Structure

```
xbout/
├── manifest.json      # Extension configuration
├── content.js         # Core script
├── styles.css         # Stylesheet
├── icon16.png         # 16x16 icon
├── icon48.png         # 48x48 icon
├── icon128.png        # 128x128 icon
└── README.md          # Documentation
```

## Data Sources

* **Account location**: From `https://x.com/username/about`
* **Device info**: From the client used when posting tweets
* **Registration year**: From the account creation date

## Caching Mechanism

* Successful data cached for 24 hours
* Error data cached for 30 minutes
* Max 10 API requests per minute
* Data stored in localStorage

## License

MIT License
