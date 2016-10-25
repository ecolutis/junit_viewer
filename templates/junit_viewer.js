$(function(){
    $('.btdetail').click(function (e) {
       var parent = $(this).parent();
       var content = parent.find('.suite-contents');
       content.toggleClass('hide');
       parent.find('.btdetail').text(content.hasClass('hide') ? '+' : '-');
       e.preventDefault();
    });

    $('.bt-filter-all').click(function (e) {
        $('.action-group .btn').removeClass('btn-primary').addClass('btn-default');
        $(this).removeClass('btn-default').addClass('btn-primary');
        $('.suite').removeClass('hide');
        e.preventDefault();
    });

    $('.bt-filter-success').click(function (e) {
        $('.action-group .btn').removeClass('btn-primary').addClass('btn-default');
        $(this).removeClass('btn-default').addClass('btn-primary');

        $('.suite').addClass('hide');
        $('.suite-passed').removeClass('hide');
        e.preventDefault();
    });

    $('.bt-filter-failure').click(function (e) {
        $('.action-group .btn').removeClass('btn-primary').addClass('btn-default');
        $(this).removeClass('btn-default').addClass('btn-primary');

        $('.suite').addClass('hide');
        $('.suite-failure').removeClass('hide');
        e.preventDefault();
    });

    $('.bt-filter-skipped').click(function (e) {
        $('.action-group .btn').removeClass('btn-primary').addClass('btn-default');
        $(this).removeClass('btn-default').addClass('btn-primary');

        $('.suite').addClass('hide');
        $('.suite-skipped').removeClass('hide');
        e.preventDefault();
    });
});