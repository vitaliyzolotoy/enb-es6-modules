var path = require('path');

var transpiler = require('es6-module-transpiler');
var SystemFormatter = require('es6-module-transpiler-system-formatter');
var Container = transpiler.Container;
var FileResolver = transpiler.FileResolver;

module.exports = require('enb/lib/build-flow').create()
    .name('es6-modules')
    .target('target', '?.target')
    .defineOption('divider', '\n')
    .defineRequiredOption('target')
    .useFileList(['module.js'])
    .builder(function (sources) {
        var divider = this._divider;

        var resolvers = [];

        sources.map(function (source) {
            var resolver = path.relative(process.cwd(), source.fullname).replace(source.name, '');

            resolvers.push(resolver);
        });

        if (resolvers.length > 0) {
            var container = new Container({
                resolvers: [new FileResolver(resolvers)],
                formatter: new SystemFormatter()
            });

            var formatters = [];

            sources.map(function (source) {
                container.getModule(source.name);
            });

            container.transform().map(function (formatter) {
                formatters.push(formatter.code);
            });

            return formatters.join(divider);
        };
    })
    .createTech();
