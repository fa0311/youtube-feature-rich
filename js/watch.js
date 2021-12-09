function page_load_check_watch() {
    if ($('h1.title.style-scope.ytd-video-primary-info-renderer').text()) {
        get_storage();
        setTimeout(watch_main_loop, 200);
        return;
    }
    setTimeout(page_load_check_watch, 300);
}


function watch_main_loop() {
    /*urlチェック*/
    if (cash_url == location.href) {
        if ($('#chatframe').contents().length != 0) { //コメント欄があるなら
            main_loop_count_num++;
            if (main_loop_count_num >= get_wait_time() * 2) {
                main_loop_count_num = 0;
                setTimeout(watch_main);
            } else if (!one_time_flag) { // 最初なら
                setTimeout(watch_main);
            }
        } else { //コメント欄がないなら
            watch_normal_video();
        }
    } else {
        /*ページがリロードされたなら */
        cash_url = location.href;
        canvas_reset(); //すべてリセット
        setTimeout(page_live_check); //ページがwatchになったらpage_load_checkを実行する
        return;
    }
    setTimeout(watch_main_loop, 500);
    comment_view();
    comment_get();
}


/*通常動画 */
function watch_normal_video() {

    if (!one_time_flag) { // 最初なら
        one_time_flag = true;
        $('ytd-live-chat-frame#chat').after(
            '<div class="youtube_live_box">' +
            '<div class="canvas_btn" style="opacity:1" id="setting">設定</div>');
        setTimeout(twitter_view, 500);
        update_notify();
        setting_btn_set();
        if (set_change_theme == 1) {
            dark_theme(true);
        }
    }
}

