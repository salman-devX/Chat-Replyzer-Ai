module.exports = {
  apps: [
    {
      name: 'chat-replyzer-api',
      cwd: './server',
      script: 'src/server.js',
      instances: 1, // Single instance per node process to prevent Baileys socket conflicts
      autorestart: true,
      watch: false,
      max_memory_restart: '1G',
      env_production: {
        NODE_ENV: 'production',
        PORT: 5000,
      },
    },
  ],
};
