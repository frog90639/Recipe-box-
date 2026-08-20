# Recipe Box

A web app for managing your HTML recipe collection. Upload, search, and browse your recipes with Safari-compatible local storage.

## Features

- ✨ Upload multiple HTML recipe files at once
- 🔍 Search recipes by name or category
- 📱 Responsive design that works on desktop and mobile
- 💾 All recipes stored locally in your browser (no cloud, no tracking)
- 🍴 Displays ingredients, directions, and nutrition info

## Setup

### Prerequisites
- Node.js 14+ and npm

### Installation

```bash
git clone https://github.com/yourusername/recipe-box.git
cd recipe-box

npm install
```

### Development

```bash
npm start
```

Opens at `http://localhost:3000`

### Deploy to GitHub Pages

1. **Update `package.json`** — change `homepage` to your repo URL:
   ```json
   "homepage": "https://yourusername.github.io/recipe-box"
   ```

2. **Install GitHub Pages tool** (if not already):
   ```bash
   npm install --save-dev gh-pages
   ```

3. **Deploy**:
   ```bash
   npm run deploy
   ```

4. **Enable GitHub Pages** in your repo settings:
   - Go to Settings → Pages
   - Select "Deploy from a branch"
   - Branch: `gh-pages`

Your app will be live at `https://yourusername.github.io/recipe-box`

## Usage

### Adding recipes

1. Click **Add recipes** button
2. Select one or more `.html` files (works with Squarespace, other recipe exporters)
3. Recipes are parsed and saved to your browser's local storage

### Searching

Type in the search box to filter by recipe name or category.

### Managing recipes

- Click a recipe to view full details
- Click **Delete** to remove a recipe (stored locally only)
- Your data stays on your device — never sent anywhere

## Supported formats

Works with HTML recipe files that use standard recipe metadata:
- `<meta itemprop="name">` for recipe title
- `<meta itemprop="recipeIngredient">` for ingredients
- `.directions` class for cooking steps
- `.nutrition` for nutrition facts

The included example shows the expected structure.

## Browser support

Works in all modern browsers (Chrome, Safari, Firefox, Edge). Recipes are stored using the browser's localStorage API.

## Local storage

All recipes are stored in your browser's localStorage. Each browser/device has its own separate copy. To backup:

1. Open browser DevTools (F12)
2. Console tab: `copy(localStorage.getItem('recipes'))`
3. Paste into a text file and save

To restore:

1. Open DevTools Console
2. Paste: `localStorage.setItem('recipes', '<paste your JSON here>')`

## Contributing

This is a personal project, but feel free to fork and customize!

## License

MIT
