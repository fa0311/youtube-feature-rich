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
        setTimeout(canvas_reset); //すべてリセット
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
        twitter_view();
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
            twitter_view();

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
    var bad = $("a.yt-simple-endpoint.style-scope.ytd-toggle-button-renderer > yt-formatted-string#text").eq(1).html();
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

                btn_click_set(4);
                btn_click_set(5);

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

                    });
                    chrome.storage.sync.set({
                        'canvas_btn': [canvas_flag, canvas_height]
                    });
                }



                set_chart_type_btn("");
                set_chart_type_btn("2");
                set_chart_type_btn("3");
                set_chart_type_btn("4");
                set_chart_type_btn("5");

                function set_chart_type_btn(id) {
                    $('p#set_chart_type' + id).click(function() {
                        canvas_type["set"][id]++;
                        if (canvas_type["set"][id] > 2) {
                            canvas_type["set"][id] = 0;
                        }
                        $('span#set_chart_type' + id).html(get_chart_type(id));
                    });
                }

                set_chart_time_btn("");
                set_chart_time_btn("2");
                set_chart_time_btn("3");
                set_chart_time_btn("4");
                set_chart_time_btn("5");

                function set_chart_time_btn(id) {
                    $('p#set_chart_time' + id).click(function() {
                        canvas_type["num"][id]++;
                        if (canvas_type["num"][id] > 8) {
                            canvas_type["num"][id] = 0;
                        }

                        $('span#set_chart_time' + id).html(get_chart_time(id));
                    });
                }






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


                i = 4;
                while (i <= 5) {
                    canvas_num = i;
                    if (canvas_flag[canvas_num]) {
                        $('#myLineChart' + canvas_num).addClass('display_none');
                        $("#canvas_btn" + canvas_num).css("opacity", "1");
                        $("#myLineChart" + canvas_num).css("height", "0");
                    } else {
                        $('#myLineChart' + canvas_num).removeClass('display_none');
                        $("#canvas_btn" + canvas_num).css("opacity", "0.5");
                        $("#myLineChart" + canvas_num).css("height", canvas_height[canvas_num]);
                    }
                    i++;
                }

            } else {
                /*配信なら */
                $('.view-count').append('<span id="view-count-plus"> • 処理中</span>');
                $('ytd-live-chat-frame#chat').after('<div class="youtube_live_box">' +
                    '<div id="youtube_moderator_message">' +
                    '</div>' +
                    '<canvas id="myLineChart"></canvas>' +
                    '<canvas id="myLineChart2"></canvas>' +
                    '<canvas id="myLineChart3"></canvas>' +
                    '<canvas id="myLineChart4"></canvas>' +
                    '<canvas id="myLineChart5"></canvas>' +
                    '<p>' +
                    '<div class="canvas_btn" style="opacity:0.5" id="canvas_btn">視聴数</div>' +
                    '<div class="canvas_btn" style="opacity:0.5" id="canvas_btn2">高評価</div>' +
                    '<div class="canvas_btn" style="opacity:0.5" id="canvas_btn3">低評価</div>' +
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

                    '<p style="font-size:13px;">低評価</p>' +
                    '<p id="set_chart_type3" style="font-size:13px;">グラフモード<span style="font-size:10px;">(現在<span id="set_chart_type3">' +
                    get_chart_type("3") +
                    '</span>)</span></p>' +
                    '<p id="set_chart_time3" style="font-size:13px;">グラフ表示件数<span style="font-size:10px;">(現在<span id="set_chart_time3">' +
                    get_chart_time("3") +
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
                var ctx = document.getElementById("myLineChart3");
                config3 = config_reset("低評価");
                window.myLineChart3 = new Chart(ctx, config3);
                var ctx = document.getElementById("myLineChart4");
                config4 = config_reset("コメント");
                window.myLineChart4 = new Chart(ctx, config4);
                var ctx = document.getElementById("myLineChart5");
                config5 = config_reset("スパチャ");
                window.myLineChart5 = new Chart(ctx, config5);


                /*ボタンセット */
                btn_click_set("");
                btn_click_set(2);
                btn_click_set(3);
                btn_click_set(4);
                btn_click_set(5);

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


                set_chart_type_btn("");
                set_chart_type_btn("2");
                set_chart_type_btn("3");
                set_chart_type_btn("4");
                set_chart_type_btn("5");

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

                set_chart_time_btn("");
                set_chart_time_btn("2");
                set_chart_time_btn("3");
                set_chart_time_btn("4");
                set_chart_time_btn("5");

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


                /*消去ボタン */
                $('#canvas_btn_del').click(function() {

                    if ($(".youtube_live_box").html() != null) {
                        window.myLineChart.destroy();
                        config = config_reset("視聴数");
                        window.myLineChart = new Chart(document.getElementById("myLineChart"), config);
                        window.myLineChart2.destroy();
                        config2 = config_reset("高評価");
                        window.myLineChart2 = new Chart(document.getElementById("myLineChart2"), config2);
                        window.myLineChart3.destroy();
                        config3 = config_reset("低評価");
                        window.myLineChart3 = new Chart(document.getElementById("myLineChart3"), config3);
                        window.myLineChart4.destroy();
                        config4 = config_reset("コメント");
                        window.myLineChart4 = new Chart(document.getElementById("myLineChart4"), config4);
                        window.myLineChart5.destroy();
                        config5 = config_reset("スパチャ");
                        window.myLineChart5 = new Chart(document.getElementById("myLineChart5"), config5);
                    }
                });
                /*ボタンの表示の継承 */

                i = 0;
                while (i <= 5) {
                    if (i == 0) {
                        canvas_num = "";
                    } else {
                        canvas_num = i;
                    }

                    if (canvas_flag[canvas_num]) {
                        $('#myLineChart' + canvas_num).addClass('display_none');
                        $("#canvas_btn" + canvas_num).css("opacity", "1");
                        $("#myLineChart" + canvas_num).css("height", "0");
                    } else {
                        $('#myLineChart' + canvas_num).removeClass('display_none');
                        $("#canvas_btn" + canvas_num).css("opacity", "0.5");
                        $("#myLineChart" + canvas_num).css("height", canvas_height[canvas_num]);
                    }
                    i++;
                }

            }
            /*どっちも */
            twitter_view();
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



            if (canvas_type["set"][""] == 1) {
                config.data.labels.push(String(Hour + ":" + Min + ":" + Sec));
                config.data.datasets.forEach(function(dataset) {
                    dataset.data.push(result);
                });

                config.data.datasets.forEach(function(dataset) {
                    while (dataset.data.length > get_chart_time(canvas_type["num"][""])) {
                        dataset.data.shift();
                        config.data.labels.shift();
                    }
                });
                window.myLineChart.update();
            } else if (canvas_type["set"][""] == 2) {
                if (canvas_wait["max"][""] - 1 <= canvas_wait["count"][""]) {
                    canvas_wait["count"][""] = 0;
                    config.data.labels.push(String(Hour + ":" + Min + ":" + Sec));
                    config.data.datasets.forEach(function(dataset) {
                        dataset.data.push(result);
                    });
                    window.myLineChart.update();
                } else {
                    canvas_wait["count"][""]++;
                }
                config.data.datasets.forEach(function(dataset) {
                    if (dataset.data.length > get_chart_time(canvas_type["num"][""]) && dataset.data.length % 2 == 1) {
                        ii = dataset.data.length / 2;
                        i = 1;
                        while (i <= ii) {
                            dataset.data.splice(i, 1);
                            config.data.labels.splice(i, 1);
                            i++;
                        }
                        canvas_wait["max"][""] = canvas_wait["max"][""] + canvas_wait["max"][""];
                    }
                    window.myLineChart.update();
                });
            } else {
                config.data.labels.push(String(Hour + ":" + Min + ":" + Sec));
                config.data.datasets.forEach(function(dataset) {
                    dataset.data.push(result);
                });
                window.myLineChart.update();
            }


            if (canvas_type["set"]["2"] == 1) {
                config2.data.labels.push(String(Hour + ":" + Min + ":" + Sec));
                config2.data.datasets.forEach(function(dataset) {
                    if (like.match(/万/)) {
                        like = like.replace(/万/g, "");
                        dataset.data.push(like * 10000);
                    } else {
                        dataset.data.push(like);
                    }
                });
                config2.data.datasets.forEach(function(dataset) {
                    while (dataset.data.length > get_chart_time(canvas_type["num"]["2"])) {
                        dataset.data.shift();
                        config2.data.labels.shift();
                    }
                });

                window.myLineChart2.update();
            } else if (canvas_type["set"]["2"] == 2) {
                if (canvas_wait["max"][2] - 1 <= canvas_wait["count"][2]) {
                    canvas_wait["count"][2] = 0;
                    config2.data.labels.push(String(Hour + ":" + Min + ":" + Sec));
                    config2.data.datasets.forEach(function(dataset) {
                        if (like.match(/万/)) {
                            like = like.replace(/万/g, "");
                            dataset.data.push(like * 10000);
                        } else {
                            dataset.data.push(like);
                        }
                    });
                    window.myLineChart2.update();
                } else {
                    canvas_wait["count"]["2"]++;
                }
                config2.data.datasets.forEach(function(dataset) {
                    if (dataset.data.length > get_chart_time(canvas_type["num"]["2"]) && dataset.data.length % 2 == 1) {
                        ii = dataset.data.length / 2;
                        i = 1;
                        while (i <= ii) {
                            dataset.data.splice(i, 1);
                            config2.data.labels.splice(i, 1);
                            i++;
                        }
                        canvas_wait["max"]["2"] = canvas_wait["max"]["2"] + canvas_wait["max"]["2"];
                    }
                    window.myLineChart2.update();
                });
            } else {
                config2.data.labels.push(String(Hour + ":" + Min + ":" + Sec));
                config2.data.datasets.forEach(function(dataset) {
                    if (like.match(/万/)) {
                        like = like.replace(/万/g, "");
                        dataset.data.push(like * 10000);
                    } else {
                        dataset.data.push(like);
                    }
                });
                window.myLineChart2.update();
            }

            if (canvas_type["set"]["3"] == 1) {
                config3.data.labels.push(String(Hour + ":" + Min + ":" + Sec));
                config3.data.datasets.forEach(function(dataset) {
                    if (bad.match(/万/)) {
                        bad = bad.replace(/万/g, "");
                        dataset.data.push(bad * 10000);
                    } else {
                        dataset.data.push(bad);
                    }
                });
                config3.data.datasets.forEach(function(dataset) {
                    while (dataset.data.length > get_chart_time(canvas_type["num"]["3"])) {
                        dataset.data.shift();
                        config3.data.labels.shift();
                    }
                });
                window.myLineChart3.update();
            } else if (canvas_type["set"]["3"] == 2) {
                if (canvas_wait["max"][3] - 1 <= canvas_wait["count"][3]) {
                    canvas_wait["count"][3] = 0;
                    config3.data.labels.push(String(Hour + ":" + Min + ":" + Sec));
                    config3.data.datasets.forEach(function(dataset) {
                        if (bad.match(/万/)) {
                            bad = bad.replace(/万/g, "");
                            dataset.data.push(bad * 10000);
                        } else {
                            dataset.data.push(bad);
                        }
                    });
                    window.myLineChart3.update();
                } else {
                    canvas_wait["count"]["3"]++;
                }
                config3.data.datasets.forEach(function(dataset) {
                    if (dataset.data.length > get_chart_time(canvas_type["num"]["3"]) && dataset.data.length % 2 == 1) {
                        ii = dataset.data.length / 2;
                        i = 1;
                        while (i <= ii) {
                            dataset.data.splice(i, 1);
                            config3.data.labels.splice(i, 1);
                            i++;
                        }
                        canvas_wait["max"]["3"] = canvas_wait["max"]["3"] + canvas_wait["max"]["3"];
                    }
                    window.myLineChart3.update();
                });
            } else {
                config3.data.labels.push(String(Hour + ":" + Min + ":" + Sec));
                config3.data.datasets.forEach(function(dataset) {
                    if (bad.match(/万/)) {
                        bad = bad.replace(/万/g, "");
                        dataset.data.push(bad * 10000);
                    } else {
                        dataset.data.push(bad);
                    }
                });
                window.myLineChart3.update();
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

        if (canvas_type["set"]["4"] == 1) {
            config4.data.labels.push(String(Hour + ":" + Min + ":" + Sec));
            config4.data.datasets.forEach(function(dataset) {
                dataset.data.push(message_count);
            });
            config4.data.datasets.forEach(function(dataset) {
                while (dataset.data.length > get_chart_time(canvas_type["num"]["4"])) {
                    dataset.data.shift();
                    config4.data.labels.shift();
                }
            });
            window.myLineChart4.update();
        } else if (canvas_type["set"]["4"] == 2) {
            if (canvas_wait["max"][4] - 1 <= canvas_wait["count"][4]) {
                canvas_wait["count"][4] = 0;
                config4.data.labels.push(String(Hour + ":" + Min + ":" + Sec));
                config4.data.datasets.forEach(function(dataset) {
                    dataset.data.push(message_count);
                });
                window.myLineChart4.update();
            } else {
                canvas_wait["count"]["4"]++;
            }
            config4.data.datasets.forEach(function(dataset) {
                if (dataset.data.length > get_chart_time(canvas_type["num"]["4"]) && dataset.data.length % 2 == 1) {
                    ii = dataset.data.length / 2;
                    i = 1;
                    while (i <= ii) {
                        dataset.data.splice(i, 1);
                        config4.data.labels.splice(i, 1);
                        i++;
                    }
                    canvas_wait["max"]["4"] = canvas_wait["max"]["4"] + canvas_wait["max"]["4"];
                }
                window.myLineChart4.update();
            });
        } else {
            config4.data.labels.push(String(Hour + ":" + Min + ":" + Sec));
            config4.data.datasets.forEach(function(dataset) {
                dataset.data.push(message_count);
            });
            window.myLineChart4.update();
        }


        if (canvas_type["set"]["5"] == 1) {
            config5.data.labels.push(String(Hour + ":" + Min + ":" + Sec));
            config5.data.datasets.forEach(function(dataset) {
                dataset.data.push(superchat_count);
            });
            config5.data.datasets.forEach(function(dataset) {
                while (dataset.data.length > get_chart_time(canvas_type["num"]["5"])) {
                    dataset.data.shift();
                    config5.data.labels.shift();
                }
            });
            window.myLineChart5.update();
        } else if (canvas_type["set"]["5"] == 2) {

            if (canvas_wait["max"][5] - 1 <= canvas_wait["count"][5]) {
                canvas_wait["count"][5] = 0;
                config5.data.labels.push(String(Hour + ":" + Min + ":" + Sec));
                config5.data.datasets.forEach(function(dataset) {
                    dataset.data.push(superchat_count);
                });
                window.myLineChart5.update();
            } else {
                canvas_wait["count"]["5"]++;
            }
            config5.data.datasets.forEach(function(dataset) {
                if (dataset.data.length > get_chart_time(canvas_type["num"]["5"]) && dataset.data.length % 2 == 1) {
                    ii = dataset.data.length / 2;
                    i = 1;
                    while (i <= ii) {
                        dataset.data.splice(i, 1);
                        config5.data.labels.splice(i, 1);
                        i++;
                    }
                    canvas_wait["max"]["5"] = canvas_wait["max"]["5"] + canvas_wait["max"]["5"];
                }
                window.myLineChart.update();
            });
        } else {
            config5.data.labels.push(String(Hour + ":" + Min + ":" + Sec));
            config5.data.datasets.forEach(function(dataset) {
                dataset.data.push(superchat_count);
            });
            window.myLineChart5.update();
        }
        view_count_plus_num++;
        // v2.0よりコメント化
        // message_count = 0;
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
        last_superchat = $('#chatframe').contents().find('div#purchase-amount').eq(i).html();
        last_superchat_id = $('#chatframe').contents().find('yt-live-chat-paid-message-renderer').eq(i).attr('id');

        if (last_superchat_id == null) {
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
        superchat_count = Math.round((superchat_count + calc_superchat_jpy(currency, amount)) * 100) / 100;
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
            window.myLineChart3.destroy();
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



    $(".twitter_view").remove();


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





/*コメントチェック*/
function comment_view() {

    if (menu_set[3]) {

        i = 0;
        max_time = 0;
        $(".ytp-progress-bar-padding").find(".chapter").each(function() {
            time = Number($(".ytp-progress-bar-padding").find(".chapter").eq(i).attr("time"));
            if (time < video_length_time(true) + 2) {
                if (time > max_time) {
                    max_time = time;
                }
            }

            i++;
        });

        if ($("div[time='" + max_time + "']").attr("title") != null) {
            if ($(".chapter-title").find(p).text() != $("div[time='" + max_time + "']").attr("title")) {
                $(".chapter-title").remove();
                $("ytd-video-primary-info-renderer.style-scope.ytd-watch-flexy").prepend('<div class="chapter-title"><p>>' + $("div[time='" + max_time + "']").attr("title") + '</p></div>');
                if (set_change_theme == 1) {
                    dark_theme(true);
                }
            }
        }
        if ($("yt-formatted-string#content-text").length != content_text_length) {
            content_text_length = $("yt-formatted-string#content-text").length;

            i = 0;
            $("ytd-comment-renderer#comment>div#body>div#main>ytd-expander#expander>div#content>yt-formatted-string#content-text").each(function() {
                if ($("ytd-comment-renderer#comment>div#body>div#main>ytd-expander#expander>div#content>yt-formatted-string#content-text").eq(i).find("a.yt-simple-endpoint.style-scope.yt-formatted-string").eq(0).html() != null) {

                    if ($("ytd-comment-renderer#comment>div#body>div#main>ytd-expander#expander>div#content>yt-formatted-string#content-text").eq(i).parent().parent().parent().find("div#header-author").find("#import_btn").html() == null) {



                        $("ytd-comment-renderer#comment>div#body>div#main>ytd-expander#expander>div#content>yt-formatted-string#content-text").eq(i).parent().parent().parent().find("div#header-author").append('<a class="yt-simple-endpoint style-scope yt-formatted-string" id="import_btn">インポート</a>');
                        import_btn_click_set(i);

                        function import_btn_click_set(i) {
                            $("ytd-comment-renderer#comment>div#body>div#main>ytd-expander#expander>div#content>yt-formatted-string#content-text").eq(i).parent().parent().parent().find("div#header-author").find('a').click(
                                function() {
                                    ii = 0;
                                    $("ytd-comment-renderer#comment>div#body>div#main>ytd-expander#expander>div#content>yt-formatted-string#content-text").eq(i).find("a.yt-simple-endpoint.style-scope.yt-formatted-string").each(function() {
                                        if ($("ytd-comment-renderer#comment>div#body>div#main>ytd-expander#expander>div#content>yt-formatted-string#content-text").eq(i).find("a.yt-simple-endpoint.style-scope.yt-formatted-string").eq(ii).html() != null) {
                                            url = $("ytd-comment-renderer#comment>div#body>div#main>ytd-expander#expander>div#content>yt-formatted-string#content-text").eq(i).find("a.yt-simple-endpoint.style-scope.yt-formatted-string").eq(ii).attr("href");
                                            var time = /(\d+)s$/.exec(url)[1];
                                            left = (time / video_length_time()) * 100;
                                            left = left + "%";
                                            $(".ytp-progress-bar-padding").append('<div class="chapter" title="' + $("ytd-comment-renderer#comment>div#body>div#main>ytd-expander#expander>div#content>yt-formatted-string#content-text").eq(i).find("a.yt-simple-endpoint.style-scope.yt-formatted-string").eq(ii).next().text() + '" time="' + time + '" style="left:' + left + ';"><div class="arrow">▼</div></div>');

                                            $("ytd-comment-renderer#comment>div#body>div#main>ytd-expander#expander>div#content>yt-formatted-string#content-text").eq(i).parent().parent().parent().find("div#header-author").find("#import_btn").css("display", "none");
                                            chapter_arrow_btn_hover_set($("ytd-comment-renderer#comment>div#body>div#main>ytd-expander#expander>div#content>yt-formatted-string#content-text").eq(i).find("a.yt-simple-endpoint.style-scope.yt-formatted-string").eq(ii).next().text());

                                            function chapter_arrow_btn_hover_set(name) {
                                                $('.ytp-progress-bar-padding').find('.chapter').eq($('.chapter').children().length - 1).find(".arrow").hover(
                                                    function() {
                                                        $(".ytp-left-controls").append('<span class="chapter-name">' + name + '</span>');
                                                    },
                                                    function() {
                                                        $(".ytp-left-controls").find('.chapter-name').remove();
                                                    }
                                                );
                                            }
                                        }
                                        ii++;
                                    });
                                });
                        }
                    }
                }

                ii = 0;


                $("ytd-comment-renderer#comment").eq(i).parent().find("ytd-comment-renderer.style-scope.ytd-comment-replies-renderer>div#body>div#main>ytd-expander#expander>div#content>yt-formatted-string#content-text").each(function() {
                    if ($("ytd-comment-renderer#comment").eq(i).parent().find("ytd-comment-renderer.style-scope.ytd-comment-replies-renderer>div#body>div#main>ytd-expander#expander>div#content>yt-formatted-string#content-text").eq(ii).find("a.yt-simple-endpoint.style-scope.yt-formatted-string").eq(0).html() != null) {
                        if ($("ytd-comment-renderer#comment").eq(i).parent().find("ytd-comment-renderer.style-scope.ytd-comment-replies-renderer>div#body>div#main>ytd-expander#expander>div#content>yt-formatted-string#content-text").eq(ii).parent().parent().parent().find("div#header-author").find("#import_btn").html() == null) {
                            iii = 0;
                            flag = false;
                            $("ytd-comment-renderer#comment").eq(i).parent().find("ytd-comment-renderer.style-scope.ytd-comment-replies-renderer>div#body>div#main>ytd-expander#expander>div#content>yt-formatted-string#content-text").eq(ii).find("a.yt-simple-endpoint.style-scope.yt-formatted-string").each(function() {

                                url = $("ytd-comment-renderer#comment").eq(i).parent().find("ytd-comment-renderer.style-scope.ytd-comment-replies-renderer>div#body>div#main>ytd-expander#expander>div#content>yt-formatted-string#content-text").eq(ii).find("a.yt-simple-endpoint.style-scope.yt-formatted-string").eq(iii).attr("href");
                                if (url != null) {
                                    time = /(\d+)s$/.exec(url)[1];
                                    if (time != null) {
                                        flag = true;
                                    }
                                }
                                iii++;
                            });
                            if (flag == true) {
                                $("ytd-comment-renderer#comment").eq(i).parent().find("ytd-comment-renderer.style-scope.ytd-comment-replies-renderer>div#body>div#main>ytd-expander#expander>div#content>yt-formatted-string#content-text").eq(ii).parent().parent().parent().find("div#header-author").append('<a class="yt-simple-endpoint style-scope yt-formatted-string" id="import_btn" style="font-size:10px;">インポート</a>');


                                import_btn_click_set(i, ii);
                            }

                            function import_btn_click_set(i, ii) {

                                $("ytd-comment-renderer#comment").eq(i).parent().find("ytd-comment-renderer.style-scope.ytd-comment-replies-renderer>div#body>div#main>ytd-expander#expander>div#content>yt-formatted-string#content-text").eq(ii).parent().parent().parent().find("div#header-author").find('a#import_btn').click(

                                    function() {
                                        iii = 0;
                                        $("ytd-comment-renderer#comment").eq(i).parent().find("ytd-comment-renderer.style-scope.ytd-comment-replies-renderer>div#body>div#main>ytd-expander#expander>div#content>yt-formatted-string#content-text").eq(ii).find("a.yt-simple-endpoint.style-scope.yt-formatted-string").each(function() {

                                            if ($("ytd-comment-renderer#comment").eq(i).parent().find("ytd-comment-renderer.style-scope.ytd-comment-replies-renderer>div#body>div#main>ytd-expander#expander>div#content>yt-formatted-string#content-text").eq(ii).find("a.yt-simple-endpoint.style-scope.yt-formatted-string").eq(iii).html() != null) {



                                                url = $("ytd-comment-renderer#comment").eq(i).parent().find("ytd-comment-renderer.style-scope.ytd-comment-replies-renderer>div#body>div#main>ytd-expander#expander>div#content>yt-formatted-string#content-text").eq(ii).find("a.yt-simple-endpoint.style-scope.yt-formatted-string").eq(iii).attr("href");
                                                time = /(\d+)s$/.exec(url)[1];
                                                left = (time / video_length_time()) * 100;
                                                left = left + "%";
                                                $(".ytp-progress-bar-padding").append('<div class="chapter" title="' + $("ytd-comment-renderer#comment").eq(i).parent().find("ytd-comment-renderer.style-scope.ytd-comment-replies-renderer>div#body>div#main>ytd-expander#expander>div#content>yt-formatted-string#content-text").eq(ii).find("a.yt-simple-endpoint.style-scope.yt-formatted-string").eq(iii).next().text() + '" time="' + time + '" style="left:' + left + ';"><div class="arrow">▼</div></div>');

                                                $("ytd-comment-renderer#comment").eq(i).parent().find("ytd-comment-renderer.style-scope.ytd-comment-replies-renderer>div#body>div#main>ytd-expander#expander>div#content>yt-formatted-string#content-text").eq(ii).parent().parent().parent().find("div#header-author").find("#import_btn").css("display", "none");
                                                chapter_arrow_btn_hover_set($("ytd-comment-renderer#comment").eq(i).parent().find("ytd-comment-renderer.style-scope.ytd-comment-replies-renderer>div#body>div#main>ytd-expander#expander>div#content>yt-formatted-string#content-text").eq(ii).find("a.yt-simple-endpoint.style-scope.yt-formatted-string").eq(iii).next().text());

                                                function chapter_arrow_btn_hover_set(name) {
                                                    $('.ytp-progress-bar-padding').find('.chapter').eq($('.chapter').children().length - 1).find(".arrow").hover(
                                                        function() {
                                                            $(".ytp-left-controls").append('<span class="chapter-name">' + name + '</span>');
                                                        },
                                                        function() {
                                                            $(".ytp-left-controls").find('.chapter-name').remove();
                                                        }
                                                    );
                                                }
                                            }
                                            iii++;
                                        });
                                    });
                            }
                        }
                    }
                    ii++;
                });
                i++;
            });
        }
    }
}

function twitter_view(twitter_page = 0) {

    if (menu_set[4]) {
        /*Twitter */
        i = 0;
        ii = 0;
        $("yt-formatted-string.content.style-scope.ytd-video-secondary-info-renderer").find("a").each(function() {

            if ($("yt-formatted-string.content.style-scope.ytd-video-secondary-info-renderer").find("a").eq(i).text().match(/\/\/twitter.com\/[^\/]+\/?$/)) {

                if (twitter_page == ii) {
                    $('#container > div#top-row').after('<div class="twitter_view" page="' + ii + '"><a data-height="400" data-theme="' + get_theme() + '" class="twitter-timeline" href=' +
                        $("yt-formatted-string.content.style-scope.ytd-video-secondary-info-renderer").find("a").eq(i).text() +
                        '></a> <script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script>');
                    setTimeout(twitter_load_check, 100);
                    ii++;

                    function twitter_load_check() {
                        if ($('.twitter_view>iframe').contents().find('footer.timeline-Footer.u-cf>a.u-floatLeft').text()) {
                            setTimeout(function() {
                                $('.twitter_view>iframe').contents().find('footer.timeline-Footer.u-cf>a.u-floatLeft').after('<a id="twitter_next" style="position: relative;left: 20px;cursor: pointer;">次のページ</div></div>');
                                $('.twitter_view>iframe').contents().find('footer.timeline-Footer.u-cf>a.u-floatLeft').after('<a id="twitter_reload" style="position: relative;left: 10px;cursor: pointer;">再読み込み</div></div>');

                                $('.twitter_view>iframe').contents().find('a#twitter_reload').click(function() {
                                    var twitter_page = $(".twitter_view").attr("page");
                                    $(".twitter_view").remove();
                                    twitter_view(twitter_page);
                                });
                                $('.twitter_view>iframe').contents().find('a#twitter_next').click(function() {
                                    var twitter_page = $(".twitter_view").attr("page") + 1;
                                    $(".twitter_view").remove();
                                    twitter_view(twitter_page);
                                });
                            }, 100);

                        } else {
                            setTimeout(twitter_load_check, 500);
                        }
                    }
                } else if (twitter_page > ii) {
                    ii++;
                }
            }
            i++;
        });
        if (twitter_page == 0) {
            return;
        }
        if (twitter_page >= ii) {
            twitter_view();
        }

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
            config3.data.datasets[0].borderColor = get_backgroundColor_code();
            window.myLineChart3.update();
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
                        "height": "300px",
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
    var version = "3.0.1";
    chrome.storage.sync.get("version", function(value) {
        if (version != value.version) {

            if ($('#notify_message').html()) {
                $("#notify_message").css("display", "none");
            }

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
    $(".twitter_view").remove();
    twitter_view(0);
}