/*メイン処理 */
function watch_main() {

    if (!menu_set[1]) {
        if (one_time_flag == false) {
            one_time_flag = true;
            setTimeout(twitter_view, 500);

            $('ytd-live-chat-frame#chat').after('<div class="youtube_live_box">' +
                '<div id="youtube_moderator_message">' +
                '</div>' +
                '</div>');
        }
        return;
    }
    /*Canvasの初期値 */


    function config_reset(label) {
        return {
            type: 'line',
            data: {
                labels: [],
                datasets: [{
                    label: label,
                    data: [],
                    borderColor: get_backgroundColor_code(),
                    backgroundColor: "rgba(0,0,0,0)"
                }],
            },
            options: {
                responsive: true,
                title: {
                    display: false,
                    text: 'youtubelive'
                },
                tooltips: {
                    mode: 'index',
                    intersect: false,
                },
                hover: {
                    mode: 'nearest',
                    intersect: true
                }
            }
        }
    }
    /*色々取得 */
    var view_count = $(".view-count").html();
    var like = $("a.yt-simple-endpoint.style-scope.ytd-toggle-button-renderer > yt-formatted-string#text").eq(0).html();
    var result = /(\d|,)+/.exec(view_count);
    /*5×12秒でリセット */
    if (view_count_plus_num >= 12) {
        view_count_plus_num = 0;
    }
    /*取得できてなかったら実行しない */
    if (result != null) {
        if (one_time_flag == false) {
            one_time_flag = true;
            /*1回のみ実行 */
            function btn_click_set(canvas_num) {
                $('#canvas_btn' + canvas_num).click(function() {
                    if (canvas_flag[canvas_num]) {
                        $.Deferred(function(deferredAnim) {
                            deferredAnim.then(function() {
                                $("#myLineChart" + canvas_num).animate({
                                    "height": canvas_height[canvas_num]
                                }, 500);
                                $("#canvas_btn" + canvas_num).animate({
                                    "opacity": "0.5"
                                }, 500);
                            })
                        }).resolve();
                        canvas_flag[canvas_num] = false;
                        setTimeout(function() {
                            $('#myLineChart' + canvas_num).removeClass('display_none');
                        });
                    } else {
                        canvas_height[canvas_num] = $("canvas#myLineChart" + canvas_num).height();
                        $.Deferred(function(deferredAnim) {
                            deferredAnim.then(function() {
                                $("#myLineChart" + canvas_num).animate({
                                    "height": "0"
                                }, 500);
                                $("#canvas_btn" + canvas_num).animate({
                                    "opacity": "1"
                                }, 500);
                            })
                        }).resolve();
                        canvas_flag[canvas_num] = true;
                        setTimeout(function() {
                            $('#myLineChart' + canvas_num).addClass('display_none');
                        }, 470);
                    }
                    chrome.storage.sync.set({
                        'canvas_btn': [canvas_flag, canvas_height]
                    });
                });
            }

            function set_chart_type_btn(id) {
                $('p#set_chart_type' + id).click(function() {
                    canvas_type["set"][id]++;
                    if (canvas_type["set"][id] > 2) {
                        canvas_type["set"][id] = 0;
                    }
                    $('span#set_chart_type' + id).html(get_chart_type(id));
                    chrome.storage.sync.set({
                        'chart_set': canvas_type
                    });
                });
            }

            function set_chart_time_btn(id) {
                $('p#set_chart_time' + id).click(function() {
                    canvas_type["num"][id]++;
                    if (canvas_type["num"][id] > 8) {
                        canvas_type["num"][id] = 0;
                    }

                    $('span#set_chart_time' + id).html(get_chart_time(id));
                    chrome.storage.sync.set({
                        'chart_set': canvas_type
                    });
                });
            }

            function view_chart(canvas_num) {
                if (canvas_flag[canvas_num]) {
                    $('#myLineChart' + canvas_num).addClass('display_none');
                    $("#canvas_btn" + canvas_num).css("opacity", "1");
                    $("#myLineChart" + canvas_num).css("height", "0");
                } else {
                    $('#myLineChart' + canvas_num).removeClass('display_none');
                    $("#canvas_btn" + canvas_num).css("opacity", "0.5");
                    $("#myLineChart" + canvas_num).css("height", canvas_height[canvas_num]);
                }
            }
            if (view_count.match(/回視聴/)) {
                /*もしラアーカイブなら */
                /*動画時間 */
                setTimeout(video_length_time_count);
                /*グラフ */
                $('ytd-live-chat-frame#chat').after(
                    '<div class="youtube_live_box">' +
                    '<div id="youtube_moderator_message">' +
                    '</div>' +
                    '<canvas id="myLineChart4"></canvas>' +
                    '<canvas id="myLineChart5"></canvas>' +
                    '<p>' +
                    '<div class="canvas_btn" style="opacity:0.5" id="canvas_btn4">コメント</div>' +
                    '<div class="canvas_btn" style="opacity:0.5" id="canvas_btn5">スパチャ</div>' +
                    '<div class="canvas_btn" style="opacity:1" id="setting">設定</div>' +
                    '<div class="canvas_btn" id="canvas_btn_del">消去</div>' +
                    '</p>' +
                    '<div id="setting_box" style="height:0px;opacity:0;">' +
                    '<p style="font-size:16px;">設定(クリックで変更可)</p>' +
                    '<div style="display:inline-block;vertical-align: top;padding-right: 15px">' +
                    '<p id="set_change_wait" style="font-size:13px;">グラフ更新間隔<span style="font-size:10px;">(現在<span id="set_numeber_wait">' +
                    get_wait_time() +
                    '</span>秒)</span></p>' +
                    '<p id="set_change_theme" style="font-size:13px;">テーマ<span style="font-size:10px;">(現在<span id="set_numeber_theme">' +
                    get_theme() +
                    '</span>)</span></p>' +
                    '<p id="set_change_border" style="font-size:13px;">ボーダー<span style="font-size:10px;">(現在<span id="set_numeber_border">' +
                    get_backgroundColor() +
                    '</span>)</span></p>' +
                    '<p id="storage_reset" style="font-size:13px;">リセット</p>' +
                    '<a style="margin:2px;text-decoration:none;" href="https://blog.yuki0311.com/youtube-feature-rich-2/"  target="_blank" >詳しくはこちら</a>' +
                    '</div>' +
                    '<div style="display:inline-block;vertical-align: top;padding-right: 15px">' +
                    '<p style="font-size:13px;">コメント</p>' +
                    '<p id="set_chart_type4" style="font-size:13px;">グラフモード<span style="font-size:10px;">(現在<span id="set_chart_type4">' +
                    get_chart_type("4") +
                    '</span>)</span></p>' +
                    '<p id="set_chart_time4" style="font-size:13px;">グラフ表示件数<span style="font-size:10px;">(現在<span id="set_chart_time4">' +
                    get_chart_time("4") +
                    '</span>件)</span></p>' +
                    '<p style="font-size:13px;">スパチャ</p>' +
                    '<p id="set_chart_type5" style="font-size:13px;">グラフモード<span style="font-size:10px;">(現在<span id="set_chart_type5">' +
                    get_chart_type("5") +
                    '</span>)</span></p>' +
                    '<p id="set_chart_time5" style="font-size:13px;">グラフ表示件数<span style="font-size:10px;">(現在<span id="set_chart_time5">' +
                    get_chart_time("5") +
                    '</span>件)</span></p>' +
                    '</div>' +
                    '</div>' +
                    '</div>');
                var ctx = document.getElementById("myLineChart4");
                config4 = config_reset("コメント");
                window.myLineChart4 = new Chart(ctx, config4);
                var ctx = document.getElementById("myLineChart5");
                config5 = config_reset("スパチャ");
                window.myLineChart5 = new Chart(ctx, config5);
                btn_click_set("4");
                btn_click_set("5");
                set_chart_type_btn("");
                set_chart_type_btn("2");
                set_chart_type_btn("4");
                set_chart_type_btn("5");
                set_chart_time_btn("");
                set_chart_time_btn("2");
                set_chart_time_btn("4");
                set_chart_time_btn("5");
                view_chart("4");
                view_chart("5");
                $('#canvas_btn_del').click(function() {
                    if ($(".youtube_live_box").html() != null) {
                        window.myLineChart4.destroy();
                        config4 = config_reset("コメント");
                        window.myLineChart4 = new Chart(document.getElementById("myLineChart4"), config4);
                        window.myLineChart5.destroy();
                        config5 = config_reset("スパチャ");
                        window.myLineChart5 = new Chart(document.getElementById("myLineChart5"), config5);
                    }
                });
            } else {
                /*配信なら */
                $('.view-count').append('<span id="view-count-plus"> • 処理中</span>');
                $('ytd-live-chat-frame#chat').after('<div class="youtube_live_box">' +
                    '<div id="youtube_moderator_message">' +
                    '</div>' +
                    '<canvas id="myLineChart"></canvas>' +
                    '<canvas id="myLineChart2"></canvas>' +
                    '<canvas id="myLineChart4"></canvas>' +
                    '<canvas id="myLineChart5"></canvas>' +
                    '<p>' +
                    '<div class="canvas_btn" style="opacity:0.5" id="canvas_btn">視聴数</div>' +
                    '<div class="canvas_btn" style="opacity:0.5" id="canvas_btn2">高評価</div>' +
                    '<div class="canvas_btn" style="opacity:0.5" id="canvas_btn4">コメント</div>' +
                    '<div class="canvas_btn" style="opacity:0.5" id="canvas_btn5">スパチャ</div>' +
                    '<div class="canvas_btn" style="opacity:1" id="setting">設定</div>' +
                    '<div class="canvas_btn" id="canvas_btn_del">消去</div>' +
                    '</p>' +
                    '<div id="setting_box" style="height:0px;opacity:0;">' +
                    '<p style="font-size:16px;">設定(クリックで変更可)</p>' +
                    '<div style="display:inline-block;vertical-align: top;padding-right: 15px">' +
                    '<p id="set_change_wait" style="font-size:13px;">グラフ更新間隔<span style="font-size:10px;">(現在<span id="set_numeber_wait">' +
                    get_wait_time() +
                    '</span>秒)</span></p>' +
                    '<p id="set_change_theme" style="font-size:13px;">テーマ<span style="font-size:10px;">(現在<span id="set_numeber_theme">' +
                    get_theme() +
                    '</span>)</span></p>' +
                    '<p id="set_change_border" style="font-size:13px;">ボーダー<span style="font-size:10px;">(現在<span id="set_numeber_border">' +
                    get_backgroundColor() +
                    '</span>)</span></p>' +
                    '<p id="storage_reset" style="font-size:13px;">リセット</p>' +
                    '<a style="margin:2px;text-decoration:none;" href="https://blog.yuki0311.com/youtube-feature-rich-2/"  target="_blank" >詳しくはこちら</a>' +
                    '</div>' +
                    '<div style="display:inline-block;vertical-align: top;padding-right: 15px">' +
                    '<p style="font-size:13px;">視聴数</p>' +
                    '<p id="set_chart_type" style="font-size:13px;">グラフモード<span style="font-size:10px;">(現在<span id="set_chart_type">' +
                    get_chart_type("") +
                    '</span>)</span></p>' +
                    '<p id="set_chart_time" style="font-size:13px;">グラフ表示件数<span style="font-size:10px;">(現在<span id="set_chart_time">' +
                    get_chart_time("") +
                    '</span>件)</span></p>' +
                    '<p style="font-size:13px;">高評価</p>' +
                    '<p id="set_chart_type2" style="font-size:13px;">グラフモード<span style="font-size:10px;">(現在<span id="set_chart_type2">' +
                    get_chart_type("2") +
                    '</span>)</span></p>' +
                    '<p id="set_chart_time2" style="font-size:13px;">グラフ表示件数<span style="font-size:10px;">(現在<span id="set_chart_time2">' +
                    get_chart_time("2") +
                    '</span>件)</span></p>' +
                    '<p style="font-size:13px;">コメント</p>' +
                    '<p id="set_chart_type4" style="font-size:13px;">グラフモード<span style="font-size:10px;">(現在<span id="set_chart_type4">' +
                    get_chart_type("4") +
                    '</span>)</span></p>' +
                    '<p id="set_chart_time4" style="font-size:13px;">グラフ表示件数<span style="font-size:10px;">(現在<span id="set_chart_time4">' +
                    get_chart_time("4") +
                    '</span>件)</span></p>' +
                    '<p style="font-size:13px;">スパチャ</p>' +
                    '<p id="set_chart_type5" style="font-size:13px;">グラフモード<span style="font-size:10px;">(現在<span id="set_chart_type5">' +
                    get_chart_type("5") +
                    '</span>)</span></p>' +
                    '<p id="set_chart_time5" style="font-size:13px;">グラフ表示件数<span style="font-size:10px;">(現在<span id="set_chart_time5">' +
                    get_chart_time("5") +
                    '</span>件)</span></p>' +
                    '</div>' +
                    '</div>' +
                    '</div>');
                /*chart表示 */
                var ctx = document.getElementById("myLineChart");
                config = config_reset("視聴数");
                window.myLineChart = new Chart(ctx, config);
                var ctx = document.getElementById("myLineChart2");
                config2 = config_reset("高評価");
                window.myLineChart2 = new Chart(ctx, config2);
                var ctx = document.getElementById("myLineChart4");
                config4 = config_reset("コメント");
                window.myLineChart4 = new Chart(ctx, config4);
                var ctx = document.getElementById("myLineChart5");
                config5 = config_reset("スパチャ");
                window.myLineChart5 = new Chart(ctx, config5);
                /*ボタンセット */
                btn_click_set("");
                btn_click_set("2");
                btn_click_set("4");
                btn_click_set("5");
                set_chart_type_btn("");
                set_chart_type_btn("2");
                set_chart_type_btn("4");
                set_chart_type_btn("5");
                set_chart_time_btn("");
                set_chart_time_btn("2");
                set_chart_time_btn("4");
                set_chart_time_btn("5");
                view_chart("");
                view_chart("2");
                view_chart("4");
                view_chart("5");
                $('#canvas_btn_del').click(function() {
                    if ($(".youtube_live_box").html() != null) {
                        window.myLineChart.destroy();
                        config = config_reset("視聴数");
                        window.myLineChart = new Chart(document.getElementById("myLineChart"), config);
                        window.myLineChart2.destroy();
                        config2 = config_reset("高評価");
                        window.myLineChart2 = new Chart(document.getElementById("myLineChart2"), config2);
                        window.myLineChart4.destroy();
                        config4 = config_reset("コメント");
                        window.myLineChart4 = new Chart(document.getElementById("myLineChart4"), config4);
                        window.myLineChart5.destroy();
                        config5 = config_reset("スパチャ");
                        window.myLineChart5 = new Chart(document.getElementById("myLineChart5"), config5);
                    }
                });
            }
            /*どっちも */
            setTimeout(twitter_view, 500);
            update_notify();
            setting_btn_set();

            if (set_change_theme == 1) {
                dark_theme(true);
            }

        }


        /*ここからグラフ更新関係*/
        /*現在時間取得 */
        var now = new Date();
        var Hour = now.getHours();
        var Min = now.getMinutes();
        var Sec = now.getSeconds();
        if (Hour < 10) Hour = "0" + Hour;
        if (Min < 10) Min = "0" + Min;
        if (Sec < 10) Sec = "0" + Sec;

        function canvas_update(canvas_id, config, myLineChart, value) {
            if (canvas_type["set"][canvas_id] == 1) {
                config.data.labels.push(String(Hour + ":" + Min + ":" + Sec));
                config.data.datasets.forEach(function(dataset) {
                    dataset.data.push(value);
                });
                config.data.datasets.forEach(function(dataset) {
                    while (dataset.data.length > get_chart_time(canvas_type["num"][canvas_id])) {
                        dataset.data.shift();
                        config.data.labels.shift();
                    }
                });
            } else if (canvas_type["set"][canvas_id] == 2) {
                if (canvas_wait["max"][canvas_id] - 1 <= canvas_wait["count"][canvas_id]) {
                    canvas_wait["count"][canvas_id] = 0;
                    config.data.labels.push(String(Hour + ":" + Min + ":" + Sec));
                    config.data.datasets.forEach(function(dataset) {
                        dataset.data.push(value);
                    });
                } else {
                    canvas_wait["count"][canvas_id]++;
                }
                config.data.datasets.forEach(function(dataset) {
                    if (dataset.data.length > get_chart_time(canvas_type["num"][canvas_id]) && dataset.data.length % 2 == 1) {
                        ii = dataset.data.length / 2;
                        i = 1;
                        while (i <= ii) {
                            dataset.data.splice(i, 1);
                            config.data.labels.splice(i, 1);
                            i++;
                        }
                        canvas_wait["max"][canvas_id] = canvas_wait["max"][canvas_id] + canvas_wait["max"][canvas_id];
                    }
                });
            } else {
                config.data.labels.push(String(Hour + ":" + Min + ":" + Sec));
                config.data.datasets.forEach(function(dataset) {
                    dataset.data.push(value);
                });
            }
            myLineChart.update();
        }

        if (!view_count.match(/回視聴/)) {
            /*配信なら */
            result = result[0].replace(/,/g, "");
            if (view_count_plus_list[view_count_plus_num] != null) {

                var view_count_plus = result - view_count_plus_list[view_count_plus_num];
                if (view_count_plus >= 0) {
                    view_count_plus = "+" + view_count_plus;
                }
                $('#view-count-plus').html(" • 推移 " + view_count_plus);
            }
            view_count_plus_list[view_count_plus_num] = result;


            canvas_update("", config, window.myLineChart, result);
            if (like.match(/万/)) {
                like = like.replace(/万/g, "");
                canvas_update("2", config2, window.myLineChart2, like * 10000);
            } else {
                canvas_update("2", config2, window.myLineChart2, like);
            }
        }
        /*配信とアーカイブ */

        function get_chart_type(i) {

            let array = ['デフォルト', '新着', '圧縮'];
            let id = canvas_type["set"][i];
            if (array[id]) {
                return array[id];
            }
            return "デフォルト";
        }

        function get_chart_time(i) {

            let array = ['5', '10', '15', '20', '25', '30', '60', '120'];
            let id = canvas_type["num"][i];
            if (array[id]) {
                return array[id];
            }
            return 5;
        }
        /*グラフ処理 */

        canvas_update("4", config4, window.myLineChart4, message_count);
        canvas_update("5", config5, window.myLineChart5, superchat_count);

        view_count_plus_num++;
    }
}

