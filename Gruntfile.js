'use strict';

module.exports = function (grunt) {
  // Show elapsed time at the end
  require('time-grunt')(grunt);
  // Load all grunt tasks
  require('load-grunt-tasks')(grunt);

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    uglify: {
      options: {
        banner: '/*! <%= pkg.name %> <%= pkg.version %> | Copyright <%= grunt.template.today("yyyy") %> <%= pkg.author.name %> | MIT License */\n'
      },
      build: {
        src: 'dist/<%= pkg.name %>.js',
        dest: 'dist/<%= pkg.name %>.min.js'
      }
    },
    watch: {
      scripts: {
        files: ['lib/<%= pkg.name %>.coffee'],
        tasks: ['copy', 'coffee']
      }
    },
    coffee: {
      compile: {
        files: {
          'dist/<%= pkg.name %>.js': 'lib/<%= pkg.name %>.coffee'
        }
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-coffee');
  grunt.loadNpmTasks('grunt-mocha-test');

  grunt.registerTask('build', ['coffee', 'uglify']);
};
