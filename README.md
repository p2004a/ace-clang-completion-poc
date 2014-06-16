ace-clang-completion-poc
========================

Proof of concept of Clang completion through WebSockets in Ace editor.

Completions are generated using [quarnster/completion]. The site is hosted using Node.js witch Express. Completion request are passed from server to client using [socket.io]. The most interesting code is in files `public/javascripts/main.js` and `completion.js`, the rest of code is rather a boilerplate. [quarnster/completion] is WIP so the performance of completion requests is rather low (it just calls clang binary instead of use libclang and cache files etc).

[quarnster/completion]:https://github.com/quarnster/completion
[socket.io]:http://socket.io/
