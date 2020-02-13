function index_render(data){

    // var head = new Vue({
    //     el: 'head',
    //     data:data.head
    // });

    var header = new Vue({
        el: 'header',
        data:data.header,
        mounted: function () {
            this.$nextTick(function () {
                $('#nav').slicknav({
                    'label' : '',
                    'prependTo': '.mobile-menu',

                });
            })
        }
    });

    var index_container = new Vue({
        el: '#container',
        data:{
            play_state:0, // 0 pause 1 play
            play_mode:0, // 0顺序 1随机 2单曲循环
            current_song_name:'',
            current_song_singer:'',
            current_song:0,
            current_time:0.0,
            tag_current_time:'00:00',
            total_time:1.0,
            tag_total_time: '00:00',
            progress_btn_state:false,
            volume:document.getElementById('player').volume,
            path:'music/',
            song_list:['1.mp3','2.mp3'],
            songs:[
                {
                    name:'淘汰',
                    singer:'陈奕迅(Eason Chen)',
                    album:'认了吧',
                    file:'1.mp3'
                },
                {
                    name:'宏愿',
                    singer:'周柏豪(Pakho)',
                    album:'Follow',
                    file:'2.mp3'
                }
            ],
            player:document.getElementById('player')
        },
        watch:{
            current_time: function (val, oldVal) {
                this.tag_current_time = this.format_time(val)
            },
            total_time: function (val, oldVal) {
                this.tag_total_time = this.format_time(val)
            }
        },
        methods: {
            play_or_stop: function (event) {
                if(this.play_state === 0)
                {
                    $('#btn-control svg').attr('data-icon','pause');
                    this.player.play();
                }
                else{
                    $('#btn-control svg').attr('data-icon','play');
                    this.player.pause();
                }
                this.play_state = 1 - this.play_state;
            },
            next_or_pre: function (move) {
                songs_num = this.songs.length;
                if(this.play_mode === 0)
                {
                    this.current_song = (this.current_song + move) % songs_num;
                    if(this.current_song < 0){
                        this.current_song = songs_num - 1;
                    }
                }else if(this.play_mode === 1){
                    this.current_song = Math.floor(Math.random() * songs_num);
                }
                $('#btn-control svg').attr('data-icon','pause');
                this.play_state = 1;
                this.update_song_information(this.songs[this.current_song]);
                this.player.play();
            },
            change_mode:function () {
                this.play_state = (this.play_state + 1) % 3;
                let icon_class = '';
                if(this.play_state === 0){
                    icon_class = 'list';
                }else if(this.play_state === 1){
                    icon_class = 'random';
                }else{
                    icon_class = 'retweet';
                }
                $('#icon-play-mode').attr('data-icon',icon_class);
            },
            update_song_information:function (song) {
                this.player.setAttribute('src',this.path + song.file);
                this.player.load();
                this.current_song_name = song.name;
                this.current_song_singer = song.singer;
                // this.total_time = this.player.duration;
            },
            update_current_time:function () {
                if(this.play_state === 1){
                    this.current_time = this.player.currentTime;
                    if(!this.progress_btn_state){
                        var per = Math.floor(this.player.currentTime / this.player.duration * 1000) / 10 + '%';
                        $('#progress-current').css('width', per);
                    }
                }
            },
            format_time(sec){
                return (Math.floor(sec / 60) / 100).toFixed(2).slice(-2) + ":" + (sec % 60 / 100).toFixed(2).slice(-2)
            }
        },
        mounted: function () {
            this.$nextTick(function () {
                this.player.oncanplay = function () {
                    index_container.total_time = index_container.player.duration;
                };
                this.update_song_information(this.songs[0]);
                $('#btn-progress').mousedown(function(e1) {
                    index_container.progress_btn_state = true;
                    offset_left = $('#container-progress').offset().left;
                    length_progress = $('#container-progress').width();
                    document.onmousemove = function(e2) {
                        e2 = e2 || window.event;
                        // console.log(e2.clientX);
                        dx = e2.clientX - offset_left;
                        console.log(dx);
                        var per = Math.max(Math.min(Math.floor(dx / length_progress * 1000) / 10, 100.0), 0.0) + '%';
                        console.log(per);
                        $('#progress-current').css('width', per);
                    };
                    // document.onmouseup = function(){
                    //     document.onmousemove = null; //弹起鼠标不做任何操作
                    // }
                    document.onmouseup = function (e3) {
                        if(index_container.progress_btn_state){
                            document.onmousemove = null;
                            dx = e3.pageX - offset_left;
                            per = Math.max(Math.min(Math.floor(dx / length_progress * 1000) / 1000, 1.00), 0.00);
                            new_time = per * index_container.player.duration;
                            index_container.player.currentTime = new_time;
                            index_container.current_time = new_time;
                            index_container.progress_btn_state = false;
                        }

                    };
                });
                setInterval(function () {
                    index_container.update_current_time();
                }, 1000)
            })
        }
    });
    // $('audio').mediaelementplayer({
    //     features: ['playpause','progress','current','tracks','fullscreen']
    // });
    var footer = new Vue({
        el: 'footer',
        data:data
    });
    // var container = new Vue({
    //     el: '#container',
    //     data: data
    // });


}


function loadJSON(callback) {

    var xobj = new XMLHttpRequest();
    xobj.overrideMimeType("application/json");
    xobj.open('GET', 'data/data.json', true); // Replace 'my_data' with the path to your file
    xobj.onreadystatechange = function () {
        if (xobj.readyState == 4 && xobj.status == "200") {
            // Required use of an anonymous callback as .open will NOT return a value but simply returns undefined in asynchronous mode
            callback(xobj.responseText);
        }
    };
    xobj.send(null);
}

function init() {
    loadJSON(function(response) {
        // Parse JSON string into object
        var actual_JSON = JSON.parse(response);
        console.log(actual_JSON);
        index_render(actual_JSON);
    });
}

init();


