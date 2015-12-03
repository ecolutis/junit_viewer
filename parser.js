var fs = require('fs')
var parser = require('xml2js').Parser()

function extractFullName(name, map) {
    name = name
        .replace(/-/g, '_')
        .replace(/ /g, '_')

    var fileSplit = name.split('/')
    if (name.charAt(name.length - 1) === '/')
        name = fileSplit[fileSplit.length - 2]
    else
        name = fileSplit[fileSplit.length - 1]
    var capsMatch = name.match(/[A-Z][a-z]+/g)
    name = capsMatch !== null ? capsMatch.join('_') : name
    fileSplit = name.split('.')
    if (fileSplit.length > 1)
        name = fileSplit
        .slice(0, fileSplit.length - 1)
        .join('_')
    else if (fileSplit.length === 1)
        name = fileSplit[0]

    var words = name.split('_')
    return map(words)
}

function capitaliseAllWords(words) {
    return words.map(capitalise).join(' ')
}

function capitaliseFirstWord(words) {
    words = words.map(function(word) {
        return word.toLowerCase()
    })
    return [capitalise(words[0])].concat(words.slice(1)).join(' ')
}

function capitalise(word) {
    return word.charAt(0).toUpperCase() + word.slice(1)
}

function isDirectory(folder) {
    return fs.lstatSync(folder).isDirectory();
}

function normaliseFileName(fileName) {
    if (fileName.charAt(0) === '.')
        fileName = __dirname + '/' + fileName

    if (!fs.existsSync(fileName)) {
        console.log(fileName, 'does not exist')
        process.exit()
    }

    if (isDirectory(fileName) && fileName.charAt(fileName.length - 1) !== '/')
        fileName = fileName + '/'

    return fileName
}

function isXml(fileName) {
    var fileSplit = fileName.split('.')
    return fileSplit[fileSplit.length - 1] === 'xml'
}

function parseTestResult(fileName, suites) {
    if (!isXml(fileName))
        return

    var data = fs.readFileSync(fileName).toString()
    parser.parseString(data, function(err, result) {
        result.testsuite.testcase.forEach(function(test) {
            var type = 'passed',
                suite = extractFullName(test.$.classname, capitaliseAllWords) || 'No Class Name',
                message

            suites[suite] = suites[suite] || []

            if (test.hasOwnProperty('skipped'))
                type = 'skipped'
            else if (test.hasOwnProperty('error')) {
                type = 'error'
                message = test.error[0]._
            } else if (test.hasOwnProperty('failure')) {
                type = 'failure'
                message = test.failure[0]._
            }

            suites[suite].push({
                name: extractFullName(test.$.name, capitaliseFirstWord),
                type: type,
                message: message,
                time: test.time
            })
        })
    })
}

function runThroughFolder(folder, suites) {
    fs.readdirSync(folder).forEach(function(file) {
        var fileName = normaliseFileName(folder + file)
        if (isDirectory(fileName)) {
            runThroughFolder(fileName, suites)
        } else {
            parseTestResult(fileName, suites)
        }
    })
}

function parse(fileName) {
    fileName = normaliseFileName(fileName)

    var suites = {}
    if (isDirectory(fileName))
        runThroughFolder(fileName, suites)
    else
        parseTestResult(fileName, suites)

    return {
        title: extractFullName(fileName, capitaliseAllWords),
        suites: suites
    }
}

module.exports = {
    parse: parse
}
