# Site Simplifier

**Make the web calmer, clearer, and easier - instantly.**

Site Simplifier is a lightweight Chrome extension that automatically reduces website clutter, clarifies visual hierarchy, and improves navigation - without requiring any configuration.

Think of it as **Reader Mode for the entire web**, not just articles.

## Features

### Core Functionality (V1 MVP)

- **Automatic Simplification Engine**
  - Detects and highlights main content
  - Hides ads, popups, cookie banners, and promotional elements
  - De-emphasizes sidebars, related content, and secondary elements
  - Handles sticky/fixed elements that clutter the viewport

- **Navigation Cleanup**
  - Reduces visual noise in headers
  - Simplifies oversized navigation menus

- **Readability Improvements**
  - Increased line spacing for better readability
  - Improved contrast for text content
  - Centered content container for focused reading

- **Simple Controls**
  - One-click global toggle
  - Per-site enable/disable
  - Three simplification levels: Light, Balanced, Aggressive
  - Instant reset to original page state

### What Makes It Special

- **Zero configuration required** - works immediately after installation
- **100% client-side** - no servers, no accounts, no data collection
- **Lightweight** - minimal performance impact
- **Non-destructive** - easily toggle off or reset any page
- **Privacy-focused** - only uses local storage for your preferences

## Installation

### For Development/Testing

1. **Clone or download this repository**
   ```bash
   git clone https://github.com/yourusername/site-simplifier-tool.git
   cd site-simplifier-tool
   ```

2. **Open Chrome Extensions page**
   - Navigate to `chrome://extensions/` in your Chrome browser
   - Or go to Menu > More Tools > Extensions

3. **Enable Developer Mode**
   - Toggle the "Developer mode" switch in the top-right corner

4. **Load the extension**
   - Click "Load unpacked"
   - Select the `site-simplifier-tool` directory (the folder containing `manifest.json`)

5. **Pin the extension** (optional but recommended)
   - Click the puzzle piece icon in Chrome's toolbar
   - Find "Site Simplifier" and click the pin icon

6. **Test the extension**
   - Visit any content-heavy website (news sites, blogs, etc.)
   - Click the Site Simplifier icon to see the popup controls
   - The page should automatically be simplified

### Updating During Development

When you make changes to the extension code:

1. Go to `chrome://extensions/`
2. Find "Site Simplifier"
3. Click the refresh icon (circular arrow) on the extension card
4. Reload any tabs where you want to see the changes

## Usage

### Popup Controls

Click the Site Simplifier icon in your browser toolbar to access:

| Control | Description |
|---------|-------------|
| **Extension Enabled** | Master toggle - turns the extension on/off globally |
| **Enable for this site** | Toggle simplification for the current domain |
| **Simplification Level** | Choose between Light, Balanced (default), or Aggressive |
| **Simplify Now** | Manually trigger simplification on the current page |
| **Reset Page** | Restore the page to its original state |

### Simplification Levels

| Level | Description |
|-------|-------------|
| **Light** | Subtle cleanup - fades secondary content, improves spacing |
| **Balanced** | Recommended - hides clutter, de-emphasizes sidebars, improves readability |
| **Aggressive** | Maximum cleanup - also affects headers, footers, and metadata |

### Badge Indicators

