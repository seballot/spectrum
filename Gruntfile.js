
module.exports = function(grunt) {

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    qunit: {
      all: ['test/index.html'],
      options: {
        puppeteer: {
          headless: true,
          args: ['--no-sandbox', '--disable-setuid-sandbox']
        }
      }
    },

    jshint: {
      options: {
        sub: true,
        strict: true,
        newcap: false,
        globals: {
          jQuery: true
        }
      },

      with_overrides: {
        options: {
          strict: false
        },
        files: {
          src: ['i18n/*.js', 'test/tests.js']
        }
      },

      all: ['src/spectrum.js']
    },

    concat: {
      js: {
        src: ['src/spectrum.js', 'src/i18n/*.js'],
        dest: 'dist/spectrum.js',
      },
      css: {
        src: ['src/spectrum.css'],
        dest: 'dist/spectrum.css',
      },
      scss: { // Provide scss file as well see https://github.com/seballot/spectrum/issues/5 
        src: ['src/spectrum.css'],
        dest: 'dist/spectrum.scss',
      },
      svg: {
        src: ['src/spectrum.svg'],
        dest: 'dist/spectrum.svg',
      },
    },

    uglify: {
      options: {
      },
      dist: {
        files: {
          'dist/spectrum.min.js': ['dist/spectrum.js']
        }
      }
    },

    cssmin: {
      target: {
        files: [{
          expand: true,
          src: ['dist/spectrum.css'],
          dest: '.',
          ext: '.min.css'
        }]
      }
    },

    svg_sprite: {
      options: {
      },
      dist: {
        expand: true,
        cwd: 'src/icons',
        src: ['*.svg'],
        dest: 'src',
        options: {
          mode: {
            view: {
              dest: "",
              sprite: "spectrum.svg",
              bust: false,
            }
          }
        }
      },
    },

    watch: {
      concat: {
        files: ['src/spectrum.js', 'src/spectrum.css'],
        tasks: ['concat'],
        options: {
            livereload: true
        }
      },
      uglify: {
        files: ['dist/spectrum.js'],
        tasks: ['uglify'],
        options: {
          livereload: true
        }
      },
      html: {
        files: 'index.html',
        options: {
          livereload: true,
        }
      },
      gruntfile: {
        files: ['Gruntfile.js'],
        options: {
            livereload: true
        }
      },
      livereload: {
        options: {
            livereload: true
        },
        files: [
            'index.html',
            'src/*.js'
        ]
      },
      options: {
          livereload: true,
      },
    },

    connect: {
      server: {
        options: {
          livereload: true,
          open: true,
          port: 9001,
          hostname: 'localhost'
        }
      }
    }

  });


  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-qunit');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-connect');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-svg-sprite');

  // Testing tasks
  grunt.registerTask('test', ['jshint', 'qunit']);

  // Travis CI task.
  grunt.registerTask('travis', 'test');

  // Default task.
  grunt.registerTask('default', ['test']);

  //Build Task.
  grunt.registerTask('build', ['jshint', 'concat', 'uglify', 'cssmin']);

  //Build sprite Task.
  grunt.registerTask('build-sprite', ['svg_sprite']);

  // Dev task.
  grunt.registerTask('dev', ['connect', 'watch']);

};
