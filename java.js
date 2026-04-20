const albums = [
  {
    id: 0,
    title: "Radiohead",
    artist: "Radiohead",
    cover: "Radiohead Kid A Bear.jpg",
    songs: [
      { title: "Creep",              duration: "3:56", src: "Radiohead - Creep.mp3" },
      { title: "Fake Plastic Trees", duration: "4:53", src: "Radiohead - Fake Plastic Trees(Lyrics).mp3" },
      { title: "No Surprises",       duration: "3:48", src: "Radiohead - No Surprises.mp3" },
      { title: "Karma Police",         duration: "4:23", src:"Radiohead - Karma Police.mp3" },
      { title: "Sail To The Moon",        duration: "4:19", src: "Sail To The Moon.mp3" },
    ]
  },
  {
    id: 1,
    title: "Bread ",
    artist: "Bread",
    cover: "Music Monday_  April 28, 2025.jpg",
    songs: [
      { title: "Everything I Own",          duration: "3:07", src:"Everything I Own.mp3"  },
      { title: "Make It With You",          duration: "3:13", src: "Make It with You.mp3" },
      { title: "If",                        duration: "2:36", src:"If.mp3"  },
      { title: "Guitar Man",                duration: "3:41", src: "Bread Guitar Man.mp3" },
      { title: "Aubrey",                    duration: "3:38", src: "Aubrey by Bread.mp3" },
    ]
  },
  {
    id: 2,
    title: "Laufey",
    artist: "Laufey",
    cover: "laufey.jpg",
    songs: [
      { title: "Silver Lining",             duration: "3:18", src: "Laufey - Silver Lining (Official Music Video).mp3" },
      { title: "From The Start",            duration: "2:50", src:"Laufey - From The Start (Official Music Video).mp3"},
      { title: "Lover Girl",                duration: "2:50", src: "Laufey - Lover Girl (Official Music Video).mp3" },
      { title: "Too little, Too Late",      duration: "3:54", src: "Too Little, Too Late.mp3" },
      { title: "Promise",                   duration: "3:54", src: "Laufey - Promise (Official Lyric Video With Chords).mp3" },
    ]
  },
  {
    id: 3,
    title: "Green Day",
    artist: "Green Day",
    cover: "greendays.jpg",
    songs: [
      { title: "Basket Case",                        duration: "3:02", src: "Basket Case - Green Day.mp3" },
      { title: "American Idiot",                     duration: "3:02", src: "american_idiot.mp3" },
      { title: "Boulevard of Broken Dreams",         duration: "4:20", src: "Boulevard of Broken Dreams.mp3" },
      { title: "Brain Stew",                         duration: "3:14", src: "Brain Stew.mp3" },
      { title: "Wake Me Up When September Ends",      duration: "4:46", src: "Green Day - Wake Me Up When September Ends (Official Audio).mp3" },
    ]
  },
  {
    id: 4,
    title: "Air Supply",
    artist: "Air Supply",
    cover: "AIR SUPPLY.jpg",
    songs: [
      { title: "Making Love Out of Nothing At All",         duration: "5:41", src: "Air Supply - Making Love Out Of Nothing At All (Lyrics).mp3" },
      { title: "All Out of Love",                           duration: "3:50", src: "Air Supply - All Out Of Love (Official Video).mp3" },
      { title: "Lonely is the Night",                       duration: "4:07", src: "LONELY IS THE NIGHT -  AIR SUPPLY lyrics.mp3" },
      { title: "Having You near Me",                        duration: "4:05", src: "Air Supply - Having You Near Me (lyrics).mp3" },
      { title: "Goodbye",                                   duration: "4:00", src: "Air Supply - Goodbye - Original Clip.mp3" },
    ]
  }
];

/* STATE*/
let currentAlbumIdx  = null;  // which album is open
let currentSongIdx   = null;  // which song is playing
let isPlaying        = false;

const audio = document.getElementById('audioPlayer');

/*INIT — Render album grids & sidebar */
function init() {
  renderAlbumGrid('albumsGrid');
  renderAlbumGrid('libraryGrid');
  renderSidebarAlbums();

  // Audio event listeners
  audio.addEventListener('timeupdate', onTimeUpdate);
  audio.addEventListener('ended', nextSong);
  audio.addEventListener('loadedmetadata', () => {
    document.getElementById('totalTime').textContent = formatTime(audio.duration);
  });

  audio.volume = parseFloat(document.getElementById('volumeSlider').value);
}

