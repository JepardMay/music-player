const musicContainer = document.getElementById('music-container');
const musicInfo = document.getElementById('music-info');
const playBtn = document.getElementById('play');
const prevBtn = document.getElementById('prev');
const nextBtn = document.getElementById('next');
const random = document.getElementById('random');
const repeat = document.getElementById('repeat');
const audio = document.getElementById('audio');
const progress = document.getElementById('progress');
const progressContainer = document.getElementById('progress-container');
const title = document.getElementById('title');
const cover = document.getElementById('cover');
const timestamp = document.getElementById('timestamp');
const orderContainer = document.getElementById('order-container');

// Song titles
const initialSongs = ['allthat', 'badass', 'downtown', 'hey', 'sadday', 'slowmotion', 'summer', 'ukulele'];
let songs = [...initialSongs];

// Keep track of song
let songIndex = 7;

// Initially load song details info DOM
loadSong(songs[songIndex]);

// Update song details
function loadSong(song) {
	title.innerText = song;
	audio.src = `music/${song}.mp3`;
	cover.src = `images/${song}.jpg`;
}

// Play song
function playSong() {
	updateTimestamp();
	musicContainer.classList.add('play');
	musicInfo.classList.add('show');
	playBtn.querySelector('i.fa').classList.remove('fa-play');
	playBtn.querySelector('i.fa').classList.add('fa-pause');

	audio.play();
}

// Pause song
function pauseSong() {
	musicContainer.classList.remove('play');
	playBtn.querySelector('i.fa').classList.add('fa-play');
	playBtn.querySelector('i.fa').classList.remove('fa-pause');

	audio.pause();
}

// Previous song
function prevSong() {
	songIndex--;

	if (songIndex < 0) {
		songIndex = song.length - 1;
	}

	makeOrderList();

	loadSong(songs[songIndex]);

	playSong();
}

// Next song
function nextSong() {
	songIndex++;

	if (songIndex > songs.length - 1) {
		songIndex = 0;
	}

	makeOrderList();

	loadSong(songs[songIndex]);

	playSong();
}

// Get song duration
function getSongDuration() {
	let allMins = Math.floor(audio.duration / 60);
	if (allMins < 10) {
		allMins = '0' + String(allMins);
	}

	let allSecs = Math.floor(audio.duration % 60);
	if (allSecs < 10) {
		allSecs = '0' + String(allSecs);
	}

	if (allMins && allSecs) {
		return `${allMins}:${allSecs}`;
	} else {
		return '00:00';
	}
}

// Update timestamp
function updateTimestamp() {
	// Get minutes
	let mins = Math.floor(audio.currentTime / 60);
	if (mins < 10) {
		mins = '0' + String(mins);
	}

	// Get seconds
	let secs = Math.floor(audio.currentTime % 60);
	if (secs < 10) {
		secs = '0' + String(secs);
	}

	if (mins && secs) {
		timestamp.innerHTML = `${mins}:${secs} / ${getSongDuration()}`;
	} else {
		timestamp.innerHTML = '00:00 / 00:00';
	}
}

// Update progress bar
function updateProgress(e) {
	const { duration, currentTime } = e.srcElement;
	const progressPercent = (currentTime / duration) * 100;
	progress.style.width = `${progressPercent}%`;

	updateTimestamp();
}

// Set progress bar & timestamp
function setProgress(e) {
	const width = this.clientWidth;
	const clickX = e.offsetX;
	const duration = audio.duration;

	audio.currentTime = (clickX / width) * duration;
	updateTimestamp();
}

// Set song on repeat
function repeatSong() {
	if (repeat.classList.contains('active')) {
		repeat.classList.remove('active');
		audio.removeAttribute('loop');
	} else {
		repeat.classList.add('active');
		audio.setAttribute('loop', 'loop');
	}
}

// Set song on repeat
function setRandomOrder() {
	if (random.classList.contains('active')) {
		random.classList.remove('active');
		songs = [...initialSongs];
		songIndex = songs.indexOf(title.innerText);
	} else {
		random.classList.add('active');
		songs = shuffle(songs);
		songIndex = songs.indexOf(title.innerText);
	}

	makeOrderList();
}

// Shuffle songs
function shuffle(songs) {
	for (let i = songs.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * (i + 1));
		[songs[i], songs[j]] = [songs[j], songs[i]];
	}
	return songs;
}

// Make songs order list
function makeOrderList() {
	orderContainer.innerHTML = `
	<summary><i class="fa fa-sort-down fa-2x"></i><h2>Queue</h2></summary>
	<ul>
	${songs
		.map((song, index) => {
			let className = '';
			if (songs.indexOf(song) < songIndex) {
				className = 'prev';
			} else if (songs.indexOf(song) === songIndex) {
				className = 'current';
			}
			return `
				<li onClick="setSong(${index})" class="${className}">
					<img src="images/${song}.jpg" alt="music-cover" />
					<h5>${song}</h5>
				</li>
			`;
		})
		.join('')}
	</ul>`;
}

// Set song on click
function setSong(i) {
	songIndex = i;
	console.log('setSong -> songIndex', songIndex);

	makeOrderList();

	loadSong(songs[songIndex]);

	playSong();
}

makeOrderList();

// Event listeners
playBtn.addEventListener('click', () => {
	const isPlaying = musicContainer.classList.contains('play');

	if (isPlaying) {
		pauseSong();
	} else {
		playSong();
	}
});

// Change song
prevBtn.addEventListener('click', prevSong);
nextBtn.addEventListener('click', nextSong);

// Time/song update
audio.addEventListener('timeupdate', updateProgress);

// Click on progress bar
progressContainer.addEventListener('click', setProgress);

// Song ends
audio.addEventListener('ended', nextSong);

// Repeat song
repeat.addEventListener('click', repeatSong);

// Random songs order
random.addEventListener('click', setRandomOrder);