The extension icon shows:
- **ON** (blue) - Extension is active on this page
- **OFF** (gray) - Extension is disabled (globally or for this site)
- No badge - Cannot run on this page (chrome:// pages, etc.)

## Project Structure

```
site-simplifier-tool/
├── manifest.json           # Chrome extension manifest (Manifest V3)
├── README.md              # This file
├── development-plan.md    # Product roadmap and development plan
├── background/
│   └── background.js      # Service worker for extension lifecycle
├── content/
│   ├── content.js         # Main simplification engine
│   └── content.css        # Injected styles for simplification
├── popup/
│   ├── popup.html         # Popup UI structure
│   ├── popup.css          # Popup styling
│   └── popup.js           # Popup interaction logic
├── icons/
│   ├── icon.svg           # Source icon (vector)
│   ├── icon16.png         # Toolbar icon (16x16)
│   ├── icon32.png         # Toolbar icon @2x (32x32)
│   ├── icon48.png         # Extension management (48x48)
│   └── icon128.png        # Chrome Web Store (128x128)
└── scripts/
    └── generate-icons.py  # Script to generate PNG icons
```

## How It Works

### Content Detection

The extension uses heuristics to identify:

1. **Main content** - Articles, posts, primary content containers
2. **Clutter** - Ads, popups, banners, promotional content
3. **Secondary content** - Sidebars, related articles, comments
4. **Navigation** - Headers, menus, navigation bars

### Simplification Process

1. **Inject styles** - Base CSS rules for simplification classes
2. **Detect main content** - Find the primary content container
3. **Hide clutter** - Add hidden class to unwanted elements
4. **De-emphasize secondary** - Fade non-essential content
5. **Handle sticky elements** - Unstick non-navigation fixed elements
6. **Enhance readability** - Improve spacing and contrast

### Safety Features

- Never hides critical page elements (forms, inputs, main navigation)
- De-emphasized elements are fully interactive on hover
- Easy one-click reset to original state
- Fails silently if something goes wrong

## Publishing to Chrome Web Store

### Prerequisites

1. **Google Developer Account**
   - Sign up at [Chrome Web Store Developer Dashboard](https://chrome.google.com/webstore/devconsole)
   - One-time registration fee: $5 USD

2. **Prepare Assets**
   - Extension icons (already included)
   - Screenshots (1280x800 or 640x400)
   - Promotional images (optional):
     - Small tile: 440x280
     - Large tile: 920x680
     - Marquee: 1400x560

### Step-by-Step Publishing

1. **Create a ZIP file of your extension**
   ```bash
   cd site-simplifier-tool
   zip -r site-simplifier.zip . -x "*.git*" -x "scripts/*" -x "*.md" -x ".DS_Store"
   ```

2. **Go to Developer Dashboard**
   - Visit: https://chrome.google.com/webstore/devconsole
   - Click "New Item"

3. **Upload your extension**
   - Upload the `site-simplifier.zip` file
   - Wait for the upload to complete

4. **Fill in store listing**
   - **Name**: Site Simplifier
   - **Summary**: Make the web calmer, clearer, and easier - instantly
   - **Description**: (detailed description of features)
   - **Category**: Productivity
   - **Language**: English

5. **Upload screenshots**
   - Capture the extension in action on various websites
   - Show the popup interface
   - Highlight before/after comparisons

6. **Configure privacy practices**
   - Declare permissions usage:
     - `activeTab`: To apply simplification to the current page
     - `storage`: To save user preferences locally
   - Confirm no data collection or external servers

7. **Submit for review**
   - Click "Submit for Review"
   - Review typically takes 1-3 business days

### Post-Publication

- Monitor reviews and ratings
- Respond to user feedback
- Update the extension as needed
- Track install statistics in the dashboard

## Development

### Requirements

- Chrome browser (version 88+)
- Text editor or IDE
- Python 3 (for icon generation, optional)

### Making Changes

1. Edit files in the project directory
2. Go to `chrome://extensions/`
3. Click the refresh button on the extension card
4. Reload target pages to see changes

### Debugging

- **Popup**: Right-click the popup and select "Inspect"
- **Content Script**: Open DevTools on the page, check Console for `Site Simplifier:` messages
- **Background**: Go to `chrome://extensions/`, click "service worker" link on the extension card

### Code Style

- Use ES6+ features
- Prefer `const` over `let`
- Use async/await for Promises
- Add try/catch for error handling
- Keep functions focused and small

## Permissions Explained

| Permission | Usage |
|------------|-------|
| `activeTab` | Access the current tab to inject content scripts |
| `storage` | Store user preferences locally in the browser |
| `host_permissions: <all_urls>` | Apply simplification to any website |

The extension:
- Does NOT collect or transmit any user data
- Does NOT require any account or login
- Does NOT connect to any external servers
- Stores all preferences locally in your browser

## Troubleshooting

### Extension not working

1. Make sure the extension is enabled in `chrome://extensions/`
2. Check that the global toggle is ON in the popup
3. Check that the site toggle is ON for the current domain
4. Try clicking "Simplify Now" in the popup
5. Some pages (chrome://, chrome-extension://) cannot be modified

### Page looks broken

1. Click "Reset Page" in the popup
2. Disable the extension for this site
3. Try a different simplification level
4. Report the issue with the URL

### Changes not appearing

1. Refresh the extension in `chrome://extensions/`
2. Hard reload the page (Ctrl+Shift+R / Cmd+Shift+R)
3. Check the browser console for errors

## Contributing

Contributions are welcome! Please:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

MIT License - feel free to use, modify, and distribute.

## Acknowledgments

Built with the philosophy of making the web a calmer, more focused place.

---

**Version**: 1.0.0
**Manifest Version**: 3
**Minimum Chrome Version**: 88
