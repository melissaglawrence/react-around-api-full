module.exports = {
  apps: [
    {
      name: 'app',
      script: './app.js',
      cwd: './app.js',
      exec_mode: 'fork_mode',
      node_args: '-r dotenv/config',
    },
  ],
};
