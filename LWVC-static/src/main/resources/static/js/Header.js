"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

/**
 * @class Header
 * 玩家头颅
 *
 * Copyright 2021-08-02 MrKBear mrkbear@qq.com
 * All rights reserved.
 * This file is part of the App project.
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * */
var Header = /*#__PURE__*/function () {
  // 四个朝向的贴图
  // 四个朝向的贴图源地址
  // 四个方向贴图

  /**
   * @type {WebGL2RenderingContext|WebGLRenderingContext}
   */

  /**
   * @param {WebGL2RenderingContext|WebGLRenderingContext} gl
   */
  function Header(gl) {
    _classCallCheck(this, Header);

    _defineProperty(this, "frontImg", new Image());

    _defineProperty(this, "leftImg", new Image());

    _defineProperty(this, "rightImg", new Image());

    _defineProperty(this, "topImg", new Image());

    _defineProperty(this, "frontSrc", "");

    _defineProperty(this, "leftSrc", "");

    _defineProperty(this, "rightSrc", "");

    _defineProperty(this, "topSrc", "");

    _defineProperty(this, "front", void 0);

    _defineProperty(this, "left", void 0);

    _defineProperty(this, "right", void 0);

    _defineProperty(this, "top", void 0);

    _defineProperty(this, "gl", void 0);

    _defineProperty(this, "drawArray", []);

    _defineProperty(this, "drawY", 0);

    _defineProperty(this, "rotateArray", []);

    _defineProperty(this, "speedIn", 20);

    _defineProperty(this, "speedOut", 5);

    _defineProperty(this, "emitIndex", -1);

    this.gl = gl;
    this.front = this.gl.createTexture();
    this.left = this.gl.createTexture();
    this.right = this.gl.createTexture();
    this.top = this.gl.createTexture();
  }
  /**
   * 加载全部图片
   * @return Promise
   */


  _createClass(Header, [{
    key: "loadImg",
    value: function loadImg() {
      var _this = this;

      // 设置源地址
      this.frontImg.src = this.frontSrc;
      this.leftImg.src = this.leftSrc;
      this.rightImg.src = this.rightSrc;
      this.topImg.src = this.topSrc; // 上传到贴图数据

      return Promise.all([new Promise(function (r) {
        return _this.frontImg.onload = function () {
          return r(_this.frontImg);
        };
      }), new Promise(function (r) {
        return _this.leftImg.onload = function () {
          return r(_this.leftImg);
        };
      }), new Promise(function (r) {
        return _this.rightImg.onload = function () {
          return r(_this.rightImg);
        };
      }), new Promise(function (r) {
        return _this.topImg.onload = function () {
          return r(_this.topImg);
        };
      })]);
    }
    /**
     * 上传贴图
     */

  }, {
    key: "updateImg",
    value: function updateImg(ver) {
      var _this2 = this;

      ["front", "left", "right", "top"].map(function (v) {
        _this2.gl.bindTexture(_this2.gl.TEXTURE_2D, _this2[v]);

        _this2.gl.texParameteri(_this2.gl.TEXTURE_2D, _this2.gl.TEXTURE_MAG_FILTER, _this2.gl.NEAREST);

        _this2.gl.texParameteri(_this2.gl.TEXTURE_2D, _this2.gl.TEXTURE_MIN_FILTER, _this2.gl.NEAREST); // 如果是gl1


        if (ver === 1) {
          _this2.gl.texImage2D(_this2.gl.TEXTURE_2D, 0, _this2.gl.RGBA, _this2.gl.RGBA, _this2.gl.UNSIGNED_BYTE, _this2[v + "Img"]);
        } else {
          _this2.gl.texImage2D(_this2.gl.TEXTURE_2D, 0, _this2.gl.RGBA, 8, 8, 0, _this2.gl.RGBA, _this2.gl.UNSIGNED_BYTE, _this2[v + "Img"]);
        }
      });
    }
    /**
     * 设置源地址
     * @param {String} f 正面链接
     * @param {String} l 左面链接
     * @param {String} r 右面链接
     * @param {String} b 背面链接
     * @return Header
     */

  }, {
    key: "setSrc",
    value: function setSrc(f, l, r, b) {
      this.frontSrc = f;
      this.leftSrc = l;
      this.rightSrc = r;
      this.topSrc = b;
      return this;
    }
    /**
     * 通过标准链接设置src
     * @param {String} url
     * @param {String} [type="png"]
     * @return this
     */

  }, {
    key: "setSrcByUrl",
    value: function setSrcByUrl(url) {
      var type = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "png";
      return this.setSrc(url + "front." + type, url + "left." + type, url + "right." + type, url + "top." + type);
    }
    /**
     * 绘制 X 数组
     * @type {Number[]}
     */

  }, {
    key: "setDrawArray",
    value:
    /**
     * 设置绘制数组
     * @param {Number} x 相位
     * @param {Number} y 绘制高度
     * @param {Number} ux 单位距离
     */
    function setDrawArray(x, y, ux) {
      // 设置绘制高度
      this.drawY = y; // 清除数组

      this.drawArray = []; // 标记中心点

      this.drawArray.push(x);
      if (this.rotateArray[0] === undefined) this.rotateArray.push(0); // 下一位置

      var nextPosL = 0;
      var nextPosR = 0;
      var time = 0; // 循环生成数据

      while (true) {
        // 边界约束
        if (nextPosL < -1 && nextPosR > 1) break;
        time++; // 安全执行次数

        if (time > 9999) break; // 生成左侧数据

        nextPosL = x - time * ux; // 生成右侧数据

        nextPosR = x + time * ux; // 添加

        this.drawArray.push(nextPosL);
        if (this.rotateArray[this.drawArray.length - 1] === undefined) this.rotateArray.push(0);
        this.drawArray.push(nextPosR);
        if (this.rotateArray[this.drawArray.length - 1] === undefined) this.rotateArray.push(0);
      }
    }
    /**
     * 旋转列表
     */

  }, {
    key: "update",
    value:
    /**
     * 更新
     */
    function update(t) {
      for (var i = 0; i < this.rotateArray.length; i++) {
        // 旋转
        if (i === this.emitIndex) {
          this.rotateArray[i] += (1 - this.rotateArray[i]) * t * this.speedIn;
        } // 回转
        else {
          this.rotateArray[i] -= this.rotateArray[i] * t * this.speedOut;
        } // 限制


        if (this.rotateArray[i] > 1) this.rotateArray[i] = 1;
        if (this.rotateArray[i] < 0) this.rotateArray[i] = 0;
      }
    }
  }, {
    key: "rotate",
    value:
    /**
     * 旋转
     * @param {Number} x 事件坐标X
     * @param {Number} a 事件半径
     * @param {Number} zoom 事件半径
     * @param {Number} disY Y轴偏移距离
     * @param {Number} ratio 分辨率
     */
    function rotate(x, a, zoom, disY, ratio) {
      // X 测试
      for (var i = 0; i < this.drawArray.length; i++) {
        // 半径约束
        var disX = Math.abs(this.drawArray[i] - x); // 射线检测

        if (disX < zoom && a - disY > disX * ratio / Math.pow(3, .5)) {
          this.emitIndex = i;
        }
      }
    }
  }]);

  return Header;
}();