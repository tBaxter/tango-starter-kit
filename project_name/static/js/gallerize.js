/***********************************************
* Gallerize creates responsive,
* mobile-friendly HTML5 photo galleries.
*
* It supports navigation by keyboard, previous/next buttons,
* thumbnails and clicking the current photo.
*
* There are several pre-requisites:
* - Modernizr
* - Swipe.js
* - Cycle
* - jcarousellite (if using thumbs)
*
***********************************************/

function gallerize() {
  var $photoset_photos = $('#photoset_slides > figure'),
      $photoset_thumbs = $('#photoset_thumbs li'),
      $photoset_next   = $('#photoset_info .next'),
      $photoset_prev   = $('#photoset_info .prev'),
      $caption_hold    = $('#caption_hold'),
      idx              = 0,
      photo_slider;

  if ($photoset_photos.size() < 2) {
    //console.log("photo count is < 2, aborting..." );
    return false;
  }

  // determine starting index by checking for a passed hash.
  if (window.location.hash && (window.location.hash.indexOf("slide-") !== -1)) {
    idx = $(window.location.hash.replace('slide-','image_')).index();
    $('#photoset_index').html(idx + 1);
  }

  //console.log('Have multiple photos. Starting to gallerize from index... ');
  //console.log(idx);
  //console.log('using... ');
  // Add tooltip on slides
  $photoset_photos.each(function() {
    $(this).attr('title','Click or swipe for next photo');
  });

  // Determine which gallery engine to use.
  if ( Modernizr.csstransforms ) {
    console.log('swipe.js. (csstransforms supported)');
    photo_slider = use_swipe();

    //console.log('slide callback is not auto-run on init, so...');
    slide_callback($photoset_photos.eq(idx));
    // then decrement idx, since we just effectively increased it.
    idx = idx - 1;
  } else {
    //console.log('cycle.js (no csstransforms)');
    photo_slider = use_cycle();
  }

  // helper function to load in images as needed
  // by default, only the first image is loaded.
  // This uploads the next img in the gallery, too.
  function load_img(slide) {
    if ($(slide).find('img').length === 0) {
      //console.log('loading img into next figure');
      $(slide).prepend('<img alt="" src="' + $(slide).attr('data-load-on-demand') + '">');
    }
  }

  // Post-slide functionality
  function slide_callback(slide) {
    //console.log('running slide callback for slide...')
    //console.log(slide);
    //console.log('loading deferred images');
    load_img(slide);
    load_img($(slide).next());

    // update caption
    //console.log('updating caption');
    var caption = $(slide).find('.caption').html();
    if ($caption_hold.html() !== caption) {
      $caption_hold.html(caption);
    }
    // update current slide count display
    //console.log('attempting to update slide id')
    //console.log($(slide).attr('id'))
    idx = $(slide).attr('id').replace('image_','');
    $('#photoset_index').html(idx);

    // if thumbs, update
    if ($photoset_thumbs) {
      $photoset_thumbs.removeClass('current');
      $photoset_thumbs.eq(idx).addClass('current');
    }
    // update Google analytics
    if (idx > 1) {
      if (typeof(_gaq) !== 'undefined'){
        _gaq.push(['_trackPageview']);
      }
    }
  } // end slide_callback

  // If the browser supports CSS transitions,
  // we're going to use them.
  function use_swipe() {
    //console.log('using swipe');
    var $slideHold = $('#photoset_slides_hold');
    var swipe_slider = new Swipe($slideHold.get(0), {
      startSlide: idx,
      speed:      400,
      callback:   function(event, index, elem) {
        slide_callback(index);
        if (index > 1) {
          var height =  index.find('img').height();
          $slideHold.height(height + 20);
        }
      }
    });
    return swipe_slider;
  }

  // if not, we'll fall back on jquery.cycle
  function use_cycle() {
    $('#photoset_slides').cycle({
      speed:              100,
      pause:              1,
      nowrap:             1,
      timeout:            0,
      startingSlide:      idx,
      slideResize:        0,
      fx:                 'scrollHorz',
      activePagerClass:   'current',
      prev:               $photoset_prev,
      next:               $photoset_next,
      pager:              $photoset_thumbs,
      pagerAnchorBuilder: function(idx, slide) {return 'ul#photoset_thumbs li:eq(' + idx + ') ';},
      before:             function(curr,next,opts) {slide_callback(next);}
    });
  }

  if ($photoset_photos.size() > 1) {
    // check for initial hash and set starting index (idx) accordingly

    // add a tooltip to slides
    

    // build thumbnails, if desired.
    // below 1000, we're not showing thumbs, as defined in css media query */
    if (Modernizr.touch === false && $(document).width() > 780 && $photoset_thumbs.length > 0) {
      $('*[data-deferred-thumbs]').prepend(function(){
        var hash = $(this).attr('data-deferred-thumbs');
        return '<img alt="" src="' + hash + '">';
      });
      // Help the thumby nav rotate
      $photoset_thumbs.jcarousel({
        scroll              : 1,
        visible             : 12,
        animation           : 200,
        itemFirstInCallback : function(carousel, item, idx, state) {
            $photoset_thumbs.find('li').removeClass('current');
            $(item).addClass('current');
        },
        setupCallback       : function() {
          $('#photoset_thumbs_hold').show();
        }
      });
      $photoset_thumbs = $photoset_thumbs.data('jcarousel');
    }

    // Event handling
    $photoset_next.click(function() {
      photo_slider.next();
      if ($photoset_thumbs) {
        $photoset_thumbs.next();
      }
    });
    $photoset_prev.click(function() {
      photo_slider.prev();
      if ($photoset_thumbs) {
        $photoset_thumbs.prev();
      }
    });
    // cycle on image click
    $photoset_photos.on('click touchend', function() {
      $photoset_next.click();
    });
    // cycle on key (arrow) press
    $(document).keydown(function(e){
      if(e.which === 37){
        $photoset_prev.click();
      }
      else if(e.which === 39){
        $photoset_next.click();
      }
    });
  }
} // end gallerize()

gallerize();
