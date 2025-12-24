const { PerfseePlugin } = require('@perfsee/webpack');
const path = require('path');

module.exports = {
  mode: 'production',
  entry: './src/main.ts',
  output: {
    path: path.resolve(__dirname, 'dist/perfsee-analysis'),
    filename: '[name].[contenthash].js',
  },
  resolve: {
    extensions: ['.ts', '.js', '.json'],
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.scss$/,
        use: ['style-loader', 'css-loader', 'sass-loader'],
      },
      {
        test: /\.(png|jpg|jpeg|gif|svg|webp|ico)$/,
        type: 'asset/resource',
      },
    ],
  },
  plugins: [
    new PerfseePlugin({
      // Enable local audit and analysis
      enableAudit: true,
      
      // Automatically open the report in browser
      reportOptions: {
        openBrowser: true,
        fileName: 'perfsee-report.html',
      },
      
      // Optional: Upload to Perfsee platform (requires project ID and token)
      // project: 'your-project-id',
      // token: process.env.PERFSEE_TOKEN,
      
      // Optional: Custom audit logic
      shouldPassAudit: (score) => {
        console.log(`Bundle audit score: ${score}`);
        return score >= 70;
      },
      
      // Don't fail build if audit doesn't pass (good for local testing)
      failIfNotPass: false,
      
      // Artifact name for better identification
      artifactName: 'kamiapp-local',

    // Don't fail the build in local development
      failIfNotPass: false,
      
      // Note: For uploading to Perfsee platform, you would need to set:
      project: 'kamiapp',
      token: 'uej3WJY4QM6Nr3XiQUCD1YufLtxZkT802PXa6a5tA42I=',
    }),
  ],
  optimization: {
    splitChunks: {
      chunks: 'all',
    },
  },
  stats: {
    assets: true,
    modules: true,
    chunks: true,
  },
};
