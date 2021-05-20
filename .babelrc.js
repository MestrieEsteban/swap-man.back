module.exports = (api) => {
	api.cache(true);
  
	const presets = ['@babel/env', '@babel/typescript'];
	const plugins = [];
  
	return {
	  presets,
	  plugins,
	};
  };
  