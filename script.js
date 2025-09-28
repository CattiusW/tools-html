/* Tab navigation */
const tabs = document.querySelectorAll('.tab-btn');
const tools = document.querySelectorAll('.tool');
tabs.forEach(tab => {
  tab.addEventListener('click', () => {
    resetAllTools();
    tabs.forEach(t => t.classList.remove('active'));
    tab.classList.add('active');
    tools.forEach(tool => tool.classList.remove('active'));
    document.getElementById(tab.dataset.tool).classList.add('active');
  });
});

/* Base64 Converter */
const base64Input = document.getElementById('base64-input');
const base64Output = document.getElementById('base64-output');
const base64Stats = document.getElementById('base64-stats');
let updating = false;
function updateStats() {
  const plainLen = base64Input.value.length;
  const baseLen = base64Output.value.length;
  base64Stats.textContent = `Plaintext Length: ${plainLen} | Base64 Length: ${baseLen} | Difference: ${baseLen - plainLen}`;
}
base64Input.addEventListener('input', () => {
  if(updating) return;
  try { updating=true; base64Output.value=btoa(base64Input.value); } catch { base64Output.value='Invalid input'; }
  finally { updating=false; updateStats(); }
});
base64Output.addEventListener('input', () => {
  if(updating) return;
  try { updating=true; base64Input.value=atob(base64Output.value); } catch { base64Input.value='Invalid Base64'; }
  finally { updating=false; updateStats(); }
});
updateStats();

/* Reaction Time */
const reactionBox = document.getElementById('reaction');
let reactionStart, reactionTimeout, waiting=false;
function resetReaction() {
  reactionBox.style.backgroundColor='#000';
  reactionBox.style.color='#fff';
  reactionBox.textContent='Click to start';
  waiting=false;
  clearTimeout(reactionTimeout);
}
function startReaction() {
  reactionBox.style.backgroundColor='#000';
  reactionBox.style.color='';
  reactionBox.textContent='Wait...';
  waiting=true;
  const delay = Math.random()*300 + 200;
  reactionTimeout=setTimeout(() => {
    reactionBox.style.backgroundColor='#fff';
    reactionBox.style.color='#000';
    reactionBox.textContent='CLICK!';
    reactionStart=Date.now();
  }, delay);
}
reactionBox.onclick = () => {
  if(!waiting) { startReaction(); return; }
  const bg = getComputedStyle(reactionBox).backgroundColor;
  if(bg==='rgb(0, 0, 0)') { reactionBox.textContent='Too early! Click to try again'; waiting=false; clearTimeout(reactionTimeout); }
  else if(bg==='rgb(255, 255, 255)') { const reactionTime=Date.now()-reactionStart; reactionBox.textContent=`Reaction time: ${reactionTime} ms`; reactionBox.style.backgroundColor='#000'; reactionBox.style.color='#fff'; waiting=false; }
};

/* Pomodoro Timer */
let pomodoroInterval, pomodoroTime=25*60, isWork=true;
function updatePomodoro() {
  const min=String(Math.floor(pomodoroTime/60)).padStart(2,'0');
  const sec=String(Math.floor(pomodoroTime%60)).padStart(2,'0');
  document.getElementById('pomodoro-display').textContent=`${min}:${sec}`;
  document.getElementById('pomodoro-mode').textContent=`Mode: ${isWork?'Work':'Break'}`;
  if(pomodoroTime>0) pomodoroTime--; else switchPomodoro();
}
function startPomodoro(){ clearInterval(pomodoroInterval); pomodoroInterval=setInterval(updatePomodoro,1000); }
function stopPomodoro(){ clearInterval(pomodoroInterval); }
function switchPomodoro(){ isWork=!isWork; pomodoroTime=isWork?25*60:5*60; updatePomodoro(); }
function skipPomodoro(){ switchPomodoro(); }
function resetPomodoro(){ clearInterval(pomodoroInterval); isWork=true; pomodoroTime=25*60; updatePomodoro(); }

