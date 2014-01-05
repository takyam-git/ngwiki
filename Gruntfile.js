/*global module:false*/
module.exports = function (grunt) {

  // Project configuration.
  grunt.initConfig({
    // Metadata.
    pkg: grunt.file.readJSON('package.json'),
    banner: '/*! <%= pkg.title || pkg.name %> - v<%= pkg.version %> - ' +
      '<%= grunt.template.today("yyyy-mm-dd") %>\n' +
      '* Copyright (c) <%= grunt.template.today("yyyy") %> <%= pkg.author %>;' +
      ' Licensed <%= pkg.license %> */\n',
    // Task configuration.
    concat: {
      options: {
        banner: '<%= banner %>',
        stripBanners: true
      },
      dist: {
        src: [
          'client/js/lib/jquery-2.0.3.min.js',
          'client/js/lib/underscore-min.js',
          'client/js/lib/bootstrap.min.js',
          'client/js/lib/summernote.min.js',
          'client/js/lib/summernote-ja-JP.js',
          'client/js/lib/backbone-min.js',
          'client/js/app/**/*.js'
        ],
        dest: 'public/assets/js/<%= pkg.name %>.js'
      }
    },
    concat_css: {
      options: {
        rebaseUrls: false
      },
      all: {
        src: [
          'client/css/lib/bootstrap.min.css',
          'client/css/lib/bootstrap-theme.min.css',
          'client/css/lib/font-awesome.min.css',
          'client/css/lib/summernote.css',
          'client/css/app/**/*.css'
        ],
        dest: "public/assets/css/<%= pkg.name %>.css"
      }
    },
    uglify: {
      options: {
        banner: '<%= banner %>',
        wrap: 'App'
      },
      dist: {
        src: '<%= concat.dist.dest %>',
        dest: 'public/assets/js/<%= pkg.name %>.min.js'
      }
    },
    watch: {
      concat: {
        files: '<%= concat.dist.src %>',
        tasks: ['concat']
      },
      concat_css: {
        files: '<%= concat_css.all.src %>',
        tasks: ['concat_css']
      },
      scripts: {
        files: [
          '<%= pkg.main %>',
          'server/**/*.js',
          'server/**/*.html'
        ],
        tasks: ['develop'],
        options: { nospawn: true }
      }
    },
    develop: {
      server: {
        file: '<%= pkg.main %>',
        nodeArgs: ['--harmony', '--debug'],
        env: {
          NODE_ENV: 'development'
        }
      }
    }
  });

  // These plugins provide necessary tasks.
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-concat-css');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-develop');

  // Default task.
  grunt.registerTask('default', ['concat', 'concat_css', 'develop', 'watch']);

  grunt.registerTask('deploy', ['concat', 'uglify', 'concat_css']);
};
