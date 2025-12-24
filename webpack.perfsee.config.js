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
      // Upload to Perfsee platform
      project: 'kamiapp',
      token: process.env.PERFSEE_TOKEN || 'uej3WJY4QM6Nr3XiQUCD1YufLtxZkT802PXa6a5tA42I=',
      
      // Artifact name for better identification
      artifactName: 'kamiapp-bundle',
      
      // Don't fail the build if upload or audit fails
      failIfNotPass: false,
      
      // Enable bundle audit
      enableAudit: true,
      
      // Optional: Custom audit logic
      shouldPassAudit: (score) => {
        console.log(`Bundle audit score: ${score}`);
        return score >= 70;
      },
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
