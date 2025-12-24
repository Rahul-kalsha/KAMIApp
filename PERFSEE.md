# Perfsee Integration

This project includes Perfsee webpack plugin for bundle analysis and performance monitoring.

## What is Perfsee?

Perfsee is a bundle analysis tool that helps you:
- Analyze bundle size and composition
- Identify large dependencies
- Track performance metrics
- Optimize your application bundle

## Local Usage

### Quick Start

Run the Perfsee analysis on your local build:

```bash
npm run analyze:perfsee
```

This will:
1. Build your application using webpack
2. Analyze the bundle with PerfseePlugin
3. Generate a detailed HTML report
4. Automatically open the report in your browser

### What to Expect

- **Bundle Analysis Report**: A comprehensive HTML report showing:
  - Bundle size breakdown
  - Module dependencies
  - Code splitting analysis
  - Performance score
  - Optimization suggestions

- **Console Output**: Bundle audit score and warnings/suggestions

### Configuration

The Perfsee configuration is located in `webpack.perfsee.config.js`. 

Current settings:
- **enableAudit**: `true` - Enables local bundle analysis
- **openBrowser**: `true` - Automatically opens the report
- **shouldPassAudit**: Passes if score >= 70
- **failIfNotPass**: `false` - Won't fail the build (good for local testing)

### Optional: Upload to Perfsee Platform

If you want to upload your bundle analysis to the Perfsee platform:

1. Create an account at [https://perfsee.com/](https://perfsee.com/)
2. Create a project and get your project ID and token
3. Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```
4. Update `.env` with your credentials:
   ```
   PERFSEE_PROJECT=your-project-id
   PERFSEE_TOKEN=your-token-here
   ```
5. Uncomment the `project` and `token` lines in `webpack.perfsee.config.js`:
   ```javascript
   project: process.env.PERFSEE_PROJECT,
   token: process.env.PERFSEE_TOKEN,
   ```

## Files Added

- `webpack.perfsee.config.js` - Webpack configuration with PerfseePlugin
- `.env.example` - Environment variables template
- `PERFSEE.md` - This documentation file

## Troubleshooting

### Build Errors

If you encounter build errors, make sure all dependencies are installed:

```bash
npm install
```

### Report Not Opening

If the report doesn't open automatically, look for the report file at:
```
dist/perfsee-analysis/perfsee-report.html
```

### Memory Issues

For large applications, you might need to increase Node.js memory:

```bash
NODE_OPTIONS="--max-old-space-size=4096" npm run analyze:perfsee
```

## Learn More

- [Perfsee Documentation](https://perfsee.com/docs)
- [Perfsee GitHub](https://github.com/perfsee/perfsee)
- [@perfsee/webpack npm package](https://www.npmjs.com/package/@perfsee/webpack)
