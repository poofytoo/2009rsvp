
$(function() {

  const teamColors = {
    0: ['#808C95', 'silver'],
    1: ['#F6C900', 'yellow'],
    2: ['#D61B29', 'red'],
    3: ['#1F5CD4', 'blue'],
    4: ['#F8660A', 'orange'],
    5: ['#2BB20A', 'green'],
    6: ['#FC40BE', 'pink'],
    7: ['#9100FF', 'purple'],
  }

  var enterEmail = false;
  var activeGoBtn = false;
  var isChrome = /Chrome/.test(navigator.userAgent) && /Google Inc/.test(navigator.vendor);
  var isSafari = /Safari/.test(navigator.userAgent) && /Apple Computer/.test(navigator.vendor);

  // Event Handlers
  $(document).on('mouseover', '.content-inner', function() {
    if (engine.world.gravity.x == 0) {
      activateDots();
    }
  })

  $(document).on('click', '.signup-box', function() {
    if (!enterEmail) {
      enterEmail = true;
      jQuery.fx.interval = 10;
      $('.signup-text').animate({
        opacity: 0,
      }, 100, function() {
        $('.go-btn').css('opacity', 1);
        $('.signup-box').animate({
          backgroundColor: '#fff',
        }, 50, function() {
          // This is a shame - safari can't render gooey properly. 
          // I'm so sorry safari. I'm so, so sorry.
          if (!isSafari) {
            $('.signup').css({
              'filter': 'url(\'#goo\')',
              '-webkit-filter': 'url(\'#goo\')'  
            })
          }
          $('.go-btn').animate({
            right: -20
          }, 200, 'easeInOutQuad')
          $('.signup-box').animate({
            width: 280,
            left: -24,
          }, 200, 'easeInOutQuad', function() {
            $('.signup').css({
              'filter': 'none',
              '-webkit-filter': 'none'
            })
            $('.enter-email').show();
            $('.enter-email').focus();
          })
        })
      });
    }
  })

  $('.enter-email').focusin(function() {
  })

  $(document).on('click', '.go-btn', function() {
    submitEmail();
  })

  $(document).on('keyup', '.enter-email', function(e) {
    if (e.which == 13) {
      submitEmail();
    }

    $('.go-btn').animate({
      color: '#ffffff',
      backgroundColor: 'green'
    })
    activeGoBtn = true;
    randomShade = Math.random()*0.7 + 0.3
    randomColor = 'rgba(255,255,255,'+randomShade+')';
    ball = Bodies.circle(initWinWidth/2, topOfBalls, DOTS_RADIUS,
    {
      friction: 0,
      restitution: 1.1,
      render: {
        fillStyle: randomColor, // colouredBalls[i],
        strokeStyle: randomColor// colouredBalls[i]
      }
    })

    World.add(engine.world, ball);

    Matter.Body.applyForce(ball, {
        x : 0,
        y : 0
      }, {
        x : (Math.random()-0.5)/200,
        y : 0
      })
  })


  function submitEmail() {
    $('.go-btn').css('display', 'none')
    $('.signup-box').animate({
      width: 0,
      opacity: 0,
      left: 0
    }, 200, function() {
      $(this).slideUp(200, function() {
        $('.confirm-message').text('your email has been submitted. thanks!');
        $('.confirm-message').fadeIn();
      });
    })
  }

  function drawTopTrapezoid() {
    ww = $(window).width();
    points = '0,0 ' + 
      ww + ',0 ' +
      ww + ',70 ' + 
      '0,110';
    $('.slanted-background-top').find('polygon').attr('points', points)
  }

  function drawBottomTrapezoid() {
    ww = $(window).width();
    points = '0,0 ' + 
      ww + ',' + TRAPEZOID_BOTTOM + ' ' +
      ww + ',110 ' + 
      '0,110';
    $('.slanted-background-bottom').find('polygon').attr('points', points)
  }

  function init() {
    drawTopTrapezoid();
    drawBottomTrapezoid();
  }

  var engine;

  const TRAPEZOID_BOTTOM = 50;
  const DOTS_RADIUS = 10;
  const DOT_SPACING = 30;

  function activateDots() {
    for (i in ballBodies) {
    Matter.Body.applyForce(ballBodies[i], {
        x : 0,
        y : 0
      }, {
        x : (Math.random()-0.5)/300,
        y : -Math.random()/150 - 0.005
      })
    }
    engine.world.gravity.y = 1.5
    engine.world.gravity.x = 0.1
  }

  initWinWidth = $(window).width();
  initWinHeight = $(window).height();

  $(window).resize(function() {
    drawTopTrapezoid();
    drawBottomTrapezoid();
  });

  var Engine = Matter.Engine,
    World = Matter.World,
    Bodies = Matter.Bodies;

  var canvas = document.getElementById('test');
  $('#test').attr('width',initWinWidth);
  $('#test').attr('height',initWinHeight);

  engine = Engine.create(document.body, { 
    render: {
      canvas: canvas,
      options: {
        // width: $(window).width(),
        // height: $(window).height(),
        background: 'none',
        wireframes: false,
        enableSleeping: false,
        hasBounds: false,
      }
    }
  });

  topOfContent = $('.content').offset().top;
  topOfBalls = topOfContent - 60;
  // colouredBalls = ['red', 'blue', 'gray', 'yellow', 'orange', 'green', 'purple', 'pink']
  ballBodies = [];
  allBodies = [];

  for (i = 0; i < 8; i ++) {
    ball = Bodies.circle(i*DOT_SPACING + initWinWidth/2 - DOT_SPACING*4 + DOT_SPACING/2, topOfBalls, DOTS_RADIUS,
    {
      friction: 0,
      restitution: 1.1,
      render: {
        fillStyle: teamColors[i][0],
        strokeStyle: teamColors[i][0]
      }
    })

    ballBodies.push(ball)
  }

  groundAngle = Math.tan(TRAPEZOID_BOTTOM/initWinWidth);
  midGroundHeight = initWinHeight - 85 + 9;
  midGroundLocation = initWinWidth/2;
  var ground = Bodies.rectangle(midGroundLocation, midGroundHeight, 2000, 20, { 
    restitution: 1.6, 
    friction: 0, 
    isStatic: true, 
    angle: groundAngle, 
    render: {
      visible: false
    }
  });

  allBodies = ballBodies.concat([ground])

  World.add(engine.world, allBodies);
  Engine.run(engine);
  engine.world.gravity.y = 0
  engine.world.gravity.x = 0
  engine.world.bounds.min.x = -Infinity;
  engine.world.bounds.min.y = -Infinity;
  engine.world.bounds.max.x = Infinity;
  engine.world.bounds.max.y = Infinity;

  init();

  setInterval(function() {
    for (i in ballBodies) {
      if (ballBodies[i] != '') {
        if (ballBodies[i].position.y > (initWinHeight-80)) {
          console.log(teamColors[(ballBodies[i].id-1)][1], 'is out!')
          ballBodies[(ballBodies[i].id-1)] = ''
        }
      }
    }
  }, 500)

})

if (window.DeviceOrientationEvent) {
  window.addEventListener('deviceorientation', function(eventData) {
    var tiltLR = eventData.gamma;
    var tiltFB = eventData.beta;
    var dir = eventData.alpha
    console.log(tiltLR, tiltFB, dir);
  }, false);

} else {
  console.log('no-tilty')
}
