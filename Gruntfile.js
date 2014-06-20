/**
 * Created by jcabresos on 4/26/2014.
 */
var path = require('path');
var coveralls = require('coveralls');

module.exports = function(grunt) {

    var COVERAGE_DIR = 'codecoverage';
    var TEST_DUMMY_DIR = 'test_dummy';
    var RELEASE_DIR = 'bin-release';

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        clean: {
            main: [COVERAGE_DIR, TEST_DUMMY_DIR],
            release: [RELEASE_DIR]
        },
        copy: {
            test: {
                files: [
                    {expand: true, cwd:"test/dummy", src:['**'], dest: path.join(TEST_DUMMY_DIR, "strip")},
                    {expand: true, cwd:"test/dummy", src:['**'], dest: path.join(TEST_DUMMY_DIR, "resolve")},
                    {expand: true, cwd:"test/dummy", src:['**'], dest: path.join(TEST_DUMMY_DIR, "retain")}
                ]
            },
            release: {
                files: [
                    {expand: true, src:['src/**/*.js', 'src/**/*.json', 'domercli.js', 'package.json', 'LICENSE', 'README.md'], dest: RELEASE_DIR}
                ]
            }
        },
        tsd: {
            main: {
                options: {
                    // execute a command
                    command: 'reinstall',
                    //optional: always get from HEAD
                    latest: true,
                    // specify config file
                    config: 'tsd.json'
                }
            }
        },
        ts: {
            // use to override the default options, See: http://gruntjs.com/configuring-tasks#options
            // these are the default options to the typescript compiler for grunt-ts:
            // see `tsc --help` for a list of supported options.
            options: {
                compile: true,                 // perform compilation. [true (default) | false]
                comments: false,               // same as !removeComments. [true | false (default)]
                target: 'es3',                 // target javascript language. [es3 (default) | es5]
                module: 'commonjs',                 // target javascript module style. [amd (default) | commonjs]
                sourceMap: true,               // generate a source map for every output js file. [true (default) | false]
                declaration: false            // generate a declaration .d.ts file for every output js file. [true | false (default)]
            },
            build: {
                src: ["src/**/*.ts","test/**/*.ts"]
            }
        },
        mocha_istanbul: {
            local: {
                src: 'test',
                options: {
                    recursive: true, //include subdirectories
                    coverage:false,
                    root: 'src', // define where the cover task should consider the root of libraries that are covered by tests
                    coverageFolder: COVERAGE_DIR,
                    reportFormats: ['html']
                }
            },
            coveralls: {
                src: 'test',
                options: {
                    recursive: true, //include subdirectories
                    coverage:true,
                    root: 'src', // define where the cover task should consider the root of libraries that are covered by tests
                    coverageFolder: COVERAGE_DIR,
                    reportFormats: ['cobertura','lcovonly']
                }
            }
        }
    });

    grunt.event.on('coverage', function(lcov, done) {
        coveralls.handleInput(lcov, function(err) {
            if(err) {
                return done(err);
            }
        });
    });

    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-mocha-istanbul');
    grunt.loadNpmTasks('grunt-tsd');
    grunt.loadNpmTasks('grunt-ts');

    grunt.registerTask('configure', ['tsd'])
    grunt.registerTask('build', ['ts:build']);
    grunt.registerTask('release', ['clean:release', 'copy:release']);
    grunt.registerTask('test-local', ['clean', 'copy:test','mocha_istanbul:local']);
    grunt.registerTask('test-cover', ['clean', 'copy:test','mocha_istanbul:coveralls']);

}