function comment_get() {
    /*配信コメント*/

    i = -1;
    while (true) {
        last_message_id = $('#chatframe').contents().find('yt-live-chat-text-message-renderer').eq(i).attr('id');
        if (last_message_id == null) {
            break;
        }
        if (last_message_id == last_get_message_id) {
            break;
        }
        message_count++;
        i--;
        moderator_id = $('#chatframe').contents().find('#author-name.moderator.yt-live-chat-author-chip').eq(-1).parent().parent().parent().attr('id');

        if (menu_set[2]) {
            if (moderator_id == null) {
                last_moderator_id = moderator_id;
            } else if (last_moderator_id != moderator_id) {
                moderator_img = $('#chatframe').contents().find('#author-name.moderator.yt-live-chat-author-chip').eq(-1).parent().parent().parent().find('#img').attr('src');
                moderator_time = $('#chatframe').contents().find('#author-name.moderator.yt-live-chat-author-chip').eq(-1).parent().parent().parent().find('#timestamp').text();
                moderator_name = $('#chatframe').contents().find('#author-name.moderator.yt-live-chat-author-chip').eq(-1).parent().parent().parent().find('#author-name').text();;
                moderator_message = $('#chatframe').contents().find('#author-name.moderator.yt-live-chat-author-chip').eq(-1).parent().parent().parent().find('#message').text();;
                $('#youtube_moderator_message').prepend('<div id="youtube_moderator_message_box" style="font-size: 13px;border-radius: 50%;">' +
                    '<img class="img" alt="" height="24" width="24" src="' + moderator_img + '">' +
                    '<span class="moderator_time">' + moderator_time + '</span>' +
                    '<span class="moderator_name">' + moderator_name + '</span>' +
                    '<p class="moderator_message">' + moderator_message + '</p>' +
                    "</div>");

                if ($("div#youtube_moderator_message_box").eq(5).html() != null) {
                    $("div#youtube_moderator_message_box").eq(5).remove();

                }

                last_moderator_id = moderator_id;
            }
        }

    }
    last_get_message_id = $('#chatframe').contents().find('yt-live-chat-text-message-renderer').eq(-1).attr('id');

    function calc_superchat_jpy(currency, amount) {
        if (symbols[currency]) {
            return amount * symbols[currency].rate;
        }
        // 通貨テーブルに通貨記号が見つからなかった
        console.log("Undefined currency symbol:" + currency);
        return 0
    }



    /*配信スパチャ */
    i = -1;
    while (true) {
        last_superchat = $('#chatframe').contents().find('div#purchase-amount').eq(i).find("yt-formatted-string").html();
        last_superchat_id = $('#chatframe').contents().find('yt-live-chat-paid-message-renderer').eq(i).attr('id');

        if (last_superchat_id == undefined) {
            break;
        }
        if (last_superchat_id == last_get_superchat_id) {
            last_get_superchat_id = last_superchat_id;
            break;
        }
        /*日本円変換 */
        superchat = reg.exec(last_superchat);
        currency = superchat[1];
        amount = parseFloat(superchat[2].replace(/,/, ''));
        superchat_count = (Math.round(calc_superchat_jpy(currency, amount) * 100) / 100) + superchat_count;
        i--;
    }
    last_get_superchat_id = $('#chatframe').contents().find('yt-live-chat-paid-message-renderer').eq(-1).attr('id');
}

