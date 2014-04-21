module.exports = function (server, app) {
  var $ = require;

  var validate = $('../util/validate');

  var io = $('socket.io').listen(server);

  var pkg;

  var _pkg = $('path').join($('path').dirname($('path').dirname(__dirname)), 'package.json');

  var fsocket;

  function readPackage (cb) {
    $('fs').readFile(_pkg,
      { encoding: 'utf-8' },
      function (error, data) {
        if ( error ) {
          return;
        }
        try {
          pkg = JSON.parse(data); 
        }
        catch ( error ) {
          return;
        }
        if ( typeof cb === 'function' ) {
          cb();
        }
      });
  }

  readPackage();

  $('fs').watch(_pkg,
    function (event, filename) {
      readPackage(function () {
        fsocket().emit('version changed', pkg.version);
      });
    });

  io.sockets.on('connection', function (socket) {

    fsocket = function () {
      return socket;
    }

    socket.on('insert', function (collection, insert, callback) {
      try {
        validate([
          [ insert,   Object    ],
          [ callback, Function  ]
        ]);

        $('../mongo/insert')(
          app.locals.getConn(),
          collection,
          insert,
          callback
        );
      }

      catch ( error ) {
        callback(error);
      }
    });

    socket.on('find', function (collection, find, callback) {
      try {
        validate([
          [ find,      Object    ],
          [ callback, Function  ]
        ]);

        $('../mongo/find')(
          app.locals.getConn(),
          collection,
          find,
          callback
        );
      }

      catch ( error ) {
        callback(error);
      }
    });

    socket.on('remove', function (collection, remove, callback) {
      try {
        validate([
          [ remove,     [String,Object] ],
          [ callback,   Function        ]
        ]);

        $('../mongo/remove')(
          app.locals.getConn(),
          collection,
          remove,
          callback
        );
      }

      catch ( error ) {
        callback(error);
      }
    });

    socket.on('update', function (collection, find, update, callback) {
      try {
        validate([
          [ find,       [String, Object]  ],
          [ update,     Object            ],
          [ callback,   Function          ]
        ]);

        $('../mongo/update')(
          app.locals.getConn(),
          collection,
          find,
          update,
          callback
        );
      }

      catch ( error ) {
        callback(error);
      }
    });

    socket.on('version', function (callback) {
      callback(pkg.version);
    })

    socket.on('message', function (message) {
      socket.broadcast.emit('message', message);
    });
  });
};
