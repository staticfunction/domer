/**
 * Created by jcabresos on 4/26/2014.
 */
var path = require('path');

module.exports = function(grunt) {

    var COVERAGE_DIR = 'codecoverage';
    var TEST_DUMMY_DIR = 'test_dummy';

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        clean: {
            main: [COVERAGE_DIR, TEST_DUMMY_DIR]
        },
        copy: {
            main: {
                files: [
                    {expand: true, cwd:"test/dummy", src:['**'], dest: path.join(TEST_DUMMY_DIR, "strip")},
                    {expand: true, cwd:"test/dummy", src:['**'], dest: path.join(TEST_DUMMY_DIR, "resolve")},
                    {expand: true, cwd:"test/dummy", src:['**'], dest: path.join(TEST_DUMMY_DIR, "retain")}
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
            dev: {
                src: ["src/**/*.ts","test/**/*.ts"]
            },
            // a particular target
            build: {
                src: ["src/**/*.ts"],          // The source typescript files, http://gruntjs.com/configuring-tasks#files
                // use to override the grunt-ts project options above for this target
                options: {
                    module: 'commonjs',
                    sourceMap: false
                }
            }
        },
        mocha_istanbul: {
            options: {
                recursive: true //include subdirectories
            },
            coverage: {
                src: 'test' // the folder, not the files,
            },
            coveralls: {
                src: 'test', // the folder, not the files
                options: {
                    coverage:true,
                    root: 'src', // define where the cover task should consider the root of libraries that are covered by tests
                    reportFormats: ['cobertura','lcovonly','html'],
                    coverageFolder: COVERAGE_DIR
                }
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-mocha-istanbul');
    grunt.loadNpmTasks('grunt-tsd');
    grunt.loadNpmTasks('grunt-ts');

    grunt.registerTask('coveralls', ['mocha_istanbul:coveralls']);
    grunt.registerTask('coverage', ['mocha_istanbul:coverage']);

    grunt.registerTask('build', ['clean', 'tsd','ts:build']);
    grunt.registerTask('test', ['clean', 'copy', 'ts:dev', 'coveralls']);
}