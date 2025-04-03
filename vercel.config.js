module.exports = {
  rewrites: [
    { source: '/auth/social-callback', destination: '/index.html' },
    { source: '/(.*)', destination: '/index.html' }
  ],
  trailingSlash: false,
  cleanUrls: true,
}; 