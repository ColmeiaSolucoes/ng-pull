"use strict";
/**
 * Each module has a <moduleName>.module.js file.  This file contains the angular module declaration -
 * angular.module("moduleName", []);
 * The build system ensures that all the *.module.js files get included prior to any other .js files, which
 * ensures that all module declarations occur before any module references.
 */
(function (module) {
  // The name of the module, followed by its dependencies (at the bottom to facilitate enclosure)
}(angular.module("ngPull", ["ngOnPull", "ngPullContainer", "ngPullTarget", "ngPullService"])));

"use strict";
/**
 * Each module has a <moduleName>.module.js file.  This file contains the angular module declaration -
 * angular.module("moduleName", []);
 * The build system ensures that all the *.module.js files get included prior to any other .js files, which
 * ensures that all module declarations occur before any module references.
 */
(function (module) {
  var TRANSLATEZ_SUFFIX = 'translateZ(0)';
  module.service('ngPullService', ['$$rAF',PullService]);
  var FACTORIES = {
    down:{
      canBegin: function(element, options) {
        // stays in top
        return Math.floor(element.prop('scrollTop')) === 0;
      },
      distance: function(newEvent, oldEvent) {
        return newEvent.clientY - oldEvent.clientY;
      },
      container:{
        prepare:function(element, ctrl) {

        },
        update:function(element, progress, ctrl) {
          element[0].style['transform'] = progress>0?'translateY('+(progress / 100 * ctrl.options.distance)+'px)'+TRANSLATEZ_SUFFIX:'';
        }
      },
      target:{
        update:function(element, progress, ctrl) {
          element[0].style['transform'] = progress>0?'translateY('+(progress / 100 * ctrl.options.distance)+'px)'+TRANSLATEZ_SUFFIX:'';
        }
      }
    },
    up:{
      canBegin: function(element, options) {
        return Math.round(element.prop('scrollTop')) === Math.round(element.prop('scrollHeight') - element.prop('clientHeight'));
      },
      distance: function(newEvent, oldEvent) {
        return oldEvent.clientY - newEvent.clientY;
      },
      container:{
        prepare:function(element, ctrl) {

        },
        update:function(element, progress, ctrl) {
          element[0].style['transform'] = 'translateY('+(ctrl.options.distance-progress / 100 * ctrl.options.distance)+'px)translateZ(0)';
          element[0].style.height = (progress / 100 * ctrl.options.distance)+'px';
        }
      },
      target:{
        update:function(element, progress, ctrl) {
          element[0].style['transform'] = 'translateY('+(ctrl.options.distance-progress / 100 * ctrl.options.distance)+'px)translateZ(0)';
        }
      }
    },
    left:{
      canBegin: function(element, options) {
        return Math.round(element.prop('scrollLeft')) === Math.round(element.prop('scrollWidth') - element.prop('clientWidth'));
      },
      distance: function(newEvent, oldEvent) {
        return oldEvent.clientX - newEvent.clientX;
      },
      container:{
        prepare:function(element, ctrl) {
          element.children()[0].style.width = (ctrl.options.distance)+ 'px';
        },
        update:function(element, progress, ctrl) {
          element[0].style.width = (progress / 100 * ctrl.options.distance)+ 'px';
          element[0].style['transform'] = progress>0?'translateX('+(-progress / 100 * ctrl.options.distance)+'px)'+TRANSLATEZ_SUFFIX:'';
        }
      },
      target:{
        update:function(element, progress, ctrl) {
          element[0].style['transform'] = progress>0?'translateX('+(-progress / 100 * ctrl.options.distance)+'px)'+TRANSLATEZ_SUFFIX:'';
        }
      }
    },
    right:{
      canBegin: function(element, options) {
        return Math.floor(element.prop('scrollLeft')) === 0;
      },
      distance: function(newEvent, oldEvent) {
        return newEvent.clientX - oldEvent.clientX;
      },
      container:{
        prepare:function(element, ctrl) {
          element.children()[0].style.width = ctrl.options.distance + 'px';
        },
        update:function(element, progress, ctrl) {
          element[0].style['transform'] = progress>0?'translateX('+(progress / 100 * ctrl.options.distance)+'px)'+TRANSLATEZ_SUFFIX:'';
        }
      },
      target:{
        update:function(element, progress, ctrl) {
          element[0].style['transform'] = progress>0?'translateX('+(progress / 100 * ctrl.options.distance)+'px)'+TRANSLATEZ_SUFFIX:'';
        }
      }
    }
  };

  function PullService($$rAF) {
    this.$factories = FACTORIES;
    this.$$rAF = $$rAF;
  }

  PullService.prototype.getFactory = function(direction) {
    return FACTORIES[direction];
  }
  // taken from angular material: https://github.com/angular/material/blob/67e50f6e51b3e0282c086d9bb7760661c8135bbf/src/core/core.js
  PullService.prototype.invokeOncePerFrame = function(cb) {
    var queuedArgs, alreadyQueued, queueCb, context, self;
    self = this;
    return function debounced() {
      queuedArgs = arguments;
      context = this;
      queueCb = cb;
      if (!alreadyQueued) {
        alreadyQueued = true;
        self.$$rAF(function() {
          queueCb.apply(context, Array.prototype.slice.call(queuedArgs));
          alreadyQueued = false;
        });
      }
    };
  };
  // The name of the module, followed by its dependencies (at the bottom to facilitate enclosure)
}(angular.module("ngPullService", [])));

