//----------------------------------------------------------------------------------------------------------------------
// RFI Client Gruntfile.
//----------------------------------------------------------------------------------------------------------------------

module.exports = function(grunt)
{
    // Project configuration.
    grunt.initConfig({
        project: {
            js: ['lib/**/*.js']
        },
        peg: {
            rpgdice: {
                src: "grammar/dice.pegjs",
                dest: "lib/parser.js"
            }
        },
        browserify: {
            dist: {
                files: {
                    'dist/rpgdice.js': ['index.js']
                }
            }
        },
        clean: ["dist", "lib/parser.js"],
        karma: {
            unit: {
                configFile: 'karma-config.js'
            }
        },
        watch: {
            peg: {
                files:['grammar/**/*.pegjs'],
                tasks: ['peg'],
                options: {
                    atBegin: true
                }
            },
            browserify: {
                files: ['index.js', '<%= project.js %>'],
                tasks: ['browserify'],
                options: {
                    atBegin: true
                }
            }
        }
    });

    // Grunt Tasks.
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-peg');
    grunt.loadNpmTasks('grunt-browserify');
    grunt.loadNpmTasks('grunt-karma');
    grunt.loadNpmTasks('grunt-contrib-clean');

    // Setup the build task.
    grunt.registerTask('build', ['clean', 'peg', 'browserify']);
    grunt.registerTask('test', ['build', 'karma:unit']);
    grunt.registerTask('devel', ['clean', 'watch']);
}; // module.exports

// ---------------------------------------------------------------------------------------------------------------------
