projectPath = __dirname.substr(__dirname.lastIndexOf("/") + 1)
module.exports = (grunt) ->
  grunt.initConfig
    pkg: grunt.file.readJSON("package.json")
    jshint:
      src: ['./dist/david-json.js']
      options:
        laxcomma: true
        evil: true
        shadow:true
        expr: true
        globals:
          jQuery: true
          console: true
          module: true
          document: true

    coffee:
      client:
        expand: true
        cwd: "./"
        src: ["*.coffee"]
        dest: "./dist/"
        ext: ".js"
    uglify:
      dist:
        files:
          'dist/david-json.min.js' : 'dist/david-json.js'
    jade:
      test:
        files: [
          expand: true
          cwd: "test/"
          src: ["*.jade"]
          dest: "test/"
          ext: ".html"
        ]

  grunt.loadNpmTasks "grunt-contrib-coffee"
  #grunt.loadNpmTasks "grunt-contrib-jshint"
  grunt.loadNpmTasks "grunt-contrib-uglify"
  grunt.loadNpmTasks "grunt-contrib-jade"

  grunt.registerTask "default", [
    "coffee:client",
    #"jshint",
    "uglify:dist",
    "jade:test"
  ]