"use strict";
/**
 * Each module has a <moduleName>.module.js file.  This file contains the angular module declaration -
 * angular.module("moduleName", []);
 * The build system ensures that all the *.module.js files get included prior to any other .js files, which
 * ensures that all module declarations occur before any module references.
 */
(function (module) {
  var EVENTS = {
    start:'mousedown touchstart',
    move:'mousemove touchmove',
    end: 'mouseup touchend'
  };
  var NO_SELECT_CLASS = 'no-select';

  module.directive('onPullDown', ['ngPullService', '$window', '$document', getDirective('down')]);
  module.directive('onPullUp', ['ngPullService', '$window', '$document', getDirective('up')]);
  module.directive('onPullLeft', ['ngPullService', '$window', '$document', getDirective('left')]);
  module.directive('onPullRight', ['ngPullService', '$window', '$document', getDirective('right')]);

  function getDirective(direction) {
    //var directiveName = "on-pull-"+direction;
    var activeClassName = "pull-"+direction+'-active';
    var capitalizedDirection = direction[0].toUpperCase() + direction.slice(1);
    var defaultOptions = {
      Distance: 100,
      Progress:'$pull' + capitalizedDirection + 'Progress',
      Timeout:300,
      Threshold: 5,
      Disabled: false,
      Reset: '$pull'+capitalizedDirection+'Reset'
    };
    return OnPullDirective;

    function OnPullDirective(pullService, $window, $document){
        var progress = 0;
        var initialEvent;
        var factory = pullService.getFactory(direction);
        return {
          controller: controller,
          link: link
        };
        function controller(){
          this.queue = [];
        }

        function link(scope, element, attr, ctrl) {
          var options = normalizeOptions(attr);
          var eventTarget = angular.element($window);
          var selectionTarget = $document.find('body');
          var startTime;
          var wasMoreThanThreshold;
          var deferredUpdate = pullService.invokeOncePerFrame(updateOncePerFrame);
          ctrl.options = options;
          ctrl.suspended = false;
          ctrl.queue.forEach(function(fn) {
            fn(factory);
          });
          scope.$eval(options.reset+'=value',{value:revertProgress});
          if(attr['pull'+capitalizedDirection+'Disabled']){
            scope.$watch(options.disabled, function(disabled){
              if (disabled) {
                element.off(EVENTS.start, pointerDown);
                if (ctrl.suspended) {
                  revertProgress();
                }
              } else {
                element.on(EVENTS.start, pointerDown);
              }
            });
          } else {
            element.on(EVENTS.start, pointerDown);
          }

          function pointerDown(ev) {
            if((ev.which === 1 || ev.which === 0) && !ctrl.suspended && factory.canBegin(element, options) ) {
              eventTarget.on(EVENTS.move, pointerMove);
              eventTarget.on(EVENTS.end, pointerUp);
              initialEvent = normalizeEvent(ev);
              startTime = Date.now();
              ctrl.suspended = true;
              wasMoreThanThreshold = false;
            }
          }

          function pointerMove(ev){
            var percent = factory.distance(normalizeEvent(ev), initialEvent) * 100.0 / (1.0 * options.distance);
            // cancel intention if user drags below certain threshold until timeout
            if(percent <= options.threshold && Date.now() - startTime > options.timeout && !wasMoreThanThreshold){
              eventTarget.off(EVENTS.move, pointerMove);
              eventTarget.off(EVENTS.end, pointerUp);
              ctrl.suspended = false;
              percent = 0;
            }
            // if user pulled more than threshold, gesture should not be canceled when value becomes less than threshold
            if (percent > options.threshold) {
              wasMoreThanThreshold = true;
              if (direction == 'up' || direction ==='down') {
                ev.preventDefault();
              }
              ev.stopPropagation();
            }
            deferredUpdate(percent);
          }
          function updateOncePerFrame(percent) {
            if (percent < 0) {
              percent = 0;
            }
            if (percent > 100) {
              percent = 100;
            }
            if (percent > 0) {
              element.addClass(activeClassName);
              selectionTarget.addClass(NO_SELECT_CLASS);
            } else {
              element.removeClass(activeClassName);
              selectionTarget.removeClass(NO_SELECT_CLASS);
            }
            scope.$eval(options.progress+'=value',{
              value: percent
            });
            // special case for up
            if(direction === 'up'){
              element.prop('paddingBottom', options.progress*options.distance+'px');
              element.prop('scrollTop',element.prop('scrollTop')+options.distance);
            }
            // special case for right
            if(direction === 'right'){
              element.prop('scrollLeft',element.prop('scrollLeft')+options.distance);
            }
            scope.$apply();

          }

          function pointerUp(ev){
            eventTarget.off(EVENTS.move, pointerMove);
            eventTarget.off(EVENTS.end, pointerUp);
            // execute expression and depending on its outcome revert progress
            // no expression = always revert progress when gesture is done
            if(options.expression && scope.$eval(options.progress)>=100){
                if(scope.$eval(options.expression, {$reset:revertProgress})!==false) {
                  revertProgress();
                }
            } else {
              revertProgress();
            }
          }
          function revertProgress() {
              // always call updateOncePerFrame on next frame,
              // defferedUpdate will ignore the call if one is already queued
              pullService.$$rAF(function() {
                updateOncePerFrame(0);
              })
              ctrl.suspended = false;
          }

        }
    }

    function normalizeOptions(attr) {
      var options = {};
      for(var key in defaultOptions){
        options[key.toLowerCase()] = attr['pull'+capitalizedDirection+key] || defaultOptions[key];
      }
      options.expression = attr['onPull'+capitalizedDirection];
      options.timeout *= 1;
      options.distance *= 1;
      options.threshold *= 1;
      return options;
    }

    function normalizeEvent(ev) {
      // jquery
      if(ev.originalEvent){
        ev = ev.originalEvent;
      }
      if(ev.touches){
        ev.clientX = ev.touches[0].clientX;
        ev.clientY = ev.touches[0].clientY;
      }
      return ev;
    }
  }

  // The name of the module, followed by its dependencies (at the bottom to facilitate enclosure)
}(angular.module("ngOnPull",[])));

