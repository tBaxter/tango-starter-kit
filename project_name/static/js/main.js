/*jslint browser: true*/
/*global  $*/
/*global  Modernizr*/

var $top_assets  = $('#top_assets'),
  didScroll    = false,
  touchable    = Modernizr.touch;

// Ugly IE8 hack to force getComputedStyle.
if (!window.getComputedStyle) {
  window.getComputedStyle = function(el, pseudo) {
    this.el = el;
    this.getPropertyValue = function(prop) {
        var re = /(\-([a-z]){1})/g;
        if (prop == 'float') prop = 'styleFloat';
        if (re.test(prop)) {
            prop = prop.replace(re, function () {
                return arguments[2].toUpperCase();
            });
        }
        return el.currentStyle[prop] ? el.currentStyle[prop] : null;
    };
    return this;
  };
}

var screenSize = window.getComputedStyle(document.body, ':after').getPropertyValue('content');


// Reliably get window position.
function getYOffset() {
  "use strict";
  var pageY;
  if (typeof (window.pageYOffset) === 'number') {
    pageY = window.pageYOffset;
  } else {
    pageY = document.documentElement.scrollTop;
  }
  return pageY;
}

/*************
// Simple trigger handling.
// Takes hash from trigger link and toggles the object.
// Example: <a href="#foo" class='trigger'>
// would automatically hide the #foo element, then toggle it onclick.
// Also allows child selectors:
//    <a href="#foo>ul" class="trigger">
//    <a href="#foo>.bar" class="trigger">
// Note that the child selector does not have to be a direct descendant.
// It will toggle any matching children of the main selector.
********************************/
$('a.trigger').each(function() {
  "use strict";
  var hash = this.hash,
      $this = $(this);

  if (hash.split(">").length > 1) {
    if (document.width > 1000) {
      hash = hash.split(">")[0] + ' ' + hash.split(">")[1];
    } else {
      hash = hash.split(">")[0];
    }
  }
  $(hash).hide();
  $this.on('click', function(e) {
    $(hash).toggle();
    $this.toggleClass('activated');
    e.preventDefault();
  });
});

// Simple URL jumpbox
$(document).on('change', '.url-selector', function(e) {
  "use strict";
  window.location = $(this).val();
});

// Allows deferred loading of images.
// Parent element must have data-deferred-load=" <src>"
function load_images() {
  "use strict";
  $('*[data-deferred-load]').each(function() {
    if ($(this).find('img').length === 0) {
      $(this).prepend(function() {
        var hash = $(this).data('deferred-load'),
          img = document.createElement('img');
        img.src = hash;
        return img;
      });
    }
  });
}
load_images();


/* tabs can be used two ways:
  With inside navigation:
    container.tabs
      ul
      tab block
      tab block
  or with remote navigation
    ul.remote_tabs_tabbed.nav(anywhere on the page
    container.tabs
      tab block
      tab block
  
  within ul, a.active denotes active tab.
  If no active tab is set, the first will be the default.

  A tab block can be any block level element other than a UL, so div, article, section, etc will all work.
  UL is reserved for nav. If you need a UL, wrap it.

  tabit respects page hash, so foo.com/#bar
  will go to the #bar tab
  
  You must set the container class to .tabs.
  When tabs are activated, it will be given the class .tabbed,
  so you can style it appropriately and only style blocks that have been tabbed.
  
  And remember to call tabit()
 */
function tabit() {
  "use strict";
  $('.tabs').each(function() {
    //console.log('tabbing');
    var tabbed       = $(this),
      active       = '',
      nav_height   = 0;

    tabbed.addClass('tabbed');
    tabbed.sections  = tabbed.find('> *').not('ul');
    tabbed.nav       = tabbed.find('> ul');
    nav_height       = tabbed.nav.height();

    if (tabbed.nav.length === 0) {
      tabbed.nav = $('.remote-tabs-nav');
      nav_height = 0;
    }
    if (!tabbed.nav) {
      //console.log('could not find tab nav!');
      return;
    }
    tabbed.navitems = tabbed.nav.find('li');

    if (window.location.hash) {
      active = window.location.hash.replace('-view', '');
      if (tabbed.nav) {
        tabbed.navitems.removeClass('active');
        tabbed.nav.find('a[href=' + active + ']').parent().addClass('active');
      }
    } else { // no hash available. check if one was pre-defined.
      active = tabbed.nav.find('li.active a').hash;
      if (!active) { // or set it to first item
        active = tabbed.navitems.eq(0).addClass('active').find('a').get(0).hash;
      }
    }
    $(active).addClass('activeTab');

    tabbed.nav.find('a:not(.no-tab)').click(function(e) {
      e.preventDefault();
      var target          = this.hash,
        tabbed_sections = $(target).parent().find('> *').not('ul'),
        parent = $(this).parent(),
        navitems = parent.parent().find('li');

      window.location.hash = target + '-view';
      parent.addClass('active');

      $(navitems).not(parent).removeClass('active');
      $(target).addClass('activeTab');
      // ensure the container height will be at least the target height...
      // it'll make the css much easier
      tabbed.css('min-height', $(target).height() + nav_height + 'px');
      tabbed_sections.not(target).removeClass('activeTab');
    });
  });
}
tabit();

// Post admin
$(document).on('click', '.post-admin a', function() {
  "use strict";
  var $command = $(this),
    confirm_msg = $command.data('confirm');
  if (confirm_msg) {
    if (confirm_msg === 'use_title') {
      confirm_msg = $command.attr('title');
    }
    return confirm(confirm_msg);
  }
});

// Voting
$(document).on('click touchend', 'a[href*="/vote/"]', function(e) {
  "use strict";
  e.preventDefault();
  var container = $(this).parent().find('.votes');
  $.post(
    this.href,
    {csrfmiddlewaretoken: $('input[name|="csrfmiddlewaretoken"]').attr('value')},
    function(json) {
      var score = json.score.score;
      if (score < 1) {
        score = 'Noted';
      }
      container.html(score + ' ✓');
    },
    'json'
  );
});

// Toxic post toggle
$('#comment-list article.toxic header').each(function() {
  var $this = $(this);
  $this.append('<em class="note toxic-message">This comment has been collapsed</em>');
  $this.click(function(){
    console.log('registered click');
    var $parent = $(this).parent();
    $parent.toggleClass('toxic');
    //$parent.find('section').slideToggle('fast');
  });
});

if ($top_assets.length > 0) {
  // functions specific to pages with top assets.
  // note this is after the tabit() call, so it calculates
  // based on tabbed top asset height, not default.
  // create preview tooltips in story detail top assets
  $top_assets.find('.tabbed ul li a:not(.no-tab)').each(function() {
    "use strict";
    var img = $(this.hash).find('img').eq(0),
      preview = '<span class="preview"><img src="' + $(img).attr('src') + '"></span>';
    if ($(img).size() === 0) {
      img = $(this.hash).first('object');
      preview = '<span class="preview">' + $(this).attr('title') + '</span>';
    }
    $(this).append(preview);
  });
  $top_assets.find('.tabbed ul li').hover(function() {
    "use strict";
    $(this).find('.preview').toggle();
  });
}

// pickadate.js
$('.datepicker').pickadate();


if (screenSize === 'small' || screenSize === 'x-small') {
  var $header = $('#header');
  $header.style.position = 'fixed';
  $('body').style.paddingTop = $header.outerHeight();
}
