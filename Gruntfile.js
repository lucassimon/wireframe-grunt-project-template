/*global module:false*/
module.exports = function(grunt) {

    // Project configuration.
    grunt.initConfig({
        // Metadata.
        pkg: grunt.file.readJSON('package.json'),
        banner: '/*! <%= pkg.title || pkg.name %> - v<%= pkg.version %> - ' +
            '<%= grunt.template.today("yyyy-mm-dd") %>\n' +
            '<%= pkg.homepage ? "* " + pkg.homepage + "\\n" : "" %>' +
            '* Copyright (c) <%= grunt.template.today("yyyy") %> <%= pkg.author.name %>;' +
            ' Licensed <%= _.pluck(pkg.licenses, "type").join(", ") %> */\n',
        // Task configuration.
        connect: {
            server: {
                options: {
                    port: 9001,
                    hostname: '*',
                    open:true,
                }
            }
        },
        concat: {
            options: {
                banner: '<%= banner %>',
                stripBanners: true
            },
            dist: {
                src: [
                    'src/js/**/*.js'
                ],
                dest: 'src/js/<%= pkg.name %>.js'
            }
        },
        uglify: {
            options: {
                banner: '<%= banner %>'
            },
            dist: {
                src: '<%= concat.dist.dest %>',
                dest: 'assets/js/<%= pkg.name %>.min.js'
            }
        },
        jshint: {
            options: {
                jshintrc: true,
            },
            gruntfile: {
                src: 'Gruntfile.js'
            },
            jsfiles: {
                src: [
                    'src/js/*.js'
                ]
            }
        },
        less: {
            production: {
                options: {
                    paths: ["src/css"],
                    yuicompress: true
                },
                files: {
                    "src/css/main.css": "src/css/main.less"
                }
            }
        },
        cssmin: {
            css: {
                options: {
                    banner: '<%= banner %>',
                },
                src: [
                    'src/css/**/*.css',
                    '!assets/css/**/*.min.css'
                ],
                dest: 'assets/css/<%= pkg.name %>.min.css'
            }
        },
        watch: {
            gruntfile: {
                files: '<%= jshint.gruntfile.src %>',
                tasks: ['jshint:gruntfile']
            },
            less: {
                files: ['src/css/*.less'],
                tasks: ['less', 'cssmin'],
            },
            js: {
                files: ['src/js/*.js'],
                tasks: ['minjs']
            },
            html: {
                files: '{,*/}*.html',
            }
        },
        imagemin: {
            dynamic: {
                files: [{
                    expand: true,
                    cwd: 'src',
                    src: ['**/*.{png,jpg,gif,svg}'],
                    dest: 'assets/'
                }]
            }
        }
    });

    // These plugins provide necessary tasks.
    grunt.loadNpmTasks('grunt-contrib-connect');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-less');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-contrib-imagemin');

    // Default task.
    grunt.registerTask('default', ['less', 'jshint', 'concat', 'uglify', 'imagemin']);
    grunt.registerTask('minjs', ['jshint', 'concat', 'uglify']);
    /**
     * Tarefas de desenvolvimento
     */
    grunt.registerTask('run-dev', ['connect', 'watch']);

};
