module.exports = function (grunt) {

    var browsers = [
        {
            platform: 'Windows 10',
            browserName: 'firefox',
            version: '44'
        },
        {
            platform: 'Windows 10',
            browserName: 'chrome',
            version: '48'
        },
        {
            platform: 'Windows 10',
            browserName: 'internet explorer',
            version: '11'
        },
        {
            platform: 'Windows 10',
            browserName: 'microsoftedge',
            version: '20'
        },
        {
            platform: 'OS X 10.11',
            browserName: 'safari',
            version: '9'
        }
    ];

    /**
     * Initialize grunt.
     */
    grunt.initConfig({

        /**
         * Read package.json.
         */
        pkg: grunt.file.readJSON('package.json'),


        /**
         * Set banner.
         */
        banner: '// <%= pkg.title %> - <%= pkg.version %> - <%= pkg.homepage %>\n',


        /**
         * JSHint.
         *
         * @github.com/gruntjs/grunt-contrib-jshint
         */
        jshint: {
            files: ['Gruntfile.js', 'src/jquery.unveil2.js'],
            options: {
                globals: {
                    jQuery: true
                }
            }
        },


        /**
         * Minify.
         *
         * @github.com/gruntjs/grunt-contrib-uglify
         */
        uglify: {
            options: {
                banner: '<%= banner %>',
                compress: {
                    drop_console: true
                }
            },
            default: {
                files: {
                    'dist/jquery.unveil2.min.js': ['src/jquery.unveil2.js']
                }
            }
        },


        /**
         * Copy.
         *
         * @github.com/gruntjs/grunt-contrib-copy
         */
        copy: {
            main: {
                src: 'dist/jquery.unveil2.min.js',
                dest: 'docs/jquery.unveil2.min.js'
            }
        },


        /**
         * QUnit
         *
         * @github.com/gruntjs/grunt-contrib-qunit
         */
        qunit: {
            default: {
                options: {
                    page: {
                        viewportSize : {
                            width: 800,
                            height: 800
                        }
                    },
                    console: true,
                    urls: [
                        'http://localhost:8000/test/tests.html'
                    ]
                }
            }
        },


        /**
         * Connect
         *
         * @github.com/gruntjs/grunt-contrib-connect
         */
        connect: {
            live: {
                options: {
                    port: 8000,
                    base: '.'
                }
            },
            test: {
                options: {
                    port: 8000,
                    base: '.',
                    keepalive: true,
                    debug: true
                }
            }
        },


        /**
         * Sauce Labs (QUnit)
         *
         * @github.com/axemclion/grunt-saucelabs
         */
        'saucelabs-qunit': {
            all: {
                options: {
                    urls: [
                        'http://localhost:8000/test/tests.html'
                    ],
                    tunnelTimeout: 5,
                    build: process.env.TRAVIS_JOB_ID,
                    tunnelIdentifier: process.env.TRAVIS_JOB_ID,
                    username: process.env.SAUCE_USERNAME,
                    accessKey: process.env.SAUCE_ACCESS_KEY,
                    startConnect: false,
                    concurrency: 3,
                    testname: "qunit for unveil2",
                    browsers: browsers
                }
            }
        },


        /**
         * Travis Matrix
         *
         * @github.com/tandrewnichols/grunt-travis-matrix
         */
        travisMatrix: {
            v5: {
                test: function () {
                    return (/^v5/).test(process.version);
                },
                tasks: ['saucelabs-qunit']
            }
        }

    });


    /**
     * Test task.
     *
     * run `grunt test`
     */
    grunt.registerTask('test', [
        'jshint',
        'connect:live',
        'qunit',
        'travisMatrix'
    ]);

    /**
     * Sauce task.
     *
     * run `grunt test`
     */
    grunt.registerTask('selenium', [
        'connect:live',
        'saucelabs-qunit'
    ]);

    /**
     * Build task.
     *
     * run `grunt build`
     */
    grunt.registerTask('build', [
        'test',
        'uglify',
        'copy'
    ]);


    /**
     * Load the plugins specified in `package.json`.
     */
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-connect');
    grunt.loadNpmTasks('grunt-contrib-qunit');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-saucelabs');
    grunt.loadNpmTasks('grunt-travis-matrix');
};