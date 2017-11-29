const fs = require('fs');//引用文件系统模块
const path = require('path');

function i18nKeys(dir) {
    let i18nKeys = [];
    //this.toastService.translate('error', '请输入推送用户');
    let regex1 = /translate\(\s*['"]\w+['"]\s*,\s*['"]([\d\w\u4e00-\u9fa5]+)['"]\s*\)/g;
    //this.toastService.translate('error', '这个是标题', '这个是正文');
    let regex2 = /translate\(\s*['"]\w+['"]\s*,\s*['"]([\d\w\u4e00-\u9fa5]+)['"],\s*['"]([\d\w\u4e00-\u9fa5]+)['"]\s*\)/g;

    function getMatches(string = '', regex = /\w/, groups = [1]) {
        var matches = [];
        var match;
        while (match = regex.exec(string)) {
            groups.forEach(index => matches.push(match[index]));
        }
        return matches;
    }

    function readFileList(dir) {
        var files = fs.readdirSync(dir);
        files.forEach(function (filename, index) {
            var stat = fs.statSync(path.join(dir , filename));
            if (stat.isDirectory()) {
                readFileList(path.join(dir ,filename , "/"));//递归读取文件
            } else {
                //dir: 路径 ;filename: 名字
                if (filename.endsWith('.ts')) {
                    let data = fs.readFileSync(path.join(dir , filename), 'utf-8');
                    let keys1 = getMatches(data, regex1, [1]);
                    let keys2 = getMatches(data, regex2, [1, 2]);
                    i18nKeys.push(...keys1, ...keys2);
                }
            }
        });
        return i18nKeys;
    }

    return readFileList(dir);
}

function readJsonFile(path) {
    let data = fs.readFileSync(path, 'utf-8');
    return Object.keys(JSON.parse(data));
}

function output2File() {
    let ts_keys = i18nKeys(path.join(__dirname,'../src/app'));
    ts_keys.sort(); //排序

    let ts_json = {};
    ts_keys.forEach((key, value) => {
        ts_json[key] = key;
    });

    fs.writeFileSync(path.join(__dirname,'../src/assets/i18n/ts-output.json'), JSON.stringify(ts_json));
  console.log('ts-output.json');
    /* ========================================================= */

    let html_keys = readJsonFile(path.join(__dirname,'../src/assets/i18n/zh_CN.json'));
    let html_ts_keys = [...ts_keys, ...html_keys]; //合并所有key
    html_ts_keys.sort(); //排序
    let html_ts_json = {};
    html_ts_keys.forEach((key, value) => {
        html_ts_json[key] = key;
    });
    console.log('html-ts-output.json');
    fs.writeFileSync(path.join(__dirname,'../src/assets/i18n/zh_CN.json'), JSON.stringify(html_ts_json));
}


output2File();

