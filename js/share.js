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
            play_state:0,
            current_song:0,
            volume:1.0,
            path:'music/',
            song_list:['1.mp3','2.mp3'],
            player:document.getElementById('player')
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
                this.current_song = (this.current_song + move) % this.song_list.length;
                if(this.current_song < 0){
                    this.current_song = this.song_list.length - 1;
                }
                $('#btn-control svg').attr('data-icon','pause');
                this.play_state = 1;
                this.player.setAttribute('src',this.path + this.song_list[this.current_song]);
                this.player.load();
                this.player.play();
            },
        },
        mounted: function () {
            this.$nextTick(function () {

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