"use strict";
/**
 * Each module has a <moduleName>.module.js file.  This file contains the angular module declaration -
 * angular.module("moduleName", []);
 * The build system ensures that all the *.module.js files get included prior to any other .js files, which
 * ensures that all module declarations occur before any module references.
 */
(function (module) {

  module.directive('pullDownContainer', ['ngPullService', getDirective('down')]);
  module.directive('pullUpContainer', ['ngPullService', getDirective('up')]);
  module.directive('pullLeftContainer', ['ngPullService', getDirective('left')]);
  module.directive('pullRightContainer', ['ngPullService', getDirective('right')]);

  function getDirective(direction) {
    var capitalizedDirection = direction[0].toUpperCase() + direction.slice(1);

    return PulledContainer;

    function PulledContainer(pullService){
        var factory = pullService.getFactory(direction);
        return {
          require:'^onPull'+capitalizedDirection,
          link:{post:link},
          transclude:true,
          template:'<div ng-transclude></div>'
        };

        function link(scope, element, attr, pullCtrl) {
          pullCtrl.queue.push(function( ){
            element.addClass('pull-'+direction+'-container');
            factory.container.prepare(element, pullCtrl);
            scope.$watch(pullCtrl.options.progress, function(newValue) {
              factory.container.update(element, newValue, pullCtrl);
            });
          });
        }
    }
  }
    // The name of the module, followed by its dependencies (at the bottom to facilitate enclosure)
}(angular.module("ngPullContainer",[])));

"use strict";
/**
 * Each module has a <moduleName>.module.js file.  This file contains the angular module declaration -
 * angular.module("moduleName", []);
 * The build system ensures that all the *.module.js files get included prior to any other .js files, which
 * ensures that all module declarations occur before any module references.
 */
(function (module) {

  module.directive('pullTarget',['ngPullService', PullTarget])

  function PullTarget(pullService) {
    return {
      require:['?^onPullLeft','?^onPullRight', '?^onPullDown','?^onPullUp'],
      link: link
    };

    function link(scope, element, attr, controllers) {
      element.addClass('pull-target');
      // go throught each possible controller, wait until directive is ready and create watcher that will update DOM element
      controllers.forEach(function(pullCtrl, index){
        if(pullCtrl){
          pullCtrl.queue.push(function(factory){
            scope.$watch(pullCtrl.options.progress, function(newValue) {
              factory.target.update(element, newValue, pullCtrl);
            })
          });
        }
      });
    }
  }
    // The name of the module, followed by its dependencies (at the bottom to facilitate enclosure)
}(angular.module("ngPullTarget",[])));
