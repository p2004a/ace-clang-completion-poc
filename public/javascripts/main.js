/*jslint browser: true*/
/*global $, jQuery, ace*/

var main, editor, $status, langTools, clangCompleter;

clangCompleter = {
    getCompletions: function (editor, session, pos, prefix, callback) {
        'use strict';
        console.log("lol");
        callback(null, [
            {caption: "lol", value: "bbbbbbbbb", snippet: "abc(${1:a1}, ${2:a2})", meta: "type"},
            {value: "bbbbbbbbc", meta: "type"},
            {value: "bbbbbbbbd", meta: "type"},
            {value: "bbbbbbbbe", meta: "type"},
            {value: "bbbbbbbbf", meta: "type"},
            {value: "bbbbbbbbg", meta: "type"}
        ]);
    }
};

main = function () {
    'use strict';
    editor = ace.edit("editor");
    editor.setTheme("ace/theme/monokai");
    editor.getSession().setMode("ace/mode/c_cpp");
    editor.setOptions({enableLiveAutocompletion: true});

    langTools = ace.require("ace/ext/language_tools");
    langTools.addCompleter(clangCompleter);

    $status = $('#status');

    $status.text('loaded');
};

$(document).ready(function () {
    main();
});