/*全てをリセット */
function canvas_reset() {
    if ($("#myLineChart4").html() != null) {

        if ($("#myLineChart").html() != null) {
            window.myLineChart.destroy();
            window.myLineChart2.destroy();
            $("#view-count-plus").remove();
        }
        window.myLineChart4.destroy();
        window.myLineChart5.destroy();
        $(".youtube_live_box").remove();
    }

    $(".ytp-progress-bar-padding").empty();
    $(".chapter-title").remove();

    $("a#import_btn").each(function() {
        $("a#import_btn").remove();
    });



    $("#twitter_view").remove();


    one_time_flag = false;
    view_count_plus_num = 0;
    superchat_count = 0;
    view_count_plus_list = [];
    main_loop_count_num = 0
}

/*動画の時間取得 v1.3より追加*/

function video_length_time(now = false) {
    if (now) {
        video_time = video_now_time_count;
    } else {
        video_time_get = $("span.ytp-time-duration").text();
        if (video_time_get.match(/\d+:\d+:\d+/)) {
            num = /(\d+):(\d+):(\d)/.exec(video_time_get);
            video_time = (num[1] * 60 * 60) + (num[2] * 60) + Number(num[3]);
        } else if (video_time_get.match(/\d+:\d+/)) {
            num = /(\d+):(\d+)/.exec(video_time_get);
            video_time = (num[1] * 60) + Number(num[2]);
        } else if (video_time_get.match(/\d+/)) {
            num = /(\d+)/.exec(video_time_get);
            video_time = Number(num[1]);
        }
    }
    return video_time;
}

