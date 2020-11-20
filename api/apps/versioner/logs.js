Error: listen EADDRINUSE: address already in use :::8080
    at Server.setupListenHandle [as _listen2] (net.js:1317:16)
    at listenInCluster (net.js:1365:12)
    at Server.listen (net.js:1451:7)
    at /home/grant/qoom/api/api.js:457:7
    at /home/grant/qoom/node_modules/async/dist/async.js:473:16
    at next (/home/grant/qoom/node_modules/async/dist/async.js:5329:29)
    at /home/grant/qoom/node_modules/async/dist/async.js:969:16
    at runFinalization (/home/grant/qoom/api/api.js:428:2)
    at nextTask (/home/grant/qoom/node_modules/async/dist/async.js:5324:14)
    at next (/home/grant/qoom/node_modules/async/dist/async.js:5331:9)
    at /home/grant/qoom/node_modules/async/dist/async.js:969:16
    at addErrorHandling (/home/grant/qoom/api/api.js:436:2)
    at nextTask (/home/grant/qoom/node_modules/async/dist/async.js:5324:14)
    at next (/home/grant/qoom/node_modules/async/dist/async.js:5331:9)
    at /home/grant/qoom/node_modules/async/dist/async.js:969:16
    at runSockets (/home/grant/qoom/api/api.js:415:2)