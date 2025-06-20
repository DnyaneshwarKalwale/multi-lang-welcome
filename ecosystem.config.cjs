module.exports = {
  apps: [
    {
      name: 'frontend',
      script: 'npm',
      args: 'run preview -- --port 4173',
      env: {
        NODE_ENV: 'production',
        PORT: 4173,
        VITE_API_URL: 'https://api.brandout.ai'
      },
      instances: 1,
      exec_mode: 'fork',
      watch: false,
      max_memory_restart: '1G'
    }
  ]
}; 