/*RENDER ALBUM GRID */
function renderAlbumGrid(containerId) {
  const grid = document.getElementById(containerId);
  grid.innerHTML = '';
  albums.forEach((album, idx) => {
    const card = document.createElement('div');
    card.className = 'album-card';
    card.id = `album-card-${containerId}-${idx}`;
    card.onclick = () => openAlbum(idx);
    card.innerHTML = `
      <div class="album-cover-wrap">
        <img src="${album.cover}" alt="${album.title}" loading="lazy"/>
        <div class="album-play-btn" onclick="event.stopPropagation(); playAlbum(${idx})">
          <svg viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
        </div>
      </div>
      <div class="album-title">${album.title}</div>
      <div class="album-artist">${album.artist}</div>
    `;
    grid.appendChild(card);
  });
}

/* -----------------------------------------------
   RENDER SIDEBAR ALBUMS
----------------------------------------------- */
function renderSidebarAlbums() {
  const container = document.getElementById('sidebarAlbums');
  container.innerHTML = '';
  albums.forEach((album, idx) => {
    const item = document.createElement('div');
    item.className = 'sidebar-album-item';
    item.id = `sidebar-album-${idx}`;
    item.onclick = () => openAlbum(idx);
    item.innerHTML = `
      <img src="${album.cover}" alt="${album.title}" loading="lazy"/>
      <div class="sidebar-album-info">
        <div class="sidebar-album-name">${album.title}</div>
        <div class="sidebar-album-artist">${album.artist}</div>
      </div>
    `;
    container.appendChild(item);
  });
}

/* -----------------------------------------------
   OPEN ALBUM — shows track list
----------------------------------------------- */
function openAlbum(idx) {
  currentAlbumIdx = idx;
  const album = albums[idx];

  // Highlight active album card
  document.querySelectorAll('.album-card').forEach(c => c.classList.remove('active'));
  document.querySelectorAll(`[id^="album-card-"]`).forEach(c => {
    if (c.id.endsWith(`-${idx}`)) c.classList.add('active');
  });
  document.querySelectorAll('.sidebar-album-item').forEach(c => c.classList.remove('active'));
  document.getElementById(`sidebar-album-${idx}`)?.classList.add('active');

  // Populate tracklist
  document.getElementById('tlCover').src = album.cover;
  document.getElementById('tlTitle').textContent = album.title;
  document.getElementById('tlArtist').textContent = album.artist;

  const trackList = document.getElementById('trackList');
  trackList.innerHTML = '';
  album.songs.forEach((song, sIdx) => {
    const li = document.createElement('li');
    li.className = 'track-item';
    li.id = `track-${idx}-${sIdx}`;
    li.onclick = () => playSong(idx, sIdx);
    li.innerHTML = `
      <div class="track-num">${sIdx + 1}</div>
      <div class="track-info">
        <div class="track-name">${song.title}</div>
        <div class="track-album-name">${album.title}</div>
      </div>
      <div class="track-duration">${song.duration}</div>
    `;
    trackList.appendChild(li);
  });

  // Show section
  document.getElementById('tracklistSection').classList.remove('hidden');

  // Scroll to tracklist
  document.getElementById('tracklistSection').scrollIntoView({ behavior: 'smooth', block: 'nearest' });

  // Make sure we're in home view
  if (!document.getElementById('view-home').classList.contains('active')) {
    switchView('home', document.querySelector('[data-view="home"]'));
  }
}

/* -----------------------------------------------
   PLAY AN ENTIRE ALBUM (from card play button)
----------------------------------------------- */
function playAlbum(idx) {
  openAlbum(idx);
  playSong(idx, 0);
}

/* -----------------------------------------------
   PLAY A SPECIFIC SONG
----------------------------------------------- */
function playSong(albumIdx, songIdx) {
  const album = albums[albumIdx];
  const song  = album.songs[songIdx];

  currentAlbumIdx = albumIdx;
  currentSongIdx  = songIdx;

  // Update audio source
  audio.src = song.src;
  audio.play().catch(() => {});
  isPlaying = true;

  // Update player UI
  document.getElementById('playerCover').src = album.cover;
  document.getElementById('playerTitle').textContent = song.title;
  document.getElementById('playerArtist').textContent = album.artist;

  updatePlayPauseIcon();
  highlightCurrentTrack();
}

/* -----------------------------------------------
   TOGGLE PLAY / PAUSE
----------------------------------------------- */
function togglePlay() {
  if (currentSongIdx === null) {
    // Nothing loaded — auto-play first song
    playSong(0, 0);
    return;
  }
  if (isPlaying) {
    audio.pause();
    isPlaying = false;
  } else {
    audio.play().catch(() => {});
    isPlaying = true;
  }
  updatePlayPauseIcon();
}

