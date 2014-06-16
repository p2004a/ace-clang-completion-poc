/*jslint browser: true*/
/*global $, jQuery, ace, io*/

var main, clangCompleter;

clangCompleter = {
    socket: null,
    currContext: null,
    currCompletions: [],
    currId: 0,
    setSocket: function (socket) {
        'use strict';
        this.socket = socket;
    },
    getCompletions: function (editor, session, pos, prefix, callback) {
        'use strict';
        var row, col, file, id, context, self, time;
        self = this;

        if (!self.socket) {
            return;
        }

        row = pos.row + 1;
        col = pos.column - prefix.length + 1;

        context = row + ":" + col;
        if (self.currContext === context) {
            callback(null, self.currCompletions);
            return;
        }

        self.currContext = context;
        self.currCompletions = [];
        self.currId += 1;
        id = self.currId;
        file = editor.getValue();

        time = new Date().getTime();
        self.socket.emit('completeAt', {file: file, row: row, col: col}, function (err, completions) {
            if (err) {
                console.error(err);
            } else if (id === self.currId) {
                var timediff = new Date().getTime() - time;
                console.info('completion duration: ' + timediff + 'ms');
                self.currCompletions = completions;
                callback(null, completions);
            }
        });
    }
};

main = function () {
    'use strict';
    var socket, editor, langTools;

    editor = ace.edit("editor");
    editor.setTheme("ace/theme/monokai");
    editor.getSession().setMode("ace/mode/c_cpp");
    editor.setOptions({enableLiveAutocompletion: true});

    $.ajax('resources/template.cpp')
        .done(function (data) {
            editor.setValue(data, -1);
        });

    langTools = ace.require("ace/ext/language_tools");
    langTools.addCompleter(clangCompleter);

    socket = io.connect('/completion');

    clangCompleter.setSocket(socket);

    window.ping = function () {
        var time = new Date().getTime();
        socket.emit('ping', 'pong', function (data) {
            console.log(data, new Date().getTime() - time + "ms");
        });
    };
};

$(document).ready(function () {
    'use strict';
    main();
});
