/*
 After you have changed the settings at "Your code goes here",
 run this with one of these options:
  "grunt" alone creates a new, completed images directory
  "grunt clean" removes the images directory
  "grunt responsive_images" re-processes images without removing the old ones
*/

module.exports = function(grunt) {

  grunt.initConfig({
    cssmin: {
      target: {
        files: [{
          expand: true,
          cwd: 'css/',
          src: ['*.css', '!*.min.css'],
          dest: 'css-min/',
          ext: '.min.css'
        }]
      }
    },
    uglify: {
      my_target: {
        files: [{
          expand: true,
          cwd: 'js/',
          src: '*.js',
          dest: 'js-min/',
          ext: '.min.js'
        }]
      }

    },
        /* Clear out the images directory if it exists */
    clean: {
      dev: {
        src: ['css-min','js-min'],
      },
    },


    /* Generate the images directory if it is missing */
    mkdir: {
      dev: {
        options: {
          create: ['css-min','js-min']
        },
      }
    },
  });
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-mkdir');
  grunt.registerTask('default', ['mkdir','cssmin', 'uglify']);

};
