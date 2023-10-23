const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

const PLAYER_STORAGE = 'player-storage'

const heading = $('header h2')
const cd = $('.cd')
const playList = $('.playlist')
const cdThumb = $('.cd-thumb')
const audio = $('#audio')
const playBtn = $('.btn-toggle-play')
const player = $('.player')
const progress = $('#progress')
const progressBar = $('.time-progress-bar')
const progressInner = $('.time-progress-bar-inner')
const repeatBtn = $('.btn-repeat')
const nextBtn = $('.btn-next')
const prevBtn = $('.btn-prev')
const randomBtn = $('.btn-random')
const timeCurrent = $('#time-current')
const timeTotal = $('#time-total')

const app = {
    currentIndex: 0,
    isPlaying: false,
    isRandomSong: false,
    isReapetingSong: false,
    config: JSON.parse(localStorage.getItem(PLAYER_STORAGE)) || {},
    songs: [
        {
            name: " Fly Away",
            singer: "TheFatRat Anjulie",
            path: "./access/listSongs/FlyAway-TheFatRatAnjulie.mp3",
            image: "./access/listImgs/theFatRat.jpg"
        },
        {
            name: "Sao Mình Chưa Nắm Tay Nhau Remix",
            singer: " lofi chill",
            path: "./access/listSongs/Sao Mình Chưa Nắm Tay Nhau  lofi chill.mp3",
            image: "./access/listImgs/saominhchuanamtaynhau.jpg"
        },
        {
            name: "Đoá Quỳnh Lan",
            singer: "YuniBoo, H2K",
            path: "./access/listSongs/DoaQuynhLanRemix.mp3",
            image: "./access/listImgs/doaquynhlan.jpg"
        },
        {
            name: "Bạn Tình Ơi (Htrol Remix)",
            singer: "Yuni Boo, Goctoi Mixer, Htrol",
            path: "./access/listSongs/BanTinhOiHtrolRemix.mp3",
            image: "./access/listImgs/bantinhoi.jpg"
        },
        {
            name: "Sao Mình Chưa Nắm Tay Nhau Remix",
            singer: "Yan Nguyễn",
            path: "./access/listSongs/SaoMinhChuaNamTayNhauRemix.mp3",
            image: "./access/listImgs/saominhchuanamtaynhau.jpg"
        },
        {
            name: "Phai dấu cuộc tình",
            singer: "Dj",
            path: "./access/listSongs/PhaiDauCuocTinhRemixTbynzRemix.mp3",
            image: "./access/listImgs/phaidaucuoctinh.jpg"
        },
        {
            name: "Người Thay Thế Em (Qinn Remix)",
            singer: "Hoàng Lan Iris, Jin Tuấn Nam, Qinn Media",
            path: "./access/listSongs/NguoiThayTheEmQinnRemix.mp3",
            image: "./access/listImgs/nguoithaytheem.jpg"
        },
        {
            name: "Nên Chờ Hay Nên Quên Remix",
            singer: "NightCore",
            path: "./access/listSongs/NenChoHayNenQuenRemix.mp3",
            image: "./access/listImgs/nenchohaynenquen.jpeg"
        }
    ],
    defineProperties: function () {
        Object.defineProperty(this, 'currentSong', {
            get: function () {
                return this.songs[this.currentIndex]
            }
        })
    },
    setConfig: function (key, value) {
        this.config[key] = value
        localStorage.setItem(PLAYER_STORAGE, JSON.stringify(this.config))
    },
    render: function () {
        const html = this.songs.map((song, index) =>

            `<div class="song ${index === 0 ? 'active' : ''}" data-index=${index}>
                <div class="thumb"
                    style="background-image: url('${song.image}')">
                </div>
                <div class="body">
                    <h3 class="title">${song.name}</h3>
                    <p class="author">${song.singer}</p>
                </div>
                <div class="option">
                    <i class="fas fa-ellipsis-h"></i>
                </div>
            </div>`
        )
        playList.innerHTML = html.join('')
    },
    handdleEvents: function () {
        const cdWidth = cd.offsetWidth
        var startX;

        const cdThumbAnimate = cdThumb.animate([
            { transform: 'rotate(0deg)' },
            { transform: 'rotate(360deg)' },
        ], {
            duration: 10000,
            iterations: Infinity
        });

        cdThumbAnimate.pause()

        document.onscroll = function () {
            const scrollTop = document.documentElement.scrollTop || window.scrollY
            const newCdWidth = cdWidth - scrollTop

            cd.style.width = newCdWidth > 0 ? newCdWidth + 'px' : 0
            cd.style.opacity = newCdWidth / cdWidth
        }

        //xu ly play button
        playBtn.onclick = function () {
            if (app.isPlaying) {
                audio.pause()
                cdThumbAnimate.pause()
            } else {
                audio.play()
                cdThumbAnimate.play()
            }
        }

        //nghe sk play
        audio.onplay = function () {
            app.isPlaying = true
            app.setConfig('isPlaying', app.isPlaying)
            player.classList.add('playing')
        }

        //nghe sk pause
        audio.onpause = function () {
            app.isPlaying = false
            app.setConfig('isPlaying', app.isPlaying)
            player.classList.remove('playing')
        }

        // phát bài nhạc tiếp theo khi bài hát kết thúc
        audio.onended = function () {
            if (app.isReapetingSong)
                app.play()
            else
                nextBtn.click()
        }

        // time of song playing and progress bar showing
        audio.ontimeupdate = function () {
            if (audio.duration) {
                timeTotal.textContent = formatTime(audio.duration)
                timeCurrent.textContent = formatTime(audio.currentTime)

                progress.value = Math.floor(audio.currentTime / audio.duration * 100)
                progressBar.style.width = Math.floor(audio.currentTime / audio.duration * 100) + '%'
            }
        }
        // Update time play music by progress bar  
        progress.onchange = function (e) {
            const seekTime = audio.duration * e.target.value / 100
            audio.currentTime = seekTime
        }

        // next song
        nextBtn.onclick = function () {
            if (app.isRandomSong)
                app.playRandomSong()
            else
                app.nextSong()
            app.activeListSong()
            audio.play()
            app.scrollToActiveSong()
        }
        // prev song
        prevBtn.onclick = function () {
            if (app.isRandomSong)
                app.playRandomSong()
            else {
                app.prevSong()
            }
            app.activeListSong()
            audio.play()
            app.scrollToActiveSong()
        }

        // random song
        randomBtn.onclick = function () {
            if (app.isReapetingSong) {
                app.isReapetingSong = false;
                repeatBtn.classList.remove('active')
            }
            app.isRandomSong = !app.isRandomSong;
            app.setConfig('isRandomSong', app.isRandomSong)
            randomBtn.classList.toggle('active', app.isRandomSong)
        }
        //repeat song
        repeatBtn.onclick = function () {
            if (app.isRandomSong) {
                app.isRandomSong = false;
                randomBtn.classList.remove('active')
            }
            app.isReapetingSong = !app.isReapetingSong;
            app.setConfig('isReapetingSong', app.isReapetingSong)
            repeatBtn.classList.toggle('active', app.isReapetingSong)
        }
        //play list click
        playList.onclick = function (e) {
            const songNode = e.target.closest('.song:not(.active)')
            if (songNode || !e.target.closest('.option')) {
                //click vao song
                if (songNode) {
                    app.currentIndex = parseInt(songNode.dataset.index)
                    app.loadCurrentSong()
                    app.activeListSong()
                    audio.play()
                }
            }
        }
    },
    loadCurrentSong: function () {
        audio.src = this.currentSong.path
        heading.textContent = this.currentSong.name
        cdThumb.style.backgroundImage = `url(${this.currentSong.image})`
    },
    loadConfig: function () {
        this.isPlaying = this.config.isPlaying
        this.isRandomSong = this.config.isRandomSong
        this.isReapetingSong = this.config.isReapeting
        if (this.isRandomSong)
            randomBtn.classList.toggle('active', app.isRandomSong)
        else if (this.isReapetingSong)
            repeatBtn.classList.toggle('active', app.isReapetingSong)
    },
    nextSong: function () {
        this.currentIndex++;
        if (this.currentIndex >= this.songs.length)
            this.currentIndex = 0;
        this.loadCurrentSong()
    },
    prevSong: function () {
        this.currentIndex--;
        if (this.currentIndex < 0)
            this.currentIndex = this.songs.length - 1;
        this.loadCurrentSong()
    },
    playRandomSong: function () {
        let newIndex
        do {
            newIndex = Math.floor(Math.random() * this.songs.length)
        } while (newIndex === this.currentIndex);
        this.currentIndex = newIndex;
        this.loadCurrentSong()
    },
    activeListSong: function activeSong() {
        $('.song.active').classList.remove('active')
        $(`.song:nth-child(${this.currentIndex + 1})`).classList.add('active')
    },
    scrollToActiveSong: function () {
        setTimeout(function () {
            $('.song.active').scrollIntoView({
                behavior: 'smooth',
                block: 'nearest'
            })
        }, 250)
    },
    start: function () {
        //gán cấu hình config 
        this.loadConfig()
        //định nghĩa các thuộc tính cho app
        this.defineProperties()
        //lắng nghe/ xử lý sk
        this.handdleEvents();
        //tải bài hát đầu tiên vào UI
        this.loadCurrentSong()
        //render bài hát
        this.render();
    }
}
function formatTime(time) {
    var min = Math.floor(time / 60)
    var sec = parseInt(time - min * 60)
    return (min < 10 ? '0' + min : min) + ' : ' + (sec < 10 ? '0' + sec : sec)
}

app.start();