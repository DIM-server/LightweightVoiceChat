"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var Shader = /*#__PURE__*/function () {
  /**
   * @type {WebGL2RenderingContext|WebGLRenderingContext}
   */

  /**
   * @type {WebGLProgram}
   */

  /**
   * 创建编译 shader
   * @param {WebGL2RenderingContext|WebGLRenderingContext} gl
   * @param {String} vertex
   * @param {String} fragment
   * @return {WebGLProgram}
   */
  function Shader(gl, vertex, fragment) {
    _classCallCheck(this, Shader);

    _defineProperty(this, "gl", void 0);

    _defineProperty(this, "program", void 0);

    this.gl = gl;
    vertex = vertex.replace("\n", "");
    fragment = fragment.replace("\n", ""); // 创建程序

    this.program = gl.createProgram(); // 创建顶点着色器

    var vertexShader = gl.createShader(gl.VERTEX_SHADER); // 创建片段着色器

    var fragmentShader = gl.createShader(gl.FRAGMENT_SHADER); // 绑定源代码

    gl.shaderSource(vertexShader, vertex);
    gl.shaderSource(fragmentShader, fragment); // 编译

    gl.compileShader(vertexShader);
    gl.compileShader(fragmentShader); // 检测编译错误

    if (!gl.getShaderParameter(vertexShader, gl.COMPILE_STATUS)) {
      console.error("vertex:\r\n" + gl.getShaderInfoLog(vertexShader));
    }

    if (!gl.getShaderParameter(fragmentShader, gl.COMPILE_STATUS)) {
      console.error("fragment:\r\n" + gl.getShaderInfoLog(fragmentShader));
    } // 附加到程序


    gl.attachShader(this.program, vertexShader);
    gl.attachShader(this.program, fragmentShader); // 连接程序

    gl.linkProgram(this.program); // 检测链接错误

    if (!gl.getProgramParameter(this.program, gl.LINK_STATUS)) {
      console.error("link:\r\n" + gl.getProgramInfoLog(this.program));
    }
  }
  /**
   * 使用程序
   */


  _createClass(Shader, [{
    key: "use",
    value: function use() {
      this.gl.useProgram(this.program);
    }
    /**
     * 获取 attribLocation
     * @param {String} attr
     */

  }, {
    key: "attribLocation",
    value: function attribLocation(attr) {
      this[attr] = this.gl.getAttribLocation(this.program, attr);
    }
    /**
     * 获取 UniformLocation
     * @param {String} uni
     */

  }, {
    key: "uniformLocation",
    value: function uniformLocation(uni) {
      this[uni] = this.gl.getUniformLocation(this.program, uni);
    }
  }]);

  return Shader;
}();