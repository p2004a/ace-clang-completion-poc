var connectionHandler, completer, jayson, prepareAceCompletions;

jayson = require('jayson');

completer = {
    jsonrpcClient: null,
    init: function (port, hostname) {
        'use strict';
        this.jsonrpcClient = jayson.client.tcp({port: port, hostname: hostname}, {version: 1});
    },
    completeAt: function (file, row, col, callback) {
        'use strict';
        this.jsonrpcClient.request('Clang.CompleteAt', [
            {
                "Location": {
                    "File": {
                        "Name": "tmp.cpp",
                        "Contents": file
                    },
                    "Column": col,
                    "Line": row
                },
                "SessionOverrides": {
                    "compiler_flags": [],
                    "net_paths": [],
                    "net_assemblies": [],
                    "clang_language": "c++"
                }
            }
        ], function (err, response) {
            if (err) {
                callback(err, null);
            } else if (response.error !== undefined && response.error !== null) {
                callback(response.error, null);
            } else {
                callback(null, response.result);
            }
        });
    }
};

prepareAceCompletions = function (response) {
    'use strict';
    var relName, prepareField, preapreMethod, prepareAll, completions;

    relName = function (name) {
        if (name.Relative === undefined) {
            return "";
        }
        return name.Relative;
    };

    prepareField = function (field) {
        var caption, value, snippet, meta, res;

        caption = value = snippet = relName(field.Name);
        meta = relName(field.Type.Name);

        res = {caption: caption, value: value, snippet: snippet, meta: meta};
        return res;
    };

    preapreMethod = function (method) {
        var caption, value, snippet, meta, i, pname, ptype, res;

        value = relName(method.Name);
        caption = value + '(';
        snippet = caption;

        if (method.Parameters !== undefined) {
            for (i = 0; i < method.Parameters.length; i += 1) {
                if (i > 0) {
                    snippet += ", ";
                    caption += ", ";
                }
                pname = relName(method.Parameters[i].Name);
                ptype = relName(method.Parameters[i].Type.Name);
                snippet += "${" + (i + 1) + ":" + ptype + " " + pname + "}";
                caption += ptype + " " + pname;
            }
        }

        snippet += ')';
        caption += ')';

        if (method.Returns !== undefined) {
            meta = relName(method.Returns[0].Type.Name);
        }

        res = {caption: caption, value: value, snippet: snippet, meta: meta};
        return res;
    };

    completions = [];

    prepareAll = function (fieldName, func) {
        if (response[fieldName] !== undefined) {
            response[fieldName].forEach(function (elem) {
                completions.push(func(elem));
            });
        }
    };

    prepareAll("Methods", preapreMethod);
    prepareAll("Fields", prepareField);

    return completions;
};

connectionHandler = function (socket) {
    'use strict';
    socket.on('ping', function (data, fn) {
        fn(data);
    });

    socket.on('completeAt', function (data, fn) {
        completer.completeAt(data.file, data.row, data.col, function (err, response) {
            if (err) {
                fn(err, []);
            } else {
                var completions = prepareAceCompletions(response);
                fn(null, completions);
            }
        });
    });
};

module.exports = function (namespace, port, hostname, io) {
    'use strict';
    completer.init(port, hostname);
    io.of(namespace).on('connection', connectionHandler);
};
