setTimeout(page_live_check, 1000); //page_load_checkを実行する


setTimeout(add_setting_menu, 1000);

chrome.storage.sync.get("menu_set", function(value) {
    menu_set = value.menu_set;
    if (menu_set == null) {
        menu_set = [0, true, true, true, true, true]
    }
});


function add_setting_menu() {
    if ($('ytd-guide-collapsible-section-entry-renderer.style-scope.ytd-guide-section-renderer').html() == null) {
        setTimeout(add_setting_menu, 1000);
    } else {
        $('ytd-guide-collapsible-section-entry-renderer.style-scope.ytd-guide-section-renderer').before(
            '<div class="menu-btn" title="「YouTubeライブを快適に視聴する！！！」の設定">' +
            '<div class="menu-btn-text">' +
            '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-settings"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg>' +
            '<div class="text">拡張機能の設定</div>' +
            '</div></div>' +
            '<div id="menu-setting">' +
            '<p><label for="menu-setting1">配信グラフの表示機能</label><input type="checkbox" id="menu-setting1"></p>' +
            '<p><label for="menu-setting2">モデレーターメッセージのピックアップ機能</label><input type="checkbox" id="menu-setting2"></p>' +
            '<p><label for="menu-setting3">コメント欄のタイムスタンプのインポート機能</label><input type="checkbox" id="menu-setting3"></p>' +
            '<p><label for="menu-setting4">概要欄にtwitterを埋め込む機能</label><input type="checkbox" id="menu-setting4"></p>' +
            '<p><label for="menu-setting5">登録チャンネルの検索機能</splabelan><input type="checkbox" id="menu-setting5"></p>' +
            '<p>ページをリロードすると反映します</p>' +
            '<button type="button" style="margin:10px 10px 0 0;" id="menu-save">設定を保存</button>' +
            '<a style="margin:2px;text-decoration:none;" href="https://blog.yuki0311.com/youtube-feature-rich-2/"  target="_blank" >詳しくはこちら</a>' +
            '</div>'
        );

        canvas_flag['main_setting'] = false;
        $("#menu-setting").css({
            "height": "0px",
            "opacity": "0"
        });
        $('.menu-btn').click(function() {

            if (canvas_flag['main_setting']) {
                canvas_flag['main_setting'] = false;
                $("#menu-setting").animate({
                    "height": "0px",
                    "opacity": "0"
                }, 500);

                setTimeout(function() {
                    $("#menu-setting").css({
                        "display": "none"
                    });
                }, 500);

            } else {
                canvas_flag['main_setting'] = true;
                $("#menu-setting").animate({
                    "height": "250px",
                    "opacity": "1"
                }, 500);
                $("#menu-setting").css({
                    "display": "block"
                });
            }

            let i = 1;
            while (i <= 5) {
                $('#menu-setting' + i).prop('checked', menu_set[i]);
                i++;
            }

            $('#menu-save').click(function() {
                let i = 1;
                while (i <= 5) {
                    menu_set[i] = $('#menu-setting' + i).prop('checked');
                    i++;
                }
                chrome.storage.sync.set({
                    'menu_set': menu_set
                });
                $('#menu-save').text('設定を保存しました');
                setTimeout(
                    function() {
                        $('#menu-save').text('設定を保存する')
                    }, 1000);
            });
        });
    }
}
/*動画の以外のページのときの処理*/
function page_live_check() {
    if (location.href.match(/watch/)) {
        setTimeout(page_load_check_watch, 500);
        return;
    } else if (location.href.match(/subscriptions/)) {
        setTimeout(page_load_check_subscriptions, 500);
        return;
    }
    setTimeout(page_live_check, 500);
}


/*初期値 */
var view_count_plus_num = 0,
    chart_num = 0,
    view_count_plus_list = [],
    config = {},
    cash_url, main_loop_count_num = 0;
var message_count = 0,
    last_get_message_id, superchat_count = 0,
    last_get_superchat_id, last_moderator_id;
var canvas_flag = {},
    canvas_height = {},
    canvas_type = {},
    canvas_wait = {
        "max": {},
        "count": {}
    },
    content_text_length, video_now_time_count, video_time_get_last;
var set_change_wait_num, set_change_theme, set_change_borderColor;
var one_time_flag = false;
cash_url = location.href;


var menu_set = [];
var storage_check_flag;

var reg = /^(\D*)([\d,.]*)/
var canvas_type;
var canvas_wait = {
    "max": {
        "": 1,
        "2": 1,
        "3": 1,
        "4": 1,
        "5": 1,
    },
    "count": {
        "": 0,
        "2": 0,
        "3": 0,
        "4": 0,
        "5": 0,
    }
};