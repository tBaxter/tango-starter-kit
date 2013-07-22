/***********************************************
* Stickit allows for multiple sticky elements,
* allows them be combined with a sticky header,
* allows for expanding/collapsing header navigation,
* and prevents overflow of the sticky element to the
* header or footer.
*
* The sticky sidebar functionality is heavily based on
* stickymojo.js: http://mojotech.github.com/stickymojo/
* If that's all you need, then it's probably better.
*
* If using a collapsing header,
* hide/show content in the nav based on body.collapsed
*
* Initialization:
* Pass a class name for the elements you want to be sticky,
* along with some variables:
*
* $(window).load(function() {
    $('.sticky').stickit({
    footer:  '#footer',
    header:  '#header'
  });
});

* additional settings:
* - stickHeader: false      (if header should not stick)
* - collapseHeader: false   (no collapsing will be done)

* Relies on getYOffset from main.js.
if not in place, add this:

// Reliably get window position.
function getYOffset() {
  var pageY;
  if(typeof(window.pageYOffset) === 'number') {
     pageY=window.pageYOffset;
  }
  else {
     pageY=document.documentElement.scrollTop;
  }
  return pageY;
}

**************************************************/

//(function($) {
  $.fn.extend({
    stickit: function(options) {
      var $stickyElements = $(this);
      if (!$stickyElements) {
        return;
      }
      var settings = $.extend({
        'stickHeader': true,
        'collapseHeader': true,
        'header':  '#masthead',
        'footer':  '#footer',
        'user_collapse_pref': true
      }, options);

      var limits,
          winPos,
          $win          = $(window),
          $body         = $('body'),
          $header       = $(settings.header),
          $firstContent = $header.next(),
          defaultHeaderOffset  = Math.max($firstContent.offset().top, $header.outerHeight()),
          stickPoint    = 0,
          $footer       = $(settings.footer);

      // if we're sticking the header, make sure it's stuck.
      if (settings.stickHeader) {
        $header.css('position', 'fixed');
        $body.css('padding-top', defaultHeaderOffset);
      }

      // if we're collapsing the header, do we need to collapse it on init.
      if (settings.collapseHeader) {
        var collapsed = $body.hasClass('collapsed');
        $body.css('min-height', $win.height());

        if (collapsed || settings.user_collapse_pref) {
          collapseHeader();
          if (settings.user_collapse_pref) {
            defaultHeaderOffset = Math.max($firstContent.offset().top, $header.outerHeight());
            stickPoint = defaultHeaderOffset * 2;
          }
        }
        // Init nav menu trigger expand/collapse
        $header.find('#menu-trigger').on('click', function(e){
          if (collapsed === true) {
            window.scrollTo(0, 0);
            unCollapseHeader();
          } else {
            collapseHeader();
          }
          e.preventDefault();
        });
      }

      // Header helpers
      function collapseHeader() {
        collapsed = true;
        $body.addClass('collapsed');
        stickPoint = defaultHeaderOffset - $header.outerHeight();
      }
      function unCollapseHeader() {
        collapsed = false;
        $body.removeClass('collapsed');
        stickPoint = defaultHeaderOffset - $header.outerHeight();
      }

      // Init sticky elements
      $stickyElements.each(function() {
        this.parent = $(this).parent();
        this.parent.css('position', 'relative');
        this.topPos = $(this).position().top;
      });

      // on scroll, does anything need to change?
      function checkForChanges() {
        winPos = getYOffset();

        if (settings.collapseHeader && !settings.user_collapse_pref) {
          if (collapsed === false && winPos > (defaultHeaderOffset * 0.3)) {
            collapseHeader();
          } else if (collapsed === true && winPos < (defaultHeaderOffset * 0.3)) {
            unCollapseHeader();
          }
        }

        // if we're in position to have sticky sidebar elements...
        if (winPos === 0 || winPos > defaultHeaderOffset ) {
          $stickyElements.each(function() {
            this.stickPoint = stickPoint + this.topPos;
            if ($win.width() >= 980) {
              limits = calculateLimits(this);
              setFixedSidebar(this, winPos, limits);
            }
            if (winPos < this.stickPoint) {
              $(this).css('position', 'static');
            }
          });
        }
      }

      //  Calculates the limits top and bottom limits for the sidebar
      function calculateLimits(elem) {
        return {
          lowerLimit: $footer.position().top - $(elem).outerHeight(true) - 20,
          upperLimit: stickPoint - $header.outerHeight()
        };
      }

      function setFixedSidebar(elem, winPos, limits) {
        $this = $(elem);
        if (limits.lowerLimit < (winPos + $header.outerHeight())) {
          $this.css({
            top: - winPos + limits.lowerLimit // avoid overlap with footer
          });
        } else {
          $this.css({
            position: 'fixed',
            top: limits.upperLimit, // avoid overlap with header
            width: $this.parent().width()
          });
        }
      }

      // Listen for window scroll and check for changes.
      $win.bind({
        'scroll': checkForChanges,
        'resize': checkForChanges
      });
    }
  });
//})(jQuery);