function video_length_time_count() {
    setTimeout(video_length_time_count, 1000);
    video_time_get = $("span.ytp-time-current").text();

    if (video_time_get != video_time_get_last) {
        if (video_time_get.match(/\d+:\d+:\d+/)) {
            num = /(\d+):(\d+):(\d)/.exec(video_time_get);
            video_time = (num[1] * 60 * 60) + (num[2] * 60) + Number(num[3]);
        } else if (video_time_get.match(/\d+:\d+/)) {
            num = /(\d+):(\d+)/.exec(video_time_get);
            video_time = (num[1] * 60) + Number(num[2]);
        } else if (video_time_get.match(/\d+/)) {
            num = /(\d+)/.exec(video_time_get);
            video_time = Number(num[1]);
        }
        video_now_time_count = video_time;
    } else {
        video_now_time_count++;
    }
    video_time_get_last = video_time_get;
}





/*動画の下部コメントチェック*/
function comment_view() {

    if (menu_set[3]) {

        let max_time = 0;
        $(".ytp-progress-bar-padding").find(".chapter").each((i, element) => {
            time = Number($(element).attr("time"));
            if (time < video_length_time(true) + 2) {
                if (time > max_time) {
                    max_time = time;
                }
            }
        });

        if ($("div[time='" + max_time + "']").attr("title") == null) {
            $(".chapter-title").remove();
        } else if ($(".chapter-title").find("p").text() != $("div[time='" + max_time + "']").attr("title")) {
            $(".chapter-title").remove();
            if (max_time > 0) {
                $("ytd-video-primary-info-renderer.style-scope.ytd-watch-flexy").prepend('<div class="chapter-title"><p>>' + $("div[time='" + max_time + "']").attr("title") + '</p></div>');
            }
            if (set_change_theme == 1) {
                dark_theme(true);
            }
        }

        function import_btn_click_set(comment) {
            let author = comment.parent().parent().parent().find("div#header-author");
            author.find('a').click(() => {
                comment.find("a.yt-simple-endpoint.style-scope.yt-formatted-string").each((i, element) => {
                    let comment_str = $(element);
                    if (comment_str.html() != null) {
                        url = comment_str.attr("href");
                        var time = /(\d+)s$/.exec(url)[1];
                        left = (time / video_length_time()) * 100;
                        left = left + "%";
                        $(".ytp-progress-bar-padding").append('<div class="chapter" title="' + comment_str.next().text() + '" time="' + time + '" style="left:' + left + ';"><div class="arrow">▼</div></div>');
                        author.find("#import_btn").css("display", "none");
                        chapter_arrow_btn_hover_set(comment_str.next().text());
                    }
                });
            });
        }

        function chapter_arrow_btn_hover_set(name) {
            $('.ytp-progress-bar-padding').find('.chapter').eq($('.chapter').children().length - 1).find(".arrow").hover(() => {
                $(".ytp-left-controls").append('<span class="chapter-name">' + name + '</span>');
            }, () => {
                $(".ytp-left-controls").find('.chapter-name').remove();
            });
        }

        if ($("yt-formatted-string#content-text").length != content_text_length) {
            content_text_length = $("yt-formatted-string#content-text").length;
            let comments = $("ytd-comment-renderer#comment>div#body>div#main>ytd-expander#expander>div#content>yt-formatted-string#content-text");
            comments.each((i, element) => {
                let comment = $(element);
                if (comment.find("a.yt-simple-endpoint.style-scope.yt-formatted-string").eq(0).html() != null) {
                    let author = comment.parent().parent().parent().find("div#header-author");
                    if (author.find("#import_btn").html() == null) {
                        author.append('<a class="yt-simple-endpoint style-scope yt-formatted-string" id="import_btn">インポート</a>');
                        import_btn_click_set(comment);
                    }
                }
            });
        }
    }
}

