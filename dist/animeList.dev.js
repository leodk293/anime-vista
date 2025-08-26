"use strict";

function getAnimeName() {
  var response, result;
  return regeneratorRuntime.async(function getAnimeName$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.prev = 0;
          _context.next = 3;
          return regeneratorRuntime.awrap(fetch('https://anime-vista-api.vercel.app/api/anime-vista-list'));

        case 3:
          response = _context.sent;

          if (response.ok) {
            _context.next = 6;
            break;
          }

          throw new Error('An error has occurred');

        case 6:
          _context.next = 8;
          return regeneratorRuntime.awrap(response.json());

        case 8:
          result = _context.sent;
          _context.next = 13;
          break;

        case 11:
          _context.prev = 11;
          _context.t0 = _context["catch"](0);

        case 13:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[0, 11]]);
}