/* -----------------------------------------------
   NEXT / PREV
----------------------------------------------- */
function nextSong() {
  if (currentAlbumIdx === null) return;
  const album = albums[currentAlbumIdx];
  const next  = (currentSongIdx + 1) % album.songs.length;
  playSong(currentAlbumIdx, next);
}

function prevSong() {
  if (currentAlbumIdx === null) return;
  // If past 3s, restart; else go previous
  if (audio.currentTime > 3) {
    audio.currentTime = 0;
    return;
  }
  const album = albums[currentAlbumIdx];
  const prev  = (currentSongIdx - 1 + album.songs.length) % album.songs.length;
  playSong(currentAlbumIdx, prev);
}

/* -----------------------------------------------
   PROGRESS BAR
----------------------------------------------- */
function onTimeUpdate() {
  if (!audio.duration) return;
  const pct = (audio.currentTime / audio.duration) * 100;
  document.getElementById('progressFill').style.width = pct + '%';
  document.getElementById('currentTime').textContent = formatTime(audio.currentTime);
}

function seekTo(e) {
  const track = document.getElementById('progressTrack');
  const rect  = track.getBoundingClientRect();
  const pct   = (e.clientX - rect.left) / rect.width;
  audio.currentTime = pct * audio.duration;
}

/* -----------------------------------------------
   VOLUME
----------------------------------------------- */
function setVolume(val) {
  audio.volume = parseFloat(val);
}

/* -----------------------------------------------
   FORMAT TIME — seconds → M:SS
----------------------------------------------- */
function formatTime(secs) {
  if (!secs || isNaN(secs)) return '0:00';
  const m = Math.floor(secs / 60);
  const s = Math.floor(secs % 60).toString().padStart(2, '0');
  return `${m}:${s}`;
}

/* -----------------------------------------------
   UPDATE PLAY/PAUSE ICON
----------------------------------------------- */
function updatePlayPauseIcon() {
  document.getElementById('iconPlay').classList.toggle('hidden', isPlaying);
  document.getElementById('iconPause').classList.toggle('hidden', !isPlaying);
}

/* -----------------------------------------------
   HIGHLIGHT CURRENT TRACK ROW
----------------------------------------------- */
function highlightCurrentTrack() {
  // Remove all highlights
  document.querySelectorAll('.track-item').forEach(el => {
    el.classList.remove('playing');
    const num = el.querySelector('.track-num');
    // Restore number (remove bars if any)
    if (num.querySelector('.bars')) {
      num.innerHTML = num.dataset.orig || '';
    }
  });

  const key = `track-${currentAlbumIdx}-${currentSongIdx}`;
  const row = document.getElementById(key);
  if (!row) return;
  row.classList.add('playing');
  const num = row.querySelector('.track-num');
  num.dataset.orig = num.textContent;
  num.innerHTML = `<div class="bars"><span></span><span></span><span></span></div>`;
}

/* -----------------------------------------------
   VIEW SWITCHING (Home / Search / Library)
----------------------------------------------- */
function switchView(viewId, navEl) {
  document.querySelectorAll('.view').forEach(v => v.classList.remove('active'));
  document.getElementById(`view-${viewId}`).classList.add('active');
  document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
  navEl.classList.add('active');
}

/* -----------------------------------------------
   SEARCH
----------------------------------------------- */
function handleSearch(query) {
  const results = document.getElementById('searchResults');
  results.innerHTML = '';
  if (!query.trim()) return;

  const q = query.toLowerCase();
  albums.forEach((album, aIdx) => {
    album.songs.forEach((song, sIdx) => {
      const match =
        song.title.toLowerCase().includes(q) ||
        album.title.toLowerCase().includes(q) ||
        album.artist.toLowerCase().includes(q);
      if (!match) return;

      const li = document.createElement('li');
      li.className = 'track-item';
      li.onclick = () => {
        openAlbum(aIdx);
        playSong(aIdx, sIdx);
      };
      li.innerHTML = `
        <div class="track-num">${sIdx + 1}</div>
        <div class="track-info">
          <div class="track-name">${song.title}</div>
          <div class="track-album-name">${album.title} · ${album.artist}</div>
        </div>
        <div class="track-duration">${song.duration}</div>
      `;
      results.appendChild(li);
    });
  });

  if (!results.children.length) {
    results.innerHTML = `<li style="padding:20px;color:var(--text-muted);text-align:center;">No results for "${query}"</li>`;
  }
}

/* -----------------------------------------------
   BOOT
----------------------------------------------- */
init();