function twitter_view(twitter_page = 0) {
    /*Twitter */
    if (menu_set[4]) {
        function twitter_load_check() {
            let twitter_iframe = $('#twitter_view>iframe').contents();
            let twitter_footer = twitter_iframe.find('footer.timeline-Footer.u-cf>a.u-floatLeft');
            if (twitter_footer.text()) {
                setTimeout(() => {
                    let twitter_page = $("#twitter_view").attr("page");
                    twitter_footer.after('<a id="twitter_next" style="position: relative;left: 20px;cursor: pointer;">次のページ</div></div>');
                    twitter_footer.after('<a id="twitter_reload" style="position: relative;left: 10px;cursor: pointer;">再読み込み</div></div>');
                    twitter_iframe.find('a#twitter_reload').click(() => {
                        $("#twitter_view").remove();
                        twitter_view(twitter_page);
                    });
                    twitter_iframe.find('a#twitter_next').click(() => {
                        $("#twitter_view").remove();
                        twitter_view(parseInt(twitter_page) + 1);
                    });
                });
                setTimeout(() => {
                    twitter_iframe.find('.timeline-InformationCircle').css({
                        "top": "0px"
                    });
                    twitter_iframe.find('.timeline-Header-title').css({
                        "font-size": "16px",
                        "line-height": "0px"
                    });
                    twitter_iframe.find('.timeline-Footer').css({
                        "padding": "7px"
                    });
                }, 500);
            } else {
                setTimeout(twitter_load_check, 100);
            }
        }

        let twitter_page_list = [];
        $("yt-formatted-string.content.style-scope.ytd-video-secondary-info-renderer").find("a").each((i, element) => {
            if ($(element).text().match(/\/\/twitter.com\/[^\/]+\/?$/)) {
                twitter_page_list.push($(element).text());
            }
        });
        if (twitter_page_list.length == 0) {
            return;
        }
        if (twitter_page_list.length < twitter_page + 1) {
            setTimeout(twitter_view);
            return;
        }
        $('#container > div#top-row').after('<div id="twitter_view" page="' + twitter_page + '"><a data-height="520" data-theme="' + get_theme() + '" class="twitter-timeline" href=' +
            twitter_page_list[twitter_page] +
            '></a> <script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script>');
        setTimeout(twitter_load_check);
    }
}





