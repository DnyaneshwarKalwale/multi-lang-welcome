module.exports = {
  apps: [
    {
      name: 'frontend',
      script: 'npm',
      args: 'run preview',
      env: {
        NODE_ENV: 'production',
        PORT: 8080,
        VITE_API_URL: 'https://api.brandout.ai'
      },
      instances: 1,
      exec_mode: 'fork',
      watch: false,
      max_memory_restart: '1G'
    }
  ]
}; 