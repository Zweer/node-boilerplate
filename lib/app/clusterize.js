module.exports = function clusterize () {
  var cluster = require('cluster')
    , config  = require('config');

  var isMaster = cluster.isMaster && config.app.clustered;

  if (isMaster && !isDevelopment) {
    var os = require('os');

    var cpus     = os.cpus().length
      , timeouts = []
      , timeout  = 2000;

    for (var i = 0; i < cpus; ++i) {
      cluster.fork();
    }

    cluster.on('fork', function onClusterFork (worker) {
      logger.debug('Forking worker #' + worker.id);
      timeouts[worker.id] = setTimeout(function workerTimeout () {
        logger.error('Worker taking too long to start');
      }, timeout);
    });

    cluster.on('listening', function onClusterListening (worker, address) {
      logger.info('Worker #' + worker.id + ' listening on port: ' + address.port);
      clearTimeout(timeouts[worker.id]);
    });

    cluster.on('online', function onClusterOnline (worker) {
      logger.debug('Worker # ' + worker.id + ' is online');
    });

    cluster.on('exit', function onClusterExit (worker, code, signal) {
      logger.error('Worker #' + worker.id + ' has exited with exitCode ' + worker.process.exitCode);
      clearTimeout(timeouts[worker.id]);

      if (worker.suicide !== true) {
        logger.warning('Worker #' + worker.id + ' did not commit suicide, restarting');
        cluster.fork();
      }
    });

    cluster.on('disconnect', function onClusterDisconnect (worker) {
      logger.warning('Worker #' + worker.id + ' has disconnected');
    });

    ['SIGINT', 'SIGTERM', 'SIGQUIT'].forEach(function forEachQuiSignal (signal) {
      process.on(signal, function onQuitSignals () {
        cluster.workers.forEach(function destroyWorker (worker) {
          worker.destroy();
        });
      });
    });
  } else {
    app.listen(config.app.port);
    logger.info('Listening on port: ' + config.app.port);
  }
};