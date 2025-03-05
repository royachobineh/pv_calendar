module.exports = {
  async redirects() {
    return [
      {
        source: '/confirmation',
        destination: '/confirmation.html',
        permanent: true,
      },
    ]
  },
} 