module.exports = function (grunt) {
    const sass = require("sass");

    grunt.initConfig({
        pkg: grunt.file.readJSON("package.json"),
        concat: {
            options: {
                separator: "\n"
            },
            dist: {
                src: ["app/js/*.js"],
                dest: "dist/script.js",
            }
        },
        jshint: {
            files: ["Gruntfile.js", "app/js/*.js"],
            options: {
                esversion: 9,
                browser: true,
                globals: {
                    escape: false
                }
            }
        },
        babel: {
            options: {
                presets: [
                    ["@babel/preset-env", {"targets": "> 0%"}]
                ],
            },
            dist: {
                files: {
                    "dist/script.js": "dist/script.js"
                }
            }
        },
        sass: {
            options: {
                implementation: sass,
                noSourceMap: true
            },
            dist: {
                files: {
                    "dist/style.css": "app/css/style.scss"
                }
            }
        },
        clean: {
            dist: ["dist"],
            inlined: ["dist/script.js", "dist/style.css"]
        },
        inline: {
            dist: {
                options: {
                    tag: "",
                },
                src: "dist/index.html",
                dest: "dist/index.html"
            }
        },
        copy: {
            html: {
                files: [
                    {src: ['app/index.html'], dest: 'dist/index.html'},
                ],
            },
        },
    });

    grunt.loadNpmTasks("grunt-contrib-jshint");
    grunt.loadNpmTasks("grunt-contrib-concat");
    grunt.loadNpmTasks("grunt-babel");
    grunt.loadNpmTasks("grunt-contrib-sass");
    grunt.loadNpmTasks("grunt-contrib-clean");
    grunt.loadNpmTasks('grunt-inline');
    grunt.loadNpmTasks('grunt-contrib-copy');

    grunt.registerTask("default", ["jshint", "clean:dist", "concat", "babel", "sass", "copy:html", "inline", "clean:inlined"]);
    grunt.registerTask("debug", ["jshint", "clean:dist", "concat", "sass", "copy:html", "inline"]);
};
