beforeAll(() => {
    Object.defineProperty(HTMLCanvasElement.prototype, 'getContext', {
      value: (type) => {
        if (type === '2d') {
          return {
            clearRect: jest.fn(),
            fillRect: jest.fn(),
            getImageData: jest.fn(),
            putImageData: jest.fn(),
            createImageData: jest.fn(),
            setTransform: jest.fn(),
            drawImage: jest.fn(),
            save: jest.fn(),
            fillText: jest.fn(),
            restore: jest.fn(),
            beginPath: jest.fn(),
            moveTo: jest.fn(),
            lineTo: jest.fn(),
            closePath: jest.fn(),
            stroke: jest.fn(),
            translate: jest.fn(),
            scale: jest.fn(),
            rotate: jest.fn(),
            arc: jest.fn(),
            fill: jest.fn(),
            measureText: jest.fn(),
            transform: jest.fn(),
            rect: jest.fn(),
            clip: jest.fn(),
          };
        }
        if (type === 'webgl' || type === 'webgl2') {
          return {
            clearColor: jest.fn(),
            clear: jest.fn(),
            createBuffer: jest.fn(),
            bindBuffer: jest.fn(),
            bufferData: jest.fn(),
            createShader: jest.fn(),
            shaderSource: jest.fn(),
            compileShader: jest.fn(),
            createProgram: jest.fn(),
            attachShader: jest.fn(),
            linkProgram: jest.fn(),
            useProgram: jest.fn(),
            getShaderParameter: jest.fn(),
            getProgramParameter: jest.fn(),
            getShaderInfoLog: jest.fn(),
            getProgramInfoLog: jest.fn(),
            viewport: jest.fn(),
            enable: jest.fn(),
            disable: jest.fn(),
            drawArrays: jest.fn(),
            drawElements: jest.fn(),
            createTexture: jest.fn(),
            bindTexture: jest.fn(),
            texParameteri: jest.fn(),
            texImage2D: jest.fn(),
            activeTexture: jest.fn(),
          };
        }
        return null;
      },
    });
  });