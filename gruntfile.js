module.exports = function(grunt) {
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        less: { 
            development: {
                files: {
                    'dev/styles/main.css': 'src/styles/main.less' 
                }
            },
            production: { 
                options: {
                    compress: true,
                },
                files : {
                    'dist/styles/main.min.css': 'src/styles/main.less' 
                }
            }
        },
        watch: { /*Configurando watcher*/
            less: {
                files: ['src/styles/**/*.less'], /*Dizendo onde observar(todas as pastas em styles e dentro delas todos os arquivos .less)*/
                tasks: ['less:development'] /*Qual ação o watcher vai ter quando ativar*/
            },
            html: {
                files: ['src/index.html'],
                tasks: ['replace:dev']
            }
        },
        replace: { /*Configurando para injetar valores no html*/
            dev: {
                options: {
                    patterns: [
                        {
                            match: 'ENDERECO_DO_CSS', /*No arquivo original, colocar @@antes do local de substituição*/
                            replacement: './styles/main.css'
                        },
                        {
                            match: 'ENDERECO_DO_JS', /*No arquivo original, colocar @@antes do local de substituição*/
                            replacement: '../src/scripts/main.js'
                        }
                    ]
                },
                files: [
                    {
                        expand: true,
                        flatten: true,
                        src: ['src/index.html'], /*Fonte*/
                        dest: 'dev/'  /*Destino*/
                    }
                ]
            },
            dist: {
                options: {
                    patterns: [
                        {
                            match: 'ENDERECO_DO_CSS',
                            replacement: './styles/main.min.css'
                        },
                        {
                            match: 'ENDERECO_DO_JS', /*No arquivo original, colocar @@antes do local de substituição*/
                            replacement: './scripts/main.min.js'
                        }
                    ]
                },
                files: [
                    {
                        expand: true,
                        flatten: true,
                        src: ['prebuild/index.html'],
                        dest: 'dist/'
                    }
                ]
            }
        },
        htmlmin: {
            dist: {
                options: {
                    removeComments: true,
                    collapseWhiteSpace: true
                },
                files: {
                    'prebuild/index.html': 'src/index.html'
                }
            }
        },
        clean: ['prebuild'],
        uglify: {
            target: {
                files: {
                    'dist/scripts/main.min.js': /*Arquivo destino*/ 'src/scripts/main.js'
                }
            }
        }
    })

    grunt.loadNpmTasks('grunt-contrib-less'); 
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-replace');
    grunt.loadNpmTasks('grunt-contrib-htmlmin');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-uglify');

    grunt.registerTask('default', ['watch']); /*Configurando para area de desenvolvimento rodar só aqui*/
    grunt.registerTask('build', ['less:production', 'htmlmin:dist', 'replace:dist', 'clean', 'uglify']); /*Configurando para build rodar só na produção(area do cliente)*/
}