function setting_btn_set() {

    $('#set_change_wait').click(function() {
        set_change_wait_num++;
        if (set_change_wait_num == 8) {
            set_change_wait_num = 0;
        }

        $('#set_numeber_wait').html(get_wait_time());

        chrome.storage.sync.set({
            'wait_time': set_change_wait_num
        });
    });
    $('#set_change_theme').click(function() {
        set_change_theme++;
        if (set_change_theme == 2) {
            set_change_theme = 0;
        }

        if (set_change_theme == 1) {
            dark_theme(true);
        } else {
            dark_theme(false);
        }

        $('#set_numeber_theme').html(get_theme());

        chrome.storage.sync.set({
            'theme': set_change_theme
        });
    });

    $('#set_change_border').click(function() {
        set_change_borderColor++;
        if (set_change_borderColor == 3) {
            set_change_borderColor = 0;
        }

        var view_count = $(".view-count").html();
        if (!view_count.match(/回視聴/)) {
            config.data.datasets[0].borderColor = get_backgroundColor_code();
            window.myLineChart.update();
            config2.data.datasets[0].borderColor = get_backgroundColor_code();
            window.myLineChart2.update();
        }
        config4.data.datasets[0].borderColor = get_backgroundColor_code();
        window.myLineChart4.update();
        config5.data.datasets[0].borderColor = get_backgroundColor_code();
        window.myLineChart5.update();

        $('#set_numeber_border').html(get_backgroundColor());

        chrome.storage.sync.set({
            'border': set_change_borderColor
        });
    });




    $('#storage_reset').click(function() {
        chrome.storage.sync.set({
            'wait_time': null
        });
        chrome.storage.sync.set({
            'canvas_btn': null
        });
        chrome.storage.sync.set({
            'theme': null
        });
        chrome.storage.sync.set({
            'border': null
        });
        chrome.storage.sync.set({
            'wait_time': null
        });
        chrome.storage.sync.set({
            'chart_set': null
        });
        location.reload();
    });


    $('#setting').click(function() {
        if (canvas_flag['setting']) {
            $.Deferred(function(deferredAnim) {
                deferredAnim.then(function() {
                    $("#setting_box").animate({
                        "height": "0px",
                        "opacity": "0"
                    }, 500);
                    $("#setting").animate({
                        "opacity": "1"
                    }, 500);
                })
            }).resolve();
            canvas_flag["setting"] = false;
        } else {
            $.Deferred(function(deferredAnim) {
                deferredAnim.then(function() {
                    $("#setting_box").animate({
                        "height": "280px",
                        "opacity": "1"
                    }, 500);
                    $("#setting").animate({
                        "opacity": "0.5"
                    }, 500);
                })
            }).resolve();
            canvas_flag['setting'] = true;
        }
    });

}

