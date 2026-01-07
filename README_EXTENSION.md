# GitHub Follower Analyzer - Chrome Extension

A powerful Chrome extension to analyze your GitHub followers and following relationships. Quickly discover who follows you back, who doesn't, and manage your GitHub network efficiently.

![Extension Preview](preview.png)

## 🌟 Features

- **Quick Analysis**: Analyze any GitHub user's followers and following in seconds
- **Smart Insights**: See who follows you back (mutual), who you don't follow back, and who doesn't follow you back
- **Clean Interface**: Modern, GitHub-themed UI that fits perfectly with GitHub's design language
- **Export Data**: Download your analysis as JSON for future reference
- **Sorting Options**: Sort users alphabetically (A-Z or Z-A)
- **Cached Results**: Saves your last analysis for quick access (24-hour cache)
- **No Login Required**: Works without GitHub authentication (with rate limits)
- **Token Support**: Optional GitHub token support for users with many followers/following

## 📦 Installation

### Install from Chrome Web Store (Coming Soon)
*Extension will be available on Chrome Web Store soon*

### Install Manually (Developer Mode)

1. **Download the Extension**
   - Clone or download this repository
   ```bash
   git clone https://github.com/TheMIU/GitHub-Follower-Analyzer.git
   ```

2. **Open Chrome Extensions Page**
   - Open Google Chrome
   - Navigate to `chrome://extensions/`
   - Or click the three dots menu → More tools → Extensions

3. **Enable Developer Mode**
   - Toggle the "Developer mode" switch in the top-right corner

4. **Load the Extension**
   - Click "Load unpacked"
   - Select the `GitHub-Follower-Analyzer` folder
   - The extension icon should appear in your toolbar

## 🚀 Usage

### Basic Usage

1. **Click the Extension Icon**
   - Find the GitHub Follower Analyzer icon in your Chrome toolbar
   - Click it to open the popup

2. **Enter Username**
   - The extension defaults to username: `rumi097`
   - Change it to any GitHub username you want to analyze
   - Click "Analyze"

3. **View Results**
   - **Mutual**: Users who follow you and you follow back
   - **You Don't Follow**: Your followers that you haven't followed back
   - **Don't Follow You**: Users you follow who don't follow you back

### Advanced Usage

#### Using Access Token

For accounts with large follower/following counts, you may need a GitHub token:

1. **Generate a Token**
   - Go to GitHub → Settings → Developer settings → Personal access tokens → Fine-grained tokens
   - Click "Generate new token"
   - Set expiration and permissions (read-only access is sufficient)
   - Copy the token

2. **Use in Extension**
   - Paste the token in the "Access Token" field
   - This increases rate limits from 60 to 5000 requests per hour

#### Export Data

- Click the "JSON" button to download your analysis
- File includes: followers, following, mutual, and non-mutual lists
- Filename format: `username_followers_MM-DD-YYYY.json`

## 🛠️ Configuration

### Default Username

The extension is pre-configured with username `rumi097`. To change the default:

1. Open `js/popup.js`
2. Find line 2:
   ```javascript
   let githubUsername = 'rumi097';
   ```
3. Change to your preferred default username
4. Reload the extension in `chrome://extensions/`

## ⚙️ Technical Details

### Files Structure
```
GitHub-Follower-Analyzer/
├── manifest.json          # Extension configuration
├── popup.html            # Extension popup UI
├── js/
│   ├── popup.js          # Extension logic
│   └── script.js         # Original web app script
├── css/
│   ├── popup.css         # Extension styles
│   └── styles.css        # Original web app styles
├── img/
│   └── fav.ico          # Extension icon
├── index.html           # Original web app (still functional)
└── README_EXTENSION.md  # This file
```

### Permissions

- **storage**: Save analysis results locally
- **host_permissions**: Access GitHub API (api.github.com)

### Rate Limits

- **Without Token**: 60 requests per hour
- **With Token**: 5000 requests per hour

## 🔧 Development

### Testing Locally

1. Make changes to the code
2. Go to `chrome://extensions/`
3. Click the refresh icon on the extension card
4. Click the extension icon to test

### Debugging

1. Right-click the extension icon → "Inspect popup"
2. Use Chrome DevTools to debug
3. Check Console for errors and Network tab for API calls

## 🐛 Troubleshooting

### Extension Not Loading
- Ensure Developer mode is enabled
- Check that all files are present in the folder
- Look for errors in `chrome://extensions/`

### API Rate Limit Exceeded
- Add a GitHub access token
- Wait for the rate limit to reset (shown in error message)

### No Data Showing
- Check username spelling
- Verify internet connection
- Check if GitHub API is accessible

### Extension Icon Not Appearing
- Pin the extension: Click the puzzle icon → Pin GitHub Follower Analyzer
- Reload the extension

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👥 Authors

- **Kasun Miuranga** - [@TheMIU](https://github.com/TheMIU)
- **Arbitrary Hexcode** - [@0XDE57](https://github.com/0XDE57)
- **Extension by** - [@rumi097](https://github.com/rumi097)

## 🌐 Links

- **Original Web App**: [themiu.github.io/GitHub-Follower-Analyzer](https://themiu.github.io/GitHub-Follower-Analyzer)
- **GitHub Repository**: [GitHub-Follower-Analyzer](https://github.com/TheMIU/GitHub-Follower-Analyzer)
- **Report Issues**: [Issue Tracker](https://github.com/TheMIU/GitHub-Follower-Analyzer/issues)

## 🙏 Acknowledgments

- GitHub API for providing the data
- Font Awesome for icons
- Chrome Extension API documentation

---

**Made with ❤️ for the GitHub community**

*If you find this extension helpful, please give it a ⭐ on GitHub!*
