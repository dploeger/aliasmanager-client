const plugins = [];
if (process.env.NODE_ENV === 'development') {
  plugins.push('istanbul');
}

module.exports = {
  presets: ['@vue/cli-plugin-babel/preset'],
  plugins: plugins,
};