// アプデ確認
function update_notify() {
    var version = "3.2.0";
    $('#notify_message').remove();
    chrome.storage.sync.get("version", function(value) {
        if (version != value.version) {
            $('ytd-live-chat-frame#chat').after('<div style="position: relative; top: -20px;" id="notify_message"><p style="font-size:14px">拡張機能がアップデートされました</p><p style="font-size:14px">設定がリセットされた可能性があります</p><a style="margin:2px;text-decoration:none;" href="https://blog.yuki0311.com/youtube-feature-rich-v1/"  target="_blank" >詳しくはこちら</a><a style="margin:2px;text-decoration:none;" id="notify_hidden_btn">非表示にする</a></div>');
            $('#notify_hidden_btn').click(function() {
                chrome.storage.sync.set({
                    'version': version
                });
                $("#notify_message").css("display", "none");
            });
        }
    });
}

function get_wait_time() {
    var array = ['5', '10', '15', '20', '25', '30', '60', '120'];
    if (array[set_change_wait_num]) {
        return array[set_change_wait_num];
    }
    return 5;
}

function get_theme() {
    var array = ['normal', 'dark'];
    return array[set_change_theme];
}


function get_backgroundColor() {
    var array = ['normal', 'dark', 'white'];
    return array[set_change_borderColor];
}

function get_backgroundColor_code() {
    var array = ['rgba(255,0,0,1)', 'rgba(0,0,0,1)', 'rgba(255,255,255,1)'];
    return array[set_change_borderColor];
}

function get_storage() {
    chrome.storage.sync.get("wait_time", function(value) {
        set_change_wait_num = value.wait_time;
        if (set_change_wait_num == null) {
            set_change_wait_num = 0;
        }
    });

    chrome.storage.sync.get("theme", function(value) {
        set_change_theme = value.theme;
        if (set_change_theme == null) {
            set_change_theme = 0;
        }
    });

    chrome.storage.sync.get("border", function(value) {
        set_change_borderColor = value.border;
        if (set_change_borderColor == null) {
            set_change_borderColor = 0;
        }
    });

    chrome.storage.sync.get("canvas_btn", function(value) {
        canvas_flag = value.canvas_btn[0];
        canvas_height = value.canvas_btn[1];
        if (canvas_flag == null) {
            canvas_flag = {};
        }
        if (canvas_height == null) {
            canvas_height = {};
        }
    });



    chrome.storage.sync.get("chart_set", function(value) {
        canvas_type = value.chart_set;
        if (canvas_type == null) {
            canvas_type = {
                "set": {
                    "": 0,
                    "2": 0,
                    "3": 0,
                    "4": 0,
                    "5": 0,
                },
                "num": {
                    "": 0,
                    "2": 0,
                    "3": 0,
                    "4": 0,
                    "5": 0,
                }
            };
        }
    });
}


function dark_theme(theme_flag) {
    i = 0;
    while (i <= 5) {
        if (i == 0) {
            canvas_num = "";
        } else {
            canvas_num = i;
        }
        if (theme_flag) {
            $('#canvas_btn' + canvas_num).addClass('dark_theme_btn');
            $('#myLineChart' + canvas_num).addClass('dark_theme_canvas');
        } else {
            $('#canvas_btn' + canvas_num).removeClass('dark_theme_btn');
            $('#myLineChart' + canvas_num).removeClass('dark_theme_canvas');
        }
        i++;
    }
    if (theme_flag) {
        $('#setting').addClass('dark_theme_btn');
        $('#canvas_btn_del').addClass('dark_theme_btn');
        $('#setting_box').addClass('dark_theme_text');
        $('#youtube_moderator_message').addClass('dark_theme_moderator');
        $('.chapter-title').addClass('dark_theme_text');
        $('#notify_message').addClass('dark_theme_text');
    } else {
        $('#setting').removeClass('dark_theme_btn');
        $('#canvas_btn_del').removeClass('dark_theme_btn');
        $('#setting_box').removeClass('dark_theme_text');
        $('#youtube_moderator_message').removeClass('dark_theme_moderator');
        $('.chapter-title').removeClass('dark_theme_text');
        $('#notify_message').removeClass('dark_theme_text');
    }
    $("#twitter_view").remove();
    setTimeout(twitter_view, 500);
}