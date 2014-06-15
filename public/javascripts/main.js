var main, editor, $status;

main = function () {
    editor = ace.edit("editor");
    editor.setTheme("ace/theme/monokai");
    editor.getSession().setMode("ace/mode/javascript");

    $status = $('#status');

    $status.text('loaded');
}

$(document).ready(function () {
    main();
});
