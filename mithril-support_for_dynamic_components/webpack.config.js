
const path = require('path');

module.exports = {
	target: 'web',
	entry: [
		'./src/main.tsx',
	],
	output: {
		filename: 'bundle.js',
		publicPath: '/dist/',
		path: path.resolve(__dirname, './dist')
	},
	devtool: 'source-map',
	mode: 'development',
	// devtool: "inline-source-map",
	resolve: {
		extensions: ['.js', '.json', '.ts', '.tsx'],
		modules: [
			path.resolve('./src'),
			path.resolve('./node_modules'),
		]
	},
	externals: {
	//	lodash: '_',
	//	mithril: 'm',
	},
	module: {
		rules: [
			{
				test: /\.(jsx|js)$/,
				use:{
					loader: 'babel-loader',
					options: {
						presets: [
							'@babel/preset-env',
						],
						plugins: [
							[
								"@babel/plugin-transform-react-jsx",
								{
									"pragma": "m"
								}
							]
						]
					}
				}
			},
			{
				test: /\.(ts|tsx)$/,
				exclude: /node_modules/,
				loader: 'ts-loader',
				options: {
					transpileOnly: true,
					configFile: "tsconfig.json",
				},
			},
		]
	},
	plugins: [
	]
}