/* Stopwatch */
let stopwatchInterval, stopwatchTime=0;
function updateStopwatch(){
  stopwatchTime++;
  const h=String(Math.floor(stopwatchTime/3600)).padStart(2,'0');
  const m=String(Math.floor((stopwatchTime%3600)/60)).padStart(2,'0');
  const s=String(stopwatchTime%60).padStart(2,'0');
  document.getElementById('stopwatch-display').textContent=`${h}:${m}:${s}`;
}
function startStopwatch(){ clearInterval(stopwatchInterval); stopwatchInterval=setInterval(updateStopwatch,1000); }
function stopStopwatch(){ clearInterval(stopwatchInterval); }
function resetStopwatch(){ clearInterval(stopwatchInterval); stopwatchTime=-1; updateStopwatch(); }

/* Countdown Timer */
let countdownInterval, countdownTime=0;
function startCountdown(){
  const h=parseInt(document.getElementById('countdown-hours').value)||0;
  const m=parseInt(document.getElementById('countdown-minutes').value)||0;
  const s=parseInt(document.getElementById('countdown-seconds').value)||0;
  countdownTime=h*3600+m*60+s;
  if(countdownTime<=0) return;
  clearInterval(countdownInterval);
  updateCountdown();
  countdownInterval=setInterval(updateCountdown,1000);
}
function updateCountdown(){
  if(countdownTime<=0){ clearInterval(countdownInterval); document.getElementById('countdown-display').textContent='Time is up!'; return; }
  const h=String(Math.floor(countdownTime/3600)).padStart(2,'0');
  const m=String(Math.floor((countdownTime%3600)/60)).padStart(2,'0');
  const s=String(countdownTime%60).padStart(2,'0');
  document.getElementById('countdown-display').textContent=`${h}:${m}:${s}`;
  countdownTime--;
}
function stopCountdown(){ clearInterval(countdownInterval); }
function resetCountdown(){ clearInterval(countdownInterval); countdownTime=0; document.getElementById('countdown-display').textContent='00:00:00'; document.getElementById('countdown-hours').value=''; document.getElementById('countdown-minutes').value=''; document.getElementById('countdown-seconds').value=''; }

/* Random Number */
function generateRandom(){
  const min=parseInt(document.getElementById('rand-min').value);
  const max=parseInt(document.getElementById('rand-max').value);
  if(isNaN(min)||isNaN(max)||min>max){ document.getElementById('rand-result').textContent='Invalid range'; return; }
  document.getElementById('rand-result').textContent='Result: '+(Math.floor(Math.random()*(max-min+1))+min);
}

/* Current Time */
function updateTime(){
  const now=new Date();
  document.getElementById('current-time').textContent=now.toLocaleTimeString();
  document.getElementById('current-date').textContent=now.toLocaleDateString(undefined,{ weekday:'long', year:'numeric', month:'long', day:'numeric' });
}
setInterval(updateTime,1000); updateTime();

/* Browser Info */
async function loadBrowserInfo(){
  const infoEl=document.getElementById('browser-info'); infoEl.textContent="Loading...";
  try{
    const ipRes=await fetch("https://api.ipify.org?format=json");
    const ipData=await ipRes.json(); const ip=ipData.ip;
    const locRes=await fetch(`https://ipapi.co/${ip}/json/`);
    const locData=await locRes.json();
    const info={
      ip:ip,
      city:locData.city||'Unknown',
      region:locData.region||'Unknown',
      country:locData.country_name||'Unknown',
      countryCode:locData.country||'Unknown',
      postal:locData.postal||'Unknown',
      org:locData.org||'Unknown',
      timezone:locData.timezone||'Unknown',
      userAgent:navigator.userAgent,
      windowWidth:window.innerWidth,
      windowHeight:window.innerHeight,
      windowRatio:(window.innerWidth/window.innerHeight).toFixed(2),
      screenWidth:window.screen.availWidth,
      screenHeight:window.screen.availHeight,
      screenRatio:(window.screen.availWidth/window.screen.availHeight).toFixed(2),
      colorDepth:window.screen.colorDepth,
      doNotTrack:navigator.doNotTrack==="1"?"Enabled":"Disabled",
      globalPrivacyControl:navigator.globalPrivacyControl,
      cookies:navigator.cookieEnabled,
      webGLEnabled:!!window.WebGLRenderingContext,
      browserLanguage:navigator.language,
      cpuThreads:navigator.hardwareConcurrency,
    };
    infoEl.innerHTML=`<ul style="list-style:none;">
      <li><b>IP Address:</b> ${info.ip}</li>
      <li><b>City:</b> ${info.city}</li>
      <li><b>Region:</b> ${info.region}</li>
      <li><b>Country:</b> ${info.country} (${info.countryCode})</li>
      <li><b>Postal:</b> ${info.postal}</li>
      <li><b>Organization:</b> ${info.org}</li>
      <li><b>Timezone:</b> ${info.timezone}</li>
      <li><b>User Agent:</b> ${info.userAgent}</li>
      <li><b>Window:</b> ${info.windowWidth} x ${info.windowHeight} (Ratio: ${info.windowRatio})</li>
      <li><b>Screen:</b> ${info.screenWidth} x ${info.screenHeight} (Ratio: ${info.screenRatio})</li>
      <li><b>Color Depth:</b> ${info.colorDepth}</li>
      <li><b>Do Not Track:</b> ${info.doNotTrack}</li>
      <li><b>Global Privacy Control:</b> ${info.globalPrivacyControl}</li>
      <li><b>Cookies Enabled:</b> ${info.cookies}</li>
      <li><b>WebGL Enabled:</b> ${info.webGLEnabled}</li>
      <li><b>Browser Language:</b> ${info.browserLanguage}</li>
      <li><b>CPU Threads:</b> ${info.cpuThreads}</li>
    </ul>`;
  } catch(err){ infoEl.textContent="Failed to load browser info: "+err; }
}
document.querySelector('[data-tool="browser"]').addEventListener('click', loadBrowserInfo);

