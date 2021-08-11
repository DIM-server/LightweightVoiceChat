"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

/**
 * @class Render
 * 渲染器主类 用于渲染页面背景
 *
 * Copyright 2021-08-02 MrKBear mrkbear@qq.com
 * All rights reserved.
 * This file is part of the App project.
 * Unauthorized copying of this file, via any medium is strictly prohibited
 */
var Render = /*#__PURE__*/function () {
  /**
   * @param {HTMLCanvasElement} canvas
   */
  function Render(canvas) {
    _classCallCheck(this, Render);

    _defineProperty(this, "canvas", void 0);

    _defineProperty(this, "gl", void 0);

    _defineProperty(this, "glVersion", 0);

    _defineProperty(this, "isResize", true);

    _defineProperty(this, "isMouseMove", false);

    _defineProperty(this, "mouseX", 0);

    _defineProperty(this, "mouseY", 0);

    _defineProperty(this, "viewMat", M.mat4.create());

    _defineProperty(this, "zoom", 2 * Math.pow(2 / 3, .5));

    _defineProperty(this, "zoomMat", M.mat4.create());

    _defineProperty(this, "mvpMat", M.mat4.create());

    _defineProperty(this, "headerDrawProgram", void 0);

    _defineProperty(this, "headVecBuffer", void 0);

    _defineProperty(this, "headers", []);

    // 保存画布节点
    this.canvas = canvas; // 尝试 webgl2

    this.gl = this.canvas.getContext("webgl2");

    if (this.gl) {
      this.glVersion = 2;
    } else {
      this.gl = this.canvas.getContext("webgl");

      if (this.gl) {
        this.glVersion = 1;
      }
    } // 获取上下文


    this.gl = this.canvas.getContext("webgl2") || this.canvas.getContext("webgl"); // 开启深度测试

    this.gl.enable(this.gl.DEPTH_TEST);
    this.gl.enable(this.gl.CULL_FACE); // 计算观察者矩阵

    this.generateViewMat(); // 自适应一次

    this.resize(); // 初始化顶点绘图程序

    this.initHeaderDrawProgram(); // 上传顶点数据

    this.initHeadData();
  }
  /**
   * 更新
   */


  _createClass(Render, [{
    key: "width",
    get:
    /**
     * 绑定画布
     * @type {HTMLCanvasElement}
     */

    /**
     * webgl上下文
     * @type {WebGL2RenderingContext|WebGLRenderingContext}
     */

    /**
     * 属性代理
     * @type {Number}
     */
    function get() {
      return this.canvas.width;
    }
  }, {
    key: "height",
    get: function get() {
      return this.canvas.height;
    }
  }, {
    key: "offsetWidth",
    get: function get() {
      return this.canvas.offsetWidth;
    }
  }, {
    key: "offsetHeight",
    get: function get() {
      return this.canvas.offsetHeight;
    }
    /**
     * 缩放
     * @type {Number}
     */

  }, {
    key: "scaleX",
    get: function get() {
      return this.width / this.offsetWidth;
    }
  }, {
    key: "scaleY",
    get: function get() {
      return this.height / this.offsetHeight;
    }
    /**
     * 分辨率 (画布宽高比)
     * @type Number
     */

  }, {
    key: "ratio",
    get: function get() {
      return this.canvas.offsetWidth / this.canvas.offsetHeight;
    }
  }, {
    key: "update",
    value: function update(t) {
      // 自适应从新计算布局
      if (this.isResize) {
        this.isResize = false; // 更新视图

        this.gl.viewport(0, 0, this.width, this.height); // 计算缩放矩阵

        this.generateZoomMat(); // 计算变换矩阵

        this.generateMvpMat(); // 计算绘制矩阵

        this.updateDrawArray();
      } // 检测鼠标更新


      if (this.isMouseMove) {
        this.isMouseMove = false; // 传递鼠标事件

        this.testRotate();
      } // 更新全部头颅


      for (var i = 0; i < this.headers.length; i++) {
        this.headers[i].update(t);
      }
    }
    /**
     * 上传贴图
     */

  }, {
    key: "updateTex",
    value: function updateTex() {
      for (var i = 0; i < this.headers.length; i++) {
        this.headers[i].updateImg(this.glVersion);
      }
    }
    /**
     * 是否完成一次自适应
     * @type {boolean}
     */

  }, {
    key: "resize",
    value:
    /**
     * 画布分辨率自适应
     */
    function resize() {
      this.isResize = true;
      this.canvas.width = window.innerWidth;
      this.canvas.height = window.innerHeight;
    }
  }, {
    key: "mouseMove",
    value:
    /**
     * 鼠标移动监听
     */
    function mouseMove(x, y) {
      this.mouseX = x;
      this.mouseY = y;
      this.isMouseMove = true;
    }
    /**
     * 传递鼠标移动事件
     */

  }, {
    key: "testRotate",
    value: function testRotate() {
      var x = this.mouseX / this.offsetWidth;
      var y = 1 - this.mouseY / this.offsetHeight;
      x -= .5;
      x *= 2;
      y -= .5;
      y *= 2; // 保存虚拟变量值，提高性能

      var ux = this.unitX;
      var zoom = this.unitZoom;
      var ratio = this.ratio;
      var r = zoom * Math.pow(3, .5) / (2 * ratio); // 传递事件

      for (var i = 0; i < this.headers.length; i++) {
        // 清除击中状态
        this.headers[i].emitIndex = -1; // 按 Y 轴初步检测

        var disY = Math.abs(this.headers[i].drawY - y); // Y 轴测试

        if (disY < zoom) this.headers[i].rotate(x, zoom, r, disY, ratio);
      }
    }
    /**
     * 视图矩阵
     * @type {mat4}
     */

  }, {
    key: "generateViewMat",
    value:
    /**
     * 生成视图矩阵
     * */
    function generateViewMat() {
      // 视点
      var eye = M.vec3.create();
      M.vec3.set(eye, 1, 1, 1); // 目标

      var target = M.vec3.create();
      M.vec3.set(target, 0, 0, 0); // 旋转方向

      var up = M.vec3.create();
      M.vec3.set(up, 0, 1, 0); // 生成视图矩阵

      M.mat4.lookAt(this.viewMat, eye, target, up);
    }
    /**
     * 缩放
     * @type {Number}
     */

  }, {
    key: "unitZoom",
    get:
    /**
     * 缩放比例
     */
    function get() {
      return 2 / (Math.floor(this.headers.length / 2) * 3 + (this.headers.length % 2 === 0 ? .5 : 2));
    }
    /**
     * 生成缩放矩阵
     */

  }, {
    key: "generateZoomMat",
    value: function generateZoomMat() {
      // 根据头颅个数缩放
      var zoom = this.zoom / this.unitZoom; // 更新平行投影矩阵

      M.mat4.ortho(this.zoomMat, -zoom * this.ratio, zoom * this.ratio, -zoom, zoom, 0, 10);
    }
    /**
     * 变换矩阵
     * @type {mat4}
     */

  }, {
    key: "generateMvpMat",
    value:
    /**
     * 生成最终矩阵
     */
    function generateMvpMat() {
      M.mat4.multiply(this.mvpMat, this.zoomMat, this.viewMat);
    }
    /**
     * 清除缓冲区
     */

  }, {
    key: "clean",
    value: function clean() {
      this.gl.clearColor(150 / 255, 198 / 255, 217 / 255, 1.);
      this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);
    }
    /**
     * @type {Shader}
     */

  }, {
    key: "initHeaderDrawProgram",
    value:
    /**
     * 初始化头绘制程序
     */
    function initHeaderDrawProgram() {
      var V = "\n        attribute vec3 vPos;\n        attribute vec2 vUv;\n        attribute float vFront;\n        attribute float vLeft;\n        attribute float vRight;\n        attribute float vTop;\n        \n        uniform mat4 mvp;\n        uniform float rotate;\n        uniform vec2 mp;\n        \n        varying vec2 uv;\n        varying float front;\n        varying float left;\n        varying float right;\n        varying float top;\n        \n        const float PI = 3.14159265;\n        \n        vec3 rotateY(vec3 p, float ang) {\n            mat3 rMat = mat3(\n                cos(ang),  0.,   sin(ang),\n                0.,        1.,   0.,\n                -sin(ang), 0.,   cos(ang)\n            );\n            return rMat * p;\n        }\n    \n        void main(){\n            vec4 rPos = vec4(rotateY(vPos, -PI/2. * rotate), 1.);\n            rPos = mvp * rPos;\n            rPos.x = rPos.x + mp.x;\n            rPos.y = rPos.y + mp.y;\n            gl_Position = rPos; uv = vUv;\n            front = vFront; left = vLeft;\n            right = vRight; top = vTop;\n        }\n        ";
      var F = "\n        precision lowp float;\n        \n        varying vec2 uv;\n        varying float front;\n        varying float left;\n        varying float right;\n        varying float top;\n        \n        uniform sampler2D tFront;\n        uniform sampler2D tLeft;\n        uniform sampler2D tRight;\n        uniform sampler2D tTop;\n    \n        void main(){\n            vec4 color;\n            color = texture2D(tFront, vec2(uv.x, -uv.y)) * front;\n            color += texture2D(tLeft, vec2(uv.x, -uv.y)) * left;\n            color += texture2D(tRight, vec2(uv.x, -uv.y)) * right;\n            color += texture2D(tTop, vec2(uv.x, -uv.y)) * top;\n            gl_FragColor = color;\n        }\n        "; // 创建着色器

      this.headerDrawProgram = new Shader(this.gl, V, F); // 获取顶点attr

      this.headerDrawProgram.attribLocation("vPos");
      this.headerDrawProgram.attribLocation("vUv"); // 贴图向量

      this.headerDrawProgram.attribLocation("vFront");
      this.headerDrawProgram.attribLocation("vLeft");
      this.headerDrawProgram.attribLocation("vRight");
      this.headerDrawProgram.attribLocation("vTop");
      this.headerDrawProgram.uniformLocation("tFront");
      this.headerDrawProgram.uniformLocation("tLeft");
      this.headerDrawProgram.uniformLocation("tRight");
      this.headerDrawProgram.uniformLocation("tTop");
      this.headerDrawProgram.uniformLocation("mvp");
      this.headerDrawProgram.uniformLocation("rotate");
      this.headerDrawProgram.uniformLocation("mp");
    }
    /**
     * @type {WebGLBuffer}
     */

  }, {
    key: "initHeadData",
    value:
    /**
     * 初始化立方体数据
     */
    function initHeadData() {
      var CUBE_TRIANGLE_DATA = new Float32Array([// 顶面
      1, 1, 1, 1, 0, 1, 0, 0, 0, 1, 1, -1, 1, 1, 1, 0, 0, 0, -1, 1, -1, 0, 1, 1, 0, 0, 0, 1, 1, 1, 1, 0, 1, 0, 0, 0, -1, 1, -1, 0, 1, 1, 0, 0, 0, -1, 1, 1, 0, 0, 1, 0, 0, 0, // 正面
      1, 1, 1, 1, 1, 0, 1, 0, 0, -1, -1, 1, 0, 0, 0, 1, 0, 0, 1, -1, 1, 1, 0, 0, 1, 0, 0, 1, 1, 1, 1, 1, 0, 1, 0, 0, -1, 1, 1, 0, 1, 0, 1, 0, 0, -1, -1, 1, 0, 0, 0, 1, 0, 0, // 右侧
      1, -1, 1, 0, 0, 0, 0, 1, 0, 1, -1, -1, 1, 0, 0, 0, 1, 0, 1, 1, -1, 1, 1, 0, 0, 1, 0, 1, -1, 1, 0, 0, 0, 0, 1, 0, 1, 1, -1, 1, 1, 0, 0, 1, 0, 1, 1, 1, 0, 1, 0, 0, 1, 0, // 左侧
      -1, -1, 1, 1, 0, 0, 0, 0, 1, -1, 1, 1, 1, 1, 0, 0, 0, 1, -1, 1, -1, 0, 1, 0, 0, 0, 1, -1, -1, 1, 1, 0, 0, 0, 0, 1, -1, 1, -1, 0, 1, 0, 0, 0, 1, -1, -1, -1, 0, 0, 0, 0, 0, 1]); // 创建缓冲区

      this.headVecBuffer = this.gl.createBuffer(); // 上传数据

      this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.headVecBuffer);
      this.gl.bufferData(this.gl.ARRAY_BUFFER, CUBE_TRIANGLE_DATA, this.gl.STATIC_DRAW);
    }
    /**
     * 头颅列表
     * @type {Header[]}
     */

  }, {
    key: "unitX",
    get:
    /**
     * 单位 X 坐标
     */
    function get() {
      return Math.pow(3, .5) * this.unitZoom / this.ratio;
    }
    /**
     * 单位 Y 坐标
     */

  }, {
    key: "unitY",
    get: function get() {
      return 2 * 3 * this.unitZoom / 4;
    }
    /**
     * 添加头颅
     */

  }, {
    key: "addHeader",
    value: function addHeader(list) {
      for (var i = 0; i < list.length; i++) {
        this.headers.push(new Header(this.gl).setSrcByUrl(list[i]));
      }
    }
    /**
     * 加载头颅
     * @return {Promise<Promise[]>}
     */

  }, {
    key: "loadHeader",
    value: function loadHeader() {
      return Promise.all(this.headers.map(function (v) {
        return v.loadImg();
      }));
    }
    /**
     * 更新绘制数组
     */

  }, {
    key: "updateDrawArray",
    value: function updateDrawArray() {
      // 保存虚拟变量值，提高性能
      var ux = this.unitX;
      var uy = this.unitY; // 计算最大绘制高度

      var top = this.headers.length % 2 === 0 ? this.headers.length / 2 - .5 : (this.headers.length - 1) / 2; // 计算

      for (var i = 0; i < this.headers.length; i++) {
        this.headers[i].setDrawArray(i % 2 === 1 ? ux / 2 : 0, (top - i) * uy, ux);
      }
    }
    /**
     * 绘制全部头颅
     */

  }, {
    key: "drawAllHeader",
    value: function drawAllHeader() {
      // 使用程序
      this.headerDrawProgram.use(); // 绑定缓冲区

      this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.headVecBuffer); // 启动指针传递

      this.gl.enableVertexAttribArray(this.headerDrawProgram.vPos);
      this.gl.enableVertexAttribArray(this.headerDrawProgram.vUv);
      this.gl.enableVertexAttribArray(this.headerDrawProgram.vFront);
      this.gl.enableVertexAttribArray(this.headerDrawProgram.vLeft);
      this.gl.enableVertexAttribArray(this.headerDrawProgram.vRight);
      this.gl.enableVertexAttribArray(this.headerDrawProgram.vTop); // 指定指针数据

      this.gl.vertexAttribPointer(this.headerDrawProgram.vPos, 3, this.gl.FLOAT, false, 9 * 4, 0);
      this.gl.vertexAttribPointer(this.headerDrawProgram.vUv, 2, this.gl.FLOAT, false, 9 * 4, 3 * 4); // 贴图向量

      this.gl.vertexAttribPointer(this.headerDrawProgram.vTop, 1, this.gl.FLOAT, false, 9 * 4, 5 * 4);
      this.gl.vertexAttribPointer(this.headerDrawProgram.vFront, 1, this.gl.FLOAT, false, 9 * 4, 6 * 4);
      this.gl.vertexAttribPointer(this.headerDrawProgram.vRight, 1, this.gl.FLOAT, false, 9 * 4, 7 * 4);
      this.gl.vertexAttribPointer(this.headerDrawProgram.vLeft, 1, this.gl.FLOAT, false, 9 * 4, 8 * 4); // 传递 mvp 矩阵

      this.gl.uniformMatrix4fv(this.headerDrawProgram.mvp, false, this.mvpMat); // 绘制全部方块

      for (var i = 0; i < this.headers.length; i++) {
        // 设置贴图
        this.gl.activeTexture(this.gl.TEXTURE1);
        this.gl.bindTexture(this.gl.TEXTURE_2D, this.headers[i].top);
        this.gl.activeTexture(this.gl.TEXTURE2);
        this.gl.bindTexture(this.gl.TEXTURE_2D, this.headers[i].front);
        this.gl.activeTexture(this.gl.TEXTURE3);
        this.gl.bindTexture(this.gl.TEXTURE_2D, this.headers[i].right);
        this.gl.activeTexture(this.gl.TEXTURE4);
        this.gl.bindTexture(this.gl.TEXTURE_2D, this.headers[i].left); // 上传贴图索引

        this.gl.uniform1i(this.headerDrawProgram.tFront, 2);
        this.gl.uniform1i(this.headerDrawProgram.tLeft, 4);
        this.gl.uniform1i(this.headerDrawProgram.tRight, 3);
        this.gl.uniform1i(this.headerDrawProgram.tTop, 1); // 绘制平铺

        for (var j = 0; j < this.headers[i].drawArray.length; j++) {
          // 旋转参数
          this.gl.uniform1f(this.headerDrawProgram.rotate, this.headers[i].rotateArray[j]); // 坐标

          this.gl.uniform2f(this.headerDrawProgram.mp, this.headers[i].drawArray[j], this.headers[i].drawY); // 开始绘制

          this.gl.drawArrays(this.gl.TRIANGLES, 0, 24);
        }
      }
    }
  }]);

  return Render;
}();