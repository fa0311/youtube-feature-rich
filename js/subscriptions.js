function page_load_check_subscriptions() {

    if ($('span#title').text()) {
        subscriptions_main_loop();
        subscriptions_main_set();
        return;
    }
    if (cash_url == location.href) {
        cash_url = location.href;
        setTimeout(subscriptions_reset);
        setTimeout(page_live_check); //ページがwatchになったらpage_load_checkを実行する
        return;
    }
    setTimeout(page_load_check_subscriptions, 300);
}




function subscriptions_main_loop() {
    /*urlチェック*/
    if (cash_url == location.href) {
        subscriptions_video_search();
    } else {
        /*ページがリロードされたなら */
        cash_url = location.href;
        setTimeout(subscriptions_reset);
        setTimeout(page_live_check); //ページがwatchになったらpage_load_checkを実行する
        return;
    }
    setTimeout(subscriptions_main_loop, 500);
}


function subscriptions_main_set() {
    if (!menu_set[5]) {
        return;
    }
    $('h2.style-scope.ytd-shelf-renderer').eq(0).after(
        '<div id="search-box">' +
        '<div id="search-form" class="style-scope ytd-searchbox">' +
        '<div id="container" class="style-scope ytd-searchbox">' +
        '<div id="search-input" class="ytd-searchbox-spt" slot="search-input">' +
        '<input id="_search" class="search_text" placeholder="検索"></div>' +
        '<div id="search-container" class="ytd-searchbox-spt" slot="search-container"></div>' +
        '</div>' +
        '<button id="search-icon-legacy" class="style-scope ytd-searchbox video-search-btn" aria-label="検索">' +
        '<p>検索</p>' +
        '</button>' +
        '</div>');

    $('.video-search-btn').click(function() {
        search_text = $('.search_text').val();
        video_title_length_1 = 0;
        video_title_length_2 = 0;
        subscriptions_video_search();
    });
}

var search_text = "";
var video_title_length = 0;

function subscriptions_video_search() {
    if (!menu_set[5]) {
        return;
    }
    if (search_text != "") {
        while ($("a#video-title").length > video_title_length) {
            if ($("a#video-title").eq(video_title_length).text().indexOf(search_text) != -1) {
                $("a#video-title").eq(video_title_length).parents("ytd-grid-video-renderer.style-scope.ytd-grid-renderer").css('display', 'block');
            } else {
                $("a#video-title").eq(video_title_length).parents("ytd-grid-video-renderer.style-scope.ytd-grid-renderer").css('display', 'none');
            }
            video_title_length++;
        }
    }
}

function subscriptions_reset() {
    $("#search-box").remove();
    search_text = "";
}