/* QR Code Generator */
const qrInput = document.getElementById('qr-input');
const qrButton = document.getElementById('qr-generate');
const qrResult = document.getElementById('qr-result');
let qr;
qrButton.addEventListener('click', function() {
  const value = qrInput.value.trim();
  qrResult.innerHTML = '';
  if (!value) {
    qrResult.textContent = 'Please enter text or a URL.';
    return;
  }
  qr = new QRious({
    element: document.createElement('canvas'),
    value: value,
    size: 220,
    background: '#fff',
    foreground: '#222',
    level: 'H'
  });
  qrResult.appendChild(qr.element);
});

/* Whitespace Remover - automatic and stats */
const wsInput = document.getElementById('ws-input');
const wsOutput = document.getElementById('ws-output');
const wsStats = document.getElementById('ws-stats');
function updateWhitespace() {
  const plain = wsInput.value;
  const result = plain.replace(/\s+/g, '');
  wsOutput.value = result;
  wsStats.textContent = `Plaintext Length: ${plain.length} | Result Length: ${result.length} | Difference: ${result.length - plain.length}`;
}
wsInput.addEventListener('input', updateWhitespace);
updateWhitespace();

/* URL Encoder - automatic and stats */
const urlencodeInput = document.getElementById('urlencode-input');
const urlencodeOutput = document.getElementById('urlencode-output');
const urlencodeStats = document.getElementById('urlencode-stats');
function updateUrlencode() {
  const plain = urlencodeInput.value;
  const encoded = encodeURIComponent(plain);
  urlencodeOutput.value = encoded;
  urlencodeStats.textContent = `Plaintext Length: ${plain.length} | Encoded Length: ${encoded.length} | Difference: ${encoded.length - plain.length}`;
}
urlencodeInput.addEventListener('input', updateUrlencode);
updateUrlencode();

/* about:blank Embedder - open URL in about:blank with iframe */
const aboutblankUrl = document.getElementById('aboutblank-url');
const aboutblankOpen = document.getElementById('aboutblank-open');
aboutblankOpen.addEventListener('click', function() {
  const url = aboutblankUrl.value.trim();
  if (!url) return;
  const win = window.open('about:blank');
  if (win) {
    win.document.open();
    win.document.write(`<iframe src='${url.replace(/'/g, "&#39;")}' style='width:100vw;height:100vh;border:none;'></iframe>`);
    win.document.close();
  }
});

