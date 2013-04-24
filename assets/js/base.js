/*      ------------------------------------------------------

        Base.js

        The master JS file.

        Written by Joey Emery.

        Contents:
                --- Document ready
                --- Latest Commit
                --- Mobile Navigation
                --- Resizer

------------------------------------------------------ */

/* ---          Latest Commit           --- */
var LatestCommit = {
        location: false,

        init: function(location) {
                if($('#latest_commit').length > 0) {
                        this.location = location;
                        this.getLatestCommit();
                }
        },

        getLatestCommit: function() {
                $.get(this.location, function(data) {
                        var commit = data[0];

                        $('#latest_commit #post_info a:first span:last').text(commit.commit.author.name);
                        $('#latest_commit #post_info a:last span:last').text($.timeago(commit.commit.author.date));
                        $('#latest_commit p').text(commit.commit.message);
                        $('#latest_commit').removeClass('loading');
                }, 'json');
        }
}

/* ---          Mobile Navigation       --- */
var MobileNavigation = {
        distance:       '-250px',
        speed:          400,
        is_open:        false,

        /* Sets everything up and fires relevant methods */
        init: function() {
                $('#mini_nav').css('height', $('body').innerHeight());
                this.bind();
        },

        /* Toggle between open/close */
        toggle: function() {
                if(this.is_open) {
                        this.close();
                } else {
                        this.open();
                }
        },

        /* Opens the navigation */
        open: function() {
                $('#slide_wrapper').css('width', $('body').innerWidth());
                $('#mini_nav').css('display', 'block');

                $('#slide_wrapper').animate({
                        'margin-left'   :       this.distance
                }, this.speed, function() {
                        $('#mini_nav').css('z-index', 100);
                });
                this.is_open = true;
        },

        /* Closes the navation */
        close: function() {
                $('#mini_nav').css('z-index', 9);

                $('#slide_wrapper').animate({
                        'margin-left'   :       0
                }, this.speed, function() {
                        $('#slide_wrapper').css('width', 'auto');
                        $('#mini_nav').css('display', 'none');
                });
                this.is_open = false;
        },

        /* Bind elements to their relative methods */
        bind: function() {
                var instance = this;

                $('#header ul').on('click', 'li.show_menu a', function(e) {
                        e.preventDefault();
                        instance.toggle();
                });
        }
}

/* ---          Resizer         --- */
var Resizer = {
        width:          false,
        callback:       false,

        init: function(callback) {
                this.callback = (typeof callback == 'function') ? callback : false;
                this.calculate();
        },

        calculate: function() {
                this.width = $(window).width();
                var obj = this;
                $(window).resize(function(e) {
                        obj.width = $(window).width();

                        if(obj.callback)
                                obj.callback();
                });
        }
}

/* ---          Document Ready          --- */
$(document).ready(function() {
        // Controls the mobile navigation stack.
        MobileNavigation.init();

        // Get the stuff from Github.
        LatestCommit.init('https://api.github.com/repos/composer/composer/commits');

        // Resizer.
        Resizer.init(function() {
                if(MobileNavigation.is_open)
                        MobileNavigation.close();
        });

        // Time since something happened.
        $('.realtime_time').timeago();

        // Prettier scrolling.
        $('body').on('click', 'a.anchor, .toc li a', function(e) {
                e.preventDefault();

                $('body').animate({
                        'scrollTop': ($($(this).attr('href')).offset().top - 70)
                }, 1000);
        });
});
