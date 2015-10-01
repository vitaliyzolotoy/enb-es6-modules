var vowFs = require('vow-fs'),
    Vow = require('vow'),
    Concat = require('concat-with-sourcemaps'),
    fs = require('fs'),
    path = require('path');

module.exports = require('enb/lib/build-flow').create()
    .name('prepend-es6-modules')
    .target('target', '?.js')
    .defineRequiredOption('source')
    .useSourceFilename('source', '?')
    .needRebuild(function(cache) {
        return cache.needRebuildFile(
            'es6-modules-file',
            this._modulesFile = require.resolve('es6-micro-loader/dist/system-polyfill.js'));
    })
    .saveCache(function(cache) {
        cache.cacheFileInfo('es6-modules-file', this._modulesFile);
    })
    .builder(function(preTargetSourceFileName) {
        var concat = new Concat(true, 'all.js', '\n');
        var target = this.node.resolvePath(this._target);

        return Vow.all([
            vowFs.read(this._modulesFile, 'utf8'),
            vowFs.read(preTargetSourceFileName, 'utf8'),
            vowFs.exists(preTargetSourceFileName + '.map').then(function(exists) {
                if(exists) {
                    return vowFs.read(preTargetSourceFileName + '.map', 'utf8');
                } else {
                    return Vow.resolve(null);
                }
            })
        ]).then(function(modulesRes) {
            // concat.add("modules.js", modulesRes[0]);
            // concat.add("modules.1.js",
            //     "if(typeof module !== 'undefined') {" +
            //     "modules = module.exports;" +
            //     "}\n");
            // concat.add(preTargetSourceFileName, modulesRes[1], modulesRes[2]);
            // fs.writeFileSync(target + '.map', concat.sourceMap);
            concat.add("modules.js", modulesRes[0]);
            concat.add(preTargetSourceFileName, modulesRes[1]);
            return concat.content;
        }, function () {
            throw new Error('Module system was not found. Please install `ym` npm module: npm install ym');
        });
    })
    .createTech();