/* Study Music Player - FontAwesome icons, no circle */
const musicList = document.getElementById('music-list');
const musicAudio = document.getElementById('music-audio');
const musicNowPlaying = document.getElementById('music-nowplaying');
let currentTrackIndex = -1;
fetch('music.json')
  .then(res => res.json())
  .then(tracks => {
    musicList.innerHTML = '<ul id="music-ul" style="list-style:none;padding:0;margin:0;"></ul>';
    const ul = document.getElementById('music-ul');
    tracks.forEach((track, i) => {
      const li = document.createElement('li');
      li.style.marginBottom = '8px';
      li.style.display = 'flex';
      li.style.alignItems = 'center';
      li.style.gap = '12px';
      const btn = document.createElement('button');
      btn.innerHTML = '<i class="fas fa-play"></i>';
      btn.className = 'music-track-btn';
      btn.style.background = 'none';
      btn.style.color = '#ff9900';
      btn.style.fontWeight = 'bold';
      btn.style.fontSize = '1.2rem';
      btn.style.border = 'none';
      btn.style.cursor = 'pointer';
      btn.style.transition = 'color 0.2s';
      btn.onmouseenter = () => { btn.style.color = '#ff9900'; };
      btn.onmouseleave = () => { btn.style.color = '#ff9900'; };
      btn.onclick = () => {
        musicAudio.src = track.mp3;
        musicAudio.style.display = 'block';
        musicAudio.play();
        musicNowPlaying.textContent = `Now Playing: ${track.title} — ${track.artist}`;
        highlightTrack(i);
      };
      const info = document.createElement('span');
      info.textContent = `${i+1}. ${track.title} — ${track.artist}`;
      info.style.flex = '1';
      info.style.color = '#fff';
      info.style.fontSize = '1.08rem';
      info.style.fontWeight = '500';
      li.appendChild(btn);
      li.appendChild(info);
      ul.appendChild(li);
    });
    function highlightTrack(idx) {
      Array.from(ul.children).forEach((li, j) => {
        if (j === idx) {
          li.style.background = '#ff9900';
          li.style.borderRadius = '8px';
          li.querySelector('span').style.color = '#222';
        } else {
          li.style.background = '';
          li.querySelector('span').style.color = '#fff';
        }
      });
      currentTrackIndex = idx;
    }
    musicAudio.addEventListener('ended', () => {
      if (currentTrackIndex >= 0 && currentTrackIndex < tracks.length - 1) {
        ul.children[currentTrackIndex + 1].querySelector('button').click();
      }
    });
  })
  .catch(() => {
    musicList.textContent = 'Could not load music.json.';
  });

/* Calculator */
const calcInput = document.getElementById('calc-input');
const calcResult = document.getElementById('calc-result');
function updateCalc() {
  let val = calcInput.value.trim();
  if (!val) { calcResult.textContent = 'Result: '; return; }
  try {
    // Only allow safe characters
    if (/^[\d\s+\-*/().]+$/.test(val)) {
      // eslint-disable-next-line no-eval
      let result = eval(val);
      calcResult.textContent = 'Result: ' + result;
    } else {
      calcResult.textContent = 'Result: Invalid expression';
    }
  } catch {
    calcResult.textContent = 'Result: Error';
  }
}
calcInput.addEventListener('input', updateCalc);
updateCalc();

