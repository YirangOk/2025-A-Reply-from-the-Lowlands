
    // Matter.js 네임스페이스 가져오기
    var Engine = Matter.Engine,
      Render = Matter.Render,
      Runner = Matter.Runner,
      Composites = Matter.Composites,
      Common = Matter.Common,
      MouseConstraint = Matter.MouseConstraint,
      Mouse = Matter.Mouse,
      World = Matter.World,
      Bodies = Matter.Bodies,
      Events = Matter.Events;

    // 기사 제목이 로드되면 window.currentTitleWords에 저장됨
    // 초기 로딩 전에 사용할 기본 단어들
    const fallbackWords = [];  // No lorem ipsum fallback
    let wordSeqIndex = 0;

    function getNextWord() {
      const list = (window.currentTitleWords && window.currentTitleWords.length)
        ? window.currentTitleWords
        : fallbackWords;
      if (wordSeqIndex >= list.length) wordSeqIndex = 0;
      if (!list.length) return null;
      return list[wordSeqIndex++];
    }

    function getSidebarWidth(){
      const el=document.getElementById('article-list');
      return el?el.offsetWidth:0;
    }

    // 엔진 생성
    var engine = Engine.create(),
      world = engine.world;

    // 렌더러 생성
    var render = Render.create({
      element: document.body,
      engine: engine,
      options: {
        width: window.innerWidth,
        height: window.innerHeight,
        wireframes: false,
        background: 'transparent' // 완전 투명
      }
    });

    // Ensure canvas style width matches computed width
    render.canvas.style.width = render.options.width + 'px';
    Render.run(render);

    // 러너 생성
    var runner = Runner.create();
    Runner.run(runner, engine);

    // 벽 생성 함수 (상단 벽 없음, 나머지는 화면에 붙게)
    function createWalls() {
      const w=window.innerWidth;
      return [
        Bodies.rectangle(w/2, window.innerHeight, w, 20, {
          isStatic: true,
          render: {
            fillStyle: '#d5dedd',
            strokeStyle: '#d5dedd',
            lineWidth: 2
          }
        }), // 하단
        Bodies.rectangle(w, window.innerHeight / 2, 20, window.innerHeight, {
          isStatic: true,
          render: {
            fillStyle: '#d5dedd',
            strokeStyle: '#d5dedd',
            lineWidth: 2
          }
        }), // 우측
        Bodies.rectangle(0, window.innerHeight / 2, 20, window.innerHeight, {
          isStatic: true,
          render: {
            fillStyle: '#d5dedd',
            strokeStyle: '#d5dedd',
            lineWidth: 2
          }
        }) // 좌측
      ];
    }

    // 이미지에서 추출한 색상 팔레트
    const colorPalette = [
      '#aebab8'
    ];

    // 단어 블록 생성 함수 (글자 크기 측정 후 해당 크기로 바디 생성, 사각형 스타일 제거)
    function createWordBlock(word) {
      // 글자 크기 측정
      var tempCanvas = document.createElement('canvas');
      var ctx = tempCanvas.getContext('2d');
      ctx.font = '600 23px "Happiness-Sans-Regular", sans-serif';
      var textWidth = ctx.measureText(word).width; // 패딩 없음
      var textHeight = 23; // 폰트 사이즈와 동일
      var canvasWidth = window.innerWidth;
      var x = Common.random(textWidth / 2 + 10, canvasWidth - textWidth / 2 - 10);
      var y = -textHeight;
      var color = colorPalette[Math.floor(Math.random() * colorPalette.length)];
      var body = Bodies.rectangle(x, y, textWidth, textHeight, {
        restitution: 0.9,
        friction: 0.005,
        density: 0.001,
        render: {
          fillStyle: 'rgba(0,0,0,0)',
          strokeStyle: 'rgba(0,0,0,0)',
          lineWidth: 0
        }
      });
      body.word = word;
      body.textWidth = textWidth;
      body.textHeight = textHeight;
      body.wordColor = color;
      body.fontSize = 23;
      return body;
    }

    // 초기 단어 블록 여러 개 생성
    function createInitialWordBlocks(count) {
      var blocks = [];
      for (var i = 0; i < count; i++) {
        var word = getNextWord();
        if (!word) continue;
        blocks.push(createWordBlock(word));
      }
      return blocks;
    }

    var walls = createWalls();
    var rects = [];

    World.add(world, walls);

    // 마우스 컨트롤 추가
    var mouse = Mouse.create(render.canvas),
      mouseConstraint = MouseConstraint.create(engine, {
        mouse: mouse,
        constraint: {
          stiffness: 0.2,
          render: {
            visible: false
          }
        }
      });

    World.add(world, mouseConstraint);
    render.mouse = mouse;

    // 반응형 리사이즈
    window.addEventListener('resize', function () {
      render.options.width = window.innerWidth;
      render.options.height = window.innerHeight;
      render.canvas.width = render.options.width;
      render.canvas.height = window.innerHeight;
      render.canvas.style.width = render.options.width + 'px';

      // 월드에서 기존 벽, 사각형, 마우스 컨스트레인트 제거
      World.clear(world, false);

      // 새 벽, 기존 사각형, 마우스 컨스트레인트 추가
      walls = createWalls();
      World.add(world, walls);
      World.add(world, rects);
      World.add(world, mouseConstraint);
    });

    // 마우스 프레스 시 단어 블록 생성 → 마우스 누르고 있는 동안 계속 생성
    var spawnIntervalId = null;

    function spawnNextWordBlock() {
      var word = getNextWord();
      if (!word) return;
      var block = createWordBlock(word);
      rects.push(block);
      World.add(world, block);
      // rects 배열이 너무 커지면 오래된 블록을 제거해 메모리 누수 방지 (선택사항)
      if (rects.length > 300) {
        var old = rects.shift();
        World.remove(world, old);
      }
    }

    function startSpawningRects() {
      if (spawnIntervalId) return;
      spawnIntervalId = setInterval(spawnNextWordBlock, 100);
    }

    function stopSpawningRects() {
      clearInterval(spawnIntervalId);
      spawnIntervalId = null;
    }

    render.canvas.addEventListener('mousedown', function (event) {
      startSpawningRects();
    });

    render.canvas.addEventListener('mouseup', function (event) {
      stopSpawningRects();
    });

    render.canvas.addEventListener('mouseleave', function (event) {
      stopSpawningRects();
    });

    // afterRender에서 단어를 블록 위에 그리기 (사각형 없이 글자만 보임)
    Events.on(render, 'afterRender', function() {
      rects.forEach(function(body) {
        if (body.word) {
          var pos = body.position;
          var angle = body.angle;
          var ctx = render.context;
          ctx.save();
          ctx.translate(pos.x, pos.y);
          ctx.rotate(angle);

          // 글자
          ctx.font = `600 ${body.fontSize}px 'Happiness-Sans-Regular', sans-serif`;
          ctx.fillStyle = body.wordColor || "#aebab8";
          ctx.textAlign = "center";
          ctx.textBaseline = "middle";
          ctx.fillText(body.word, 0, 0);

          ctx.restore();
        }
      });
    });

    // Add collisionStart handler at bottom
    Events.on(engine, 'collisionStart', function(event) {
      event.pairs.forEach(function(pair) {
        var a = pair.bodyA;
        var b = pair.bodyB;
        if (a.word && b.word && a.word === b.word && !a._merged && !b._merged) {
          // Mark merged to avoid repeat
          b._merged = true;
          // Remove b
          World.remove(world, b);
          rects = rects.filter(function(r){ return r !== b; });
          // Scale a
          var scale = 1.5;
          Matter.Body.scale(a, scale, scale);
          a.textWidth *= scale;
          a.textHeight *= scale;
          a.fontSize = Math.round(a.fontSize * scale);
        }
      });
    });