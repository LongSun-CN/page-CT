$(function () {
    /**
     * top collapse
     * $(selector).mouseenter(handlerIn).mouseleave(handlerOut);
     */
    $(document).on("mouseenter", ".top-collapse .main-header", function () {
        $('.main-sidebar').addClass('main-sidebar-expand');
        $('.control-sidebar').addClass('control-sidebar-expand');
        $('.content-header').addClass('content-header-expand');
        $('.content.no-header').addClass('no-header-expand');
    });

    /**
     * top collapse
     * $(selector).mouseenter(handlerIn).mouseleave(handlerOut);
     */
    $(document).on("mouseleave", ".top-collapse .main-header", function () {
        $('.main-sidebar').removeClass('main-sidebar-expand');
        $('.control-sidebar').removeClass('control-sidebar-expand');
        $('.content-header').removeClass('content-header-expand');
        $('.content.no-header').removeClass('no-header-expand');
    });

    if (window.screenfull && window.screenfull.enabled) {
        window.screenfull.on('change', function () {
            if (window.screenfull.isFullscreen) {
                $('body').addClass('top-collapse');
            } else {
                $('body').removeClass('top-collapse');
            }
        });
    }

});