/* Encrypted HTML Page Generator */
const encHtmlInput = document.getElementById('encrypthtml-input');
const encHtmlPassword = document.getElementById('encrypthtml-password');
const encHtmlGenerate = document.getElementById('encrypthtml-generate');
const encHtmlOutput = document.getElementById('encrypthtml-output');
encHtmlGenerate.addEventListener('click', function() {
  const html = encHtmlInput.value;
  const password = encHtmlPassword.value;
  if (!html || !password) {
    encHtmlOutput.value = 'Please provide both HTML code and a password.';
    return;
  }
  const encrypted = CryptoJS.AES.encrypt(html, password).toString();
  const page = `<!DOCTYPE html>
<html lang='en'>
<head>
  <meta charset='UTF-8'>
  <meta name='viewport' content='width=device-width, initial-scale=1.0'>
  <title>Encrypted HTML Page</title>
  <link href='https://fonts.googleapis.com/css2?family=Nunito:wght@400;700&display=swap' rel='stylesheet'>
  <style id='encstyle'>
    html, body { height: 100%; margin: 0; padding: 0; }
    body { background: #111; color: #fff; font-family: 'Nunito', sans-serif; min-height: 100vh; display: flex; align-items: center; justify-content: center; }
    .container { background: #181818; border-radius: 16px; padding: 40px 32px 32px 32px; box-shadow: 0 4px 32px rgba(0,0,0,0.22); max-width: 420px; width: 100%; display: flex; flex-direction: column; align-items: center; }
    h2 { font-size: 2rem; margin-bottom: 22px; font-weight: 700; letter-spacing: 0.02em; }
    input[type='password'] { width: 100%; padding: 14px 16px; border-radius: 10px; border: 1.5px solid #333; background: #222; color: #fff; font-size: 1.08rem; margin-bottom: 22px; box-sizing: border-box; }
    input[type='password']:focus { outline: none; border-color: #ff9900; }
    button { padding: 14px 22px; border-radius: 10px; border: none; background: linear-gradient(90deg, #ff9900 80%, #fffbe6 100%); color: #222; font-weight: 700; font-size: 1.08rem; cursor: pointer; margin-bottom: 10px; box-shadow: 0 2px 8px rgba(255,153,0,0.12); transition: background 0.2s, color 0.2s; }
    button:hover { background: #ff9900; color: #fff; }
    .error { color: #ff4444; margin-top: 12px; font-size: 1rem; min-height: 24px; text-align: center; }
    @media (max-width: 600px) { .container { padding: 18px 8px; max-width: 98vw; } h2 { font-size: 1.2rem; } }
  </style>
</head>
<body>
  <div class='container' id='enccontainer'>
    <h2>Enter Password</h2>
    <input type='password' id='pw' placeholder='Password...'>
    <button onclick='decrypt()'>Decrypt & Show Page</button>
    <div id='error' class='error'></div>
  </div>
  <script src='https://cdnjs.cloudflare.com/ajax/libs/crypto-js/4.1.1/crypto-js.min.js'></script>
  <script id='encscript'>
    function decrypt() {
      var pw = document.getElementById('pw').value;
      var error = document.getElementById('error');
      try {
        var decrypted = CryptoJS.AES.decrypt("${encrypted}", pw).toString(CryptoJS.enc.Utf8);
        if (!decrypted) { error.textContent = 'Wrong password or corrupted data.'; return; }
        // Remove all styles and scripts added by this page
        document.head.querySelectorAll('#encstyle, link[rel="stylesheet"]').forEach(e => e.remove());
        document.body.querySelectorAll('#enccontainer').forEach(e => e.remove());
        document.querySelectorAll('#encscript').forEach(e => e.remove());
        document.body.innerHTML = decrypted;
      } catch(e) {
        error.textContent = 'Decryption failed.';
      }
    }
  </script>
</body>
</html>`;
  encHtmlOutput.value = page;
});

/* Reset All Tools */
function resetAllTools(){ resetReaction(); resetPomodoro(); resetStopwatch(); resetCountdown(); }

/* Burger menu and mobile sidebar logic */
const burgerMenu = document.getElementById('burger-menu');
const sidebar = document.getElementById('sidebar');
const main = document.getElementById('main');
let sidebarOpen = false;
function openSidebar() {
  sidebar.classList.add('open');
  sidebar.style.display = 'flex';
  main.style.display = 'none';
  sidebarOpen = true;
}
function closeSidebar() {
  sidebar.classList.remove('open');
  sidebar.style.display = '';
  main.style.display = 'flex';
  sidebarOpen = false;
}
function toggleSidebar() {
  if (window.innerWidth > 600) return;
  if (sidebarOpen) {
    closeSidebar();
  } else {
    openSidebar();
  }
}
burgerMenu.addEventListener('click', toggleSidebar);
burgerMenu.addEventListener('touchstart', function(e) { e.preventDefault(); toggleSidebar(); });
window.addEventListener('resize', handleResize);
function handleResize() {
  if (window.innerWidth > 600) {
    sidebar.classList.remove('open');
    sidebar.style.display = '';
    main.style.display = 'flex';
    sidebarOpen = false;
  } else {
    closeSidebar();
  }
}
handleResize();
tabs.forEach(tab => {
  tab.addEventListener('click', () => {
    if (window.innerWidth <= 600) {
      closeSidebar();
    }
  });
});

/* Sidebar search filter */
const toolSearch = document.getElementById('tool-search');
toolSearch.addEventListener('input', function() {
  const val = this.value.toLowerCase();
  tabs.forEach(tab => {
    if (tab.textContent.toLowerCase().includes(val)) {
      tab.style.display = '';
    } else {
      tab.style.display = 'none';
    }
  });
});
