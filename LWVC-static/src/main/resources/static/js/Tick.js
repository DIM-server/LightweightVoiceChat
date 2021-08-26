"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var lastTime = 0;

var Tick = /*#__PURE__*/function () {
  /**
   * 动画循环
   * @param {Function} fn
   */
  function Tick(fn) {
    var _this = this;

    _classCallCheck(this, Tick);

    _defineProperty(this, "allTime", 0);

    _defineProperty(this, "speed", 1);

    _defineProperty(this, "stats", void 0);

    // 主循环
    var loop = function loop(t) {
      if (_this.stats) _this.stats.begin(); // 时差

      var dur = (t - _this.allTime) * _this.speed / 1000; // 检测由于失焦导致的丢帧

      if (t - _this.allTime < 100) {
        fn(dur);
      } // 更新时间


      _this.allTime = t;
      if (_this.stats) _this.stats.end(); // 继续循环

      requestAnimationFrame(loop); // this.requestNextFrame(loop);
    }; // 获取时间


    requestAnimationFrame(function (t) {
      // 记录初始时间
      _this.allTime = t; // 开启循环

      requestAnimationFrame(loop);
    });
  }

  _createClass(Tick, [{
    key: "useStats",
    value: // 总用时
    // 速率
    // fps监视器

    /**
     * 开启 fps 监视
     */
    function useStats() {
      this.stats = new Stats();
      this.stats.showPanel(0);
      document.body.appendChild(this.stats.dom);
    }
  }, {
    key: "requestNextFrame",
    value: function requestNextFrame(fn) {
      setTimeout(function () {
        var currTime = new Date().getTime();
        var timeToCall = Math.max(0, 16 - (currTime - lastTime));
        fn(currTime + timeToCall);
      }, 1);
    }
  }]);

  return Tick;
}();