(function($) {
    $(document).ready(function() {

        $('.feature_slider').owlCarousel({
            loop: true,
            margin: 30,
            autoplay: false,
            autoplayTimeout: 3000,
            nav: false,
            dots: true,
            responsive: {
                0: {
                    items: 1
                },
                600: {
                    items: 2
                },
                1000: {
                    items: 3
                }
            }
        });

        $('.cat_slider').owlCarousel({
            loop: true,
            margin: 25,
            autoplay: true,
            autoplayTimeout: 2500,
            nav: false,
            dots: true,
            responsive: {
                0: {
                    items: 1
                },
                600: {
                    items: 3
                },
                1000: {
                    items: 4
                }
            }
        });

        $('.gridpost_slider').owlCarousel({
            loop: true,
            margin: 25,
            autoplay: false,
            autoplayTimeout: 2500,
            nav: false,
            dots: true,
            responsive: {
                0: {
                    margin: 8,
                    items: 2
                },
                600: {
                    items: 2
                },
                1000: {
                    items: 4
                }
            }
        });

    });
})(jQuery);