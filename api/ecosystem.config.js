module.exports = {
  apps : [
      {
        name: "api",
        script: "./app.js",
        exec_mode: "cluster",
        watch: true,
        increment_var : 'PORT',
        env: {
            "PORT": 3376,
            "NODE_ENV": "development"
        }
      }
  ]
}
