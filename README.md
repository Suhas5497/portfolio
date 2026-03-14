# Suhas Dhamapurkar - Data Analyst Portfolio

A professional, interactive portfolio website showcasing data analytics projects, machine learning models, and business intelligence work.

## 🚀 Live Demo

Visit the portfolio at: [Your deployed URL]

## ✨ Features

- **Clean, Professional Design**: Light theme with emerald/teal accent colors
- **Interactive Charts**: Real-time visualizations using Recharts
- **Project Showcase**: 4 featured analytics projects with images and demo links
- **Streamlit Integration**: Embedded demos with modal preview and direct launch options
- **Responsive Layout**: Optimized for desktop, tablet, and mobile
- **Smooth Animations**: Powered by Framer Motion
- **Resume Download**: Direct PDF download functionality

## 📁 Project Structure

```
├── public/
│   ├── assets/
│   │   ├── churn-model.png              # Customer Churn project image
│   │   ├── stock-forecast-chart.png     # Stock Forecasting project image
│   │   ├── retail-sales-dashboard.png   # Retail Sales project image
│   │   └── resilytics-dashboard.png     # Amazon Prime project image
│   └── resume.pdf                        # Your resume PDF
├── src/
│   ├── data/
│   │   ├── revenue_forecast.json        # Revenue chart data
│   │   ├── churn_drivers.json           # Churn drivers chart data
│   │   └── skills_radar.json            # Skills radar chart data
│   ├── App.jsx                           # Main React component
│   ├── styles.css                        # Global styles
│   └── main.jsx                          # Entry point
├── index.html
├── package.json
├── tailwind.config.cjs
├── postcss.config.cjs
└── vite.config.mts
```

## 🛠️ Tech Stack

- **Framework**: React 18
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **Charts**: Recharts
- **Animations**: Framer Motion
- **Icons**: Custom SVG icons

## 🏃‍♂️ Running Locally

### Prerequisites

- Node.js 18+ installed
- npm or yarn package manager

### Installation

1. Clone the repository:
```bash
git clone https://github.com/Suhas5497/portfolio.git
cd portfolio
```

2. Install dependencies:
```bash
npm install
# or
yarn install
```

3. Start the development server:
```bash
npm run dev
# or
yarn dev
```

4. Open [http://localhost:5173](http://localhost:5173) in your browser

## 📦 Building for Production

```bash
npm run build
# or
yarn build
```

The built files will be in the `dist/` directory.

## 🚀 Deploying to GitHub Pages

### Method 1: Manual Deployment

1. Build the project:
```bash
npm run build
```

2. Deploy the `dist` folder to GitHub Pages using:
```bash
npx gh-pages -d dist
```

### Method 2: GitHub Actions (Recommended)

1. Create `.github/workflows/deploy.yml`:
```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [main]

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          
      - name: Install dependencies
        run: npm ci
        
      - name: Build
        run: npm run build
        
      - name: Deploy to GitHub Pages
        uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./dist
```

2. In your repository settings, set GitHub Pages source to the `gh-pages` branch.

### Configuration for GitHub Pages

Update `vite.config.mts` with your repository name:
```javascript
export default defineConfig({
  base: '/your-repo-name/',
  // ... other config
});
```

## 🖼️ Adding Project Images

1. Place your project images in `/public/assets/`
2. Recommended dimensions: 800x400px or similar aspect ratio
3. Supported formats: PNG, JPG, WebP

## 📄 Updating Resume

1. Replace `/public/resume.pdf` with your updated resume
2. Keep the filename as `resume.pdf` or update the link in `App.jsx`

## 🔗 Configuring Streamlit Demo URLs

Edit the `DEMO_URLS` object in `/src/App.jsx`:

```javascript
const DEMO_URLS = {
  churn: "https://your-churn-demo.streamlit.app",
  retail: "https://your-retail-demo.streamlit.app",
};
```

Leave the URL empty string `""` to show "Demo Coming Soon" button.

## 🎨 Customization

### Changing Colors

Edit the color palette in `tailwind.config.cjs`:
```javascript
colors: {
  primary: {
    500: "#10b981", // Main accent color
    // ... other shades
  }
}
```

### Updating Personal Information

Edit contact details in the `Contact` component in `/src/App.jsx`:
- Email address
- LinkedIn profile
- GitHub profile

### Modifying Projects

Update the project cards in the `Projects` component:
- Title and description
- Technology tags
- Problem/Approach/Insights
- GitHub and demo links
- Project images

## 📧 Contact

- **Email**: suhasdhamapurkar1710@gmail.com
- **LinkedIn**: [linkedin.com/in/suhas-1710d](https://linkedin.com/in/suhas-1710d)
- **GitHub**: [github.com/Suhas5497](https://github.com/Suhas5497)

## 📝 License

This project is open source and available under the [MIT License](LICENSE).

---

Built with ❤️ by Suhas Dhamapurkar
