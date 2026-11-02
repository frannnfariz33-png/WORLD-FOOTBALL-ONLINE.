(() => {
const $=id=>document.getElementById(id);
const style=document.createElement('style');style.textContent='.feature-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:12px}.feature-card{background:#14251b;border:1px solid #36513d;border-radius:15px;padding:14px}.feature-card h3{margin:0 0 8px}.feature-card p{color:#a9c0ae;font-size:13px;line-height:1.45}.feature-preview{min-height:90px;display:grid;place-items:center;font-size:52px;background:linear-gradient(135deg,#214c30,#0b1a11);border-radius:12px;margin:8px 0}.stats-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:9px}.statbox{background:#17271f;border:1px solid #304a39;border-radius:12px;padding:12px}.statbox b{display:block;font-size:25px;color:#b8ff43}@media(max-width:600px){.stats-grid{grid-template-columns:repeat(2,1fr)}}';document.head.append(style);
const nav=document.querySelector('.tabs'),tab=document.createElement('button');tab.textContent='Mi jugador + modos';tab.dataset.tab='extras';tab.onclick=()=>show('extras');nav.append(tab);
const section=document.createElement('section');section.id='extras';section.className='view hidden';
section.innerHTML=`
<div class="panel"><h2>🧑‍🎨 Editor de jugador</h2><div class="feature-grid">
<div class="feature-card"><label class="field">Nombre<input id="wfoName" maxlength="18" placeholder="Tu nombre"></label><label class="field">Camiseta<select id="wfoShirt"><option value="#38a9ff">Azul</option><option value="#e33b3b">Roja</option><option value="#b8ff43">Verde lima</option><option value="#f4f0d0">Blanca</option><option value="#f2c230">Amarilla</option><option value="#8e62dc">Violeta</option></select></label><label class="field">Pelo<select id="wfoHair"><option>Corto</option><option>Puntiagudo</option></select></label><div class="feature-preview" id="wfoPreview">🧑🏻‍⚽</div><button id="wfoSave">Guardar jugador</button></div>
<div class="feature-card"><h3>🏟️ Estadios y cámara</h3><label class="field">Estadio<select id="wfoStadium"><option value="classic">Clásico</option><option value="night">Final nocturna</option><option value="sunset">Atardecer</option><option value="indoor">Cubierto</option></select></label><label class="field">Cámara<select id="wfoCamera"><option value="normal">Transmisión</option><option value="close">Cercana</option></select></label><p>Ambiente visual y acercamiento de cámara.</p></div>
<div class="feature-card"><h3>📋 Formaciones</h3><label class="field">Elegí<select id="wfoFormation"><option value="433">4-3-3</option><option value="442">4-4-2</option><option value="352">3-5-2</option></select></label><button id="wfoApply">Aplicar formación</button><p>Reordena a tus compañeros.</p></div>
<div class="feature-card"><h3>⚡ Habilidades</h3><p>Acercate a la pelota:</p><button id="wfoPower" class="secondary">💥 Tiro potente (E)</button> <button id="wfoCurve" class="secondary">🌀 Tiro con efecto (Q)</button></div>
</div></div>
<div class="panel"><h2>🏆 Carrera profesional</h2><div class="stats-grid"><div class="statbox">Partidos<b id="wfoMatches">0</b></div><div class="statbox">Goles<b id="wfoGoals">0</b></div><div class="statbox">Victorias<b id="wfoWins">0</b></div><div class="statbox">Trofeos<b id="wfoTrophies">0</b></div></div><label class="field">Club<select id="wfoClub"><option>Argentina</option><option>Barcelona</option><option>Real Madrid</option><option>Manchester City</option><option>Boca Juniors</option><option>River Plate</option></select></label><button id="wfoClubSave">Guardar club</button></div>
<div class="panel"><div class="row"><div><h2>🎥 Repetición del último gol</h2><p class="muted">Captura del momento del gol; repetición animada multicámara pendiente.</p></div><button id="wfoReplay" class="secondary">Ver repetición</button></div><canvas id="wfoReplayCanvas" width="800" height="420" style="width:100%;border-radius:12px;background:#08140e"></canvas><p id="wfoReplayText" class="muted">Todavía no hay goles guardados.</p></div>
<div class="panel"><h2>🎙️ Relator</h2><label class="field"><span><input id="wfoVoice" type="checkbox" checked style="width:auto"> Activar voz</span></label><button id="wfoTestVoice" class="secondary">Probar relator</button></div>
<div class="panel"><h2>🌐 Multijugador online real</h2><p>Las salas actuales son una vista previa. Para conectar distintos dispositivos hace falta un servidor de partidas, sincronización en tiempo real y almacenamiento. GitHub Pages por sí solo no puede hacerlo.</p><span class="tag">Servidor online pendiente</span></div>`;
document.querySelector('.shell').insertBefore(section,document.querySelector('.footer'));
let pdata=JSON.parse(localStorage.getItem('wfoPlayer')||'{}'),career=JSON.parse(localStorage.getItem('wfoCareer')||'{"matches":0,"goals":0,"wins":0,"trophies":0,"club":"Argentina"}'),shirt=pdata.shirt||'#38a9ff',formation='433',replay=null,stadium='classic',zoom=false;
const refresh=()=>{['Matches','Goals','Wins','Trophies'].forEach((x,i)=>$('wfo'+x).textContent=[career.matches,career.goals,career.wins,career.trophies][i]);$('wfoClub').value=career.club||'Argentina'};
$('wfoName').value=pdata.name||'';$('wfoShirt').value=shirt;$('wfoPreview').style.color=shirt;refresh();
function toast(t){if(typeof matchToast==='function')matchToast(t);else alert(t)}
$('wfoShirt').onchange=()=>{$('wfoPreview').style.color=$('wfoShirt').value};
$('wfoSave').onclick=()=>{pdata={name:$('wfoName').value,shirt:$('wfoShirt').value,hair:$('wfoHair').value};shirt=pdata.shirt;localStorage.setItem('wfoPlayer',JSON.stringify(pdata));toast('Jugador guardado')};
$('wfoApply').onclick=()=>{formation=$('wfoFormation').value;toast('Formación '+formation+' seleccionada');if(canvas)makeSquad(canvas.clientWidth,canvas.clientHeight)};
$('wfoClubSave').onclick=()=>{career.club=$('wfoClub').value;localStorage.setItem('wfoCareer',JSON.stringify(career));toast('Club guardado')};
$('wfoStadium').onchange=()=>stadium=$('wfoStadium').value;$('wfoCamera').onchange=()=>zoom=$('wfoCamera').value==='close';
function kick(power,curve){if(typeof ball==='undefined'||typeof player==='undefined')return;if(Math.hypot(ball.x-player.x,ball.y-player.y)>100){toast('Acercate a la pelota');return}let a=Math.atan2(ball.y-player.y,ball.x-player.x);ball.vx=Math.cos(a)*power;ball.vy=Math.sin(a)*power+(curve?-145:0);toast(curve?'¡Tiro con efecto!':'¡Tiro potente!')}
$('wfoPower').onclick=()=>kick(650,false);$('wfoCurve').onclick=()=>kick(520,true);window.addEventListener('keydown',e=>{if(e.key.toLowerCase()==='e')kick(650,false);if(e.key.toLowerCase()==='q')kick(520,true)});
function speak(t){if(!$('wfoVoice').checked||!('speechSynthesis'in window))return;speechSynthesis.cancel();let u=new SpeechSynthesisUtterance(t);u.lang='es-AR';speechSynthesis.speak(u)}
$('wfoTestVoice').onclick=()=>speak('¡Bienvenidos a World Football Online! ¡Que comience el partido!');
$('wfoReplay').onclick=()=>{if(!replay){$('wfoReplayText').textContent='Todavía no hay goles guardados.';return}let im=new Image();im.onload=()=>{let cv=$('wfoReplayCanvas');cv.getContext('2d').drawImage(im,0,0,cv.width,cv.height)};im.src=replay;$('wfoReplayText').textContent='Captura del último gol.'};
if(typeof makeSquad==='function'){const old=makeSquad;makeSquad=function(w,h){old(w,h);if(formation!=='433')blueTeam.forEach((p,i)=>{p.x=w*(i<2?.24:.40);p.y=h*(i%2?.72:.28)})}}
if(typeof draw==='function'){const old=draw;draw=function(w,h){old(w,h);if(!ctx)return;ctx.save();if(stadium==='night'){ctx.fillStyle='rgba(3,8,28,.22)';ctx.fillRect(0,0,w,h);ctx.fillStyle='#fff5a0';for(let i=0;i<16;i++){ctx.beginPath();ctx.arc(i*w/16+10,8,2.5,0,Math.PI*2);ctx.fill()}}else if(stadium==='sunset'){ctx.fillStyle='rgba(255,145,45,.13)';ctx.fillRect(0,0,w,h)}else if(stadium==='indoor'){ctx.strokeStyle='rgba(255,255,255,.24)';ctx.lineWidth=5;ctx.strokeRect(5,5,w-10,h-10)}if(zoom){ctx.translate(-w*.04,-h*.03);ctx.scale(1.08,1.08)}ctx.restore();if(typeof keeperA!=='undefined'){drawKeeper(keeperA.x,keeperA.y);drawKeeper(keeperB.x,keeperB.y)}}}
function drawKeeper(x,y){ctx.save();ctx.fillStyle='#f2c230';ctx.fillRect(x-9,y-8,18,25);ctx.fillStyle='#e0ad83';ctx.beginPath();ctx.arc(x,y-17,12,0,Math.PI*2);ctx.fill();ctx.fillStyle='#fff';ctx.fillRect(x-17,y-3,7,12);ctx.fillRect(x+10,y-3,7,12);ctx.restore()}
if(typeof startMatch==='function'){const old=startMatch;startMatch=function(){old();keeperA={x:25,y:canvas.clientHeight/2};keeperB={x:canvas.clientWidth-25,y:canvas.clientHeight/2};career.matches++;localStorage.setItem('wfoCareer',JSON.stringify(career));refresh();speak('¡Comienza el partido!')}}
if(typeof celebrateGoal==='function'){const old=celebrateGoal;celebrateGoal=function(scored){old(scored);try{replay=canvas.toDataURL('image/png')}catch(e){}if(scored){career.goals++;speak('¡Gooooool! ¡Qué golazo!')}else speak('Gol del equipo rival');localStorage.setItem('wfoCareer',JSON.stringify(career));refresh()}}
let keeperA={x:30,y:180},keeperB={x:600,y:180};const keeperLoop=()=>{if(typeof ball!=='undefined'&&typeof canvas!=='undefined'&&canvas&&!$('game').classList.contains('hidden')){let h=canvas.clientHeight;keeperA.y+=(Math.max(45,Math.min(h-45,ball.y))-keeperA.y)*.07;keeperB.y+=(Math.max(45,Math.min(h-45,ball.y))-keeperB.y)*.07;for(const k of [keeperA,keeperB])if(Math.hypot(ball.x-k.x,ball.y-k.y)<28&&Math.abs(ball.vx)>100){ball.vx*=-.78;ball.vy+=(ball.y-k.y)*2}}requestAnimationFrame(keeperLoop)};requestAnimationFrame(keeperLoop);

/* Aplicar camiseta al avatar controlado y generar una fase de grupos jugable como cuadro local. */
if(typeof drawCharacter==='function'){const oldCharacter=drawCharacter;drawCharacter=function(x,y,color,skin,hair,flip){if(typeof player!=='undefined'&&Math.abs(x-player.x)<.1&&Math.abs(y-player.y)<.1)color=shirt;oldCharacter(x,y,color,skin,hair,flip)}}
createTournament=function(){const pool=[...teams].sort(()=>Math.random()-.5).slice(0,16),groups=['A','B','C','D'];$('bracket').innerHTML=groups.map((g,i)=>'<div><b>GRUPO '+g+'</b>'+pool.slice(i*4,i*4+4).map((t,j)=>'<div class="match">'+(j+1)+'. '+t+'</div>').join('')+'<div class="match">Partidos: todos contra todos</div></div>').join('')+'<div class="tile" style="grid-column:1/-1"><b>ELIMINACIÓN DIRECTA</b><p class="muted">Los dos mejores de cada grupo clasifican a cuartos, semifinal y final. En esta versión el cuadro se sortea y se muestra; los resultados se completarán al jugar los partidos.</p></div>';$('bracket').scrollIntoView({behavior:'smooth',block:'nearest'})};
if(typeof stopMatch==='function'){const oldStop=stopMatch;stopMatch=function(){if(scoreA>scoreB){career.wins++;career.trophies++;speak('¡Victoria! ¡Campeones!')}localStorage.setItem('wfoCareer',JSON.stringify(career));refresh();oldStop()}}

/* Texturas procedurales del estadio y césped */
const textureTile=document.createElement('canvas');textureTile.width=textureTile.height=128;const tctx=textureTile.getContext('2d');tctx.fillStyle='#176536';tctx.fillRect(0,0,128,128);for(let i=0;i<520;i++){const x=Math.random()*128,y=Math.random()*128;tctx.fillStyle=i%2?'rgba(210,255,190,.10)':'rgba(0,20,8,.12)';tctx.fillRect(x,y,1+Math.random()*2,1+Math.random()*3)}
const grassPattern=tctx.createPattern(textureTile,'repeat');
function drawStadiumTextures(w,h){if(!ctx)return;ctx.save();
/* césped con grano y franjas de corte */ctx.globalAlpha=.28;ctx.fillStyle=grassPattern;ctx.fillRect(0,0,w,h);ctx.globalAlpha=1;
/* tribunas, público y pasarelas */const band=Math.max(25,Math.min(42,h*.09));for(const y of [0,h-band]){const grad=ctx.createLinearGradient(0,y,0,y+band);grad.addColorStop(0,'#17232a');grad.addColorStop(1,'#34434a');ctx.fillStyle=grad;ctx.fillRect(0,y,w,band);for(let i=0;i<Math.floor(w/7);i++){const px=i*7+3;ctx.fillStyle=['#e8e8d8','#d94b42','#3f9bd7','#f0c64b','#a7d28d'][i%5];ctx.fillRect(px,y+6+(i%3)*3,3,4);ctx.fillStyle='rgba(255,255,255,.16)';ctx.fillRect(px-1,y+band-7,5,2)}ctx.fillStyle='#87969a';ctx.fillRect(0,y+band-3,w,3)}
/* reflectores */for(const x of [w*.08,w*.92]){ctx.fillStyle='#dce8ed';ctx.fillRect(x-3,band+4,6,24);ctx.shadowColor='#fff6c7';ctx.shadowBlur=17;ctx.fillStyle='#fff5c7';for(let j=0;j<4;j++){ctx.beginPath();ctx.arc(x-8+j*5,band+5,2,0,Math.PI*2);ctx.fill()}ctx.shadowBlur=0}
/* textura y red de arcos */ctx.strokeStyle='rgba(255,255,255,.55)';ctx.lineWidth=1;for(const gx of [12,w-82]){ctx.strokeRect(gx,h*.38,70,h*.24);for(let yy=h*.38;yy<h*.62;yy+=8){ctx.beginPath();ctx.moveTo(gx,yy);ctx.lineTo(gx+70,yy);ctx.stroke()}for(let xx=gx;xx<gx+70;xx+=10){ctx.beginPath();ctx.moveTo(xx,h*.38);ctx.lineTo(xx,h*.62);ctx.stroke()}}
ctx.restore()}
if(typeof draw==='function'){const texturedDraw=draw;draw=function(w,h){texturedDraw(w,h);drawStadiumTextures(w,h)}}


/* Animaciones de movimiento, relato de posesión y repeticiones animadas */
let wfoFrames=[],wfoReplayTimer=0,wfoReplayIndex=0,wfoLastCall='',wfoLastCallAt=0,wfoLastGoalAt=0;
const wfoReplayCanvas=$('wfoReplayCanvas'),wfoReplayCtx=wfoReplayCanvas.getContext('2d');
function wfoName(){return (($('wfoName')&&$('wfoName').value)||pdata.name||'Jugador').trim()||'Jugador'}
function wfoCapture(){
 if(typeof player==='undefined'||typeof ball==='undefined'||!canvas)return;
 const now=performance.now();
 wfoFrames.push({t:now,px:player.x,py:player.y,ox:opponent.x,oy:opponent.y,bx:ball.x,by:ball.y,blue:blueTeam.map(p=>({x:p.x,y:p.y})),red:redTeam.map(p=>({x:p.x,y:p.y})),w:canvas.clientWidth,h:canvas.clientHeight});
 while(wfoFrames.length&&now-wfoFrames[0].t>11000)wfoFrames.shift();
}
function wfoReplayDraw(frame){
 const c=wfoReplayCtx,cv=wfoReplayCanvas,w=cv.width,h=cv.height,sx=w/frame.w,sy=h/frame.h;
 c.clearRect(0,0,w,h);c.fillStyle='#176033';c.fillRect(0,0,w,h);
 for(let i=0;i<8;i++){c.fillStyle=i%2?'#1a6838':'#1b713d';c.fillRect(i*w/8,0,w/8,h)}
 c.strokeStyle='#e6f6e7';c.lineWidth=3;c.strokeRect(12,12,w-24,h-24);c.beginPath();c.moveTo(w/2,12);c.lineTo(w/2,h-12);c.stroke();c.beginPath();c.arc(w/2,h/2,Math.min(h*.16,65),0,Math.PI*2);c.stroke();
 const person=(x,y,color,phase)=>{x*=sx;y*=sy;c.save();c.translate(x,y);c.fillStyle='rgba(0,0,0,.22)';c.beginPath();c.ellipse(0,25,23,7,0,0,Math.PI*2);c.fill();c.strokeStyle='#17251c';c.lineWidth=6;c.lineCap='round';const step=Math.sin(phase)*6;c.beginPath();c.moveTo(-8,12);c.lineTo(-11+step,25);c.moveTo(8,12);c.lineTo(11-step,25);c.stroke();c.fillStyle=color;c.beginPath();c.roundRect(-15,-5,30,25,8);c.fill();c.fillStyle='#e5ad83';c.beginPath();c.arc(0,-22,23,0,Math.PI*2);c.fill();c.fillStyle='#34231c';c.beginPath();c.arc(0,-29,22,Math.PI,Math.PI*2);c.fill();c.fillStyle='#17251c';c.beginPath();c.arc(-8,-22,2.7,0,Math.PI*2);c.arc(8,-22,2.7,0,Math.PI*2);c.fill();c.restore()};
 frame.blue.forEach(p=>person(p.x,p.y,'#268de8',frame.t/90));frame.red.forEach(p=>person(p.x,p.y,'#e33b3b',frame.t/90));person(frame.ox,frame.oy,'#f04444',frame.t/90);person(frame.px,frame.py,shirt,frame.t/90);
 c.fillStyle='#fff';c.beginPath();c.arc(frame.bx*sx,frame.by*sy,10,0,Math.PI*2);c.fill();c.strokeStyle='#18251c';c.stroke();
 c.fillStyle='#fff';c.font='bold 22px system-ui';c.fillText('REPETICIÓN',22,34);
}
function wfoPlayReplay(){
 if(wfoFrames.length<8){$('wfoReplayText').textContent='Jugá unos segundos y después habrá una repetición animada.';return}
 const end=performance.now(),frames=wfoFrames.filter(f=>end-f.t<6500);
 if(frames.length<2)return;
 cancelAnimationFrame(wfoReplayTimer);wfoReplayIndex=0;
 $('wfoReplayText').textContent='▶ Reproduciendo la jugada en cámara lenta.';
 const step=()=>{if(wfoReplayIndex>=frames.length){$('wfoReplayText').textContent='Repetición finalizada. Podés volver a verla.';return}wfoReplayDraw(frames[wfoReplayIndex++]);wfoReplayTimer=requestAnimationFrame(()=>setTimeout(step,55))};step();
}
$('wfoReplay').onclick=wfoPlayReplay;
function wfoCommentary(){
 if(!$('wfoVoice').checked||typeof player==='undefined'||!canvas||$('game').classList.contains('hidden'))return;
 const now=performance.now();if(now-wfoLastCallAt<4800)return;
 const dp=Math.hypot(ball.x-player.x,ball.y-player.y),doo=Math.hypot(ball.x-opponent.x,ball.y-opponent.y);
 let line='';
 if(dp<55)line='La tiene '+wfoName()+', encara el arco.';
 else if(doo<55)line='La tiene el rival, busca el ataque.';
 else if(ball.x<canvas.clientWidth*.42)line='La pelota va por el medio, se arma la jugada.';
 else if(ball.x>canvas.clientWidth*.62)line='Atención, peligro frente al arco.';
 if(line&&line!==wfoLastCall){wfoLastCall=line;wfoLastCallAt=now;speak(line)}
}
const wfoOriginalDraw=draw;
draw=function(w,h){wfoOriginalDraw(w,h);wfoCapture();
 if(typeof player!=='undefined'&&ctx){ctx.save();ctx.font='bold 12px system-ui';ctx.textAlign='center';ctx.lineWidth=3;ctx.strokeStyle='#07110e';ctx.fillStyle='#fff';const label=wfoName();ctx.strokeText(label,player.x,player.y-52);ctx.fillText(label,player.x,player.y-52);ctx.restore()}
 wfoCommentary();
};
const wfoOriginalCelebrate=celebrateGoal;
celebrateGoal=function(scored){wfoOriginalCelebrate(scored);const who=scored?wfoName():'el equipo rival';speak('¡Gol! '+who+'. Vamos a ver la repetición de la jugada.');setTimeout(wfoPlayReplay,1200)};
const wfoOriginalStart=startMatch;
startMatch=function(){wfoFrames=[];wfoLastCall='';wfoLastCallAt=0;wfoOriginalStart();};


/* Modo cabezón 1 contra 1, cinco estadios, festejo de 3 segundos y saques */
const wfoExtra=document.createElement('div');wfoExtra.className='panel';
wfoExtra.innerHTML='<h2>🎮 Modos y estadios</h2><div class="feature-grid"><div class="feature-card"><label class="field">Modo de juego<select id="wfoGameMode"><option value="normal">Fútbol con equipos</option><option value="head">Modo cabezón 1 vs 1</option></select></label><p>En modo cabezón jugás con un solo jugador contra un rival, con dos arcos y cancha ampliada.</p></div><div class="feature-card"><label class="field">Elegí cancha<select id="wfoGround"><option value="bombonera">La Bombonera</option><option value="monumental">Estadio Monumental</option><option value="national">Estadio Nacional</option><option value="night">Arena Nocturna</option><option value="sunset">Estadio del Atardecer</option></select></label><p>Tribunas y ambiente cambian según el estadio.</p></div></div>';
section.insertBefore(wfoExtra,section.querySelector('.panel'));
$('wfoStadium').innerHTML='<option value="classic">Clásico</option><option value="night">Final nocturna</option><option value="sunset">Atardecer</option><option value="indoor">Cubierto</option>';
let wfoHeadMode=false,wfoGround='bombonera',wfoCelebratingUntil=0,wfoLastTouch='player',wfoCrowdContext=null,wfoCrowdTimer=0;
function wfoHandleOut(edge){
 const outBy=wfoLastTouch==='player'?'tu equipo':'equipo rival';
 const restart=wfoLastTouch==='player'?'equipo rival':'tu equipo';
 ball.vx=0;ball.vy=0;
 if(edge==='lateral'){ball.x=Math.max(18,Math.min(canvas.clientWidth-18,ball.x));ball.y=ball.y<canvas.clientHeight/2?18:canvas.clientHeight-18;}
 else {ball.x=ball.x<canvas.clientWidth/2?canvas.clientWidth*.18:canvas.clientWidth*.82;ball.y=canvas.clientHeight/2;}
 matchToast('⚽ ¡Afuera! La mandó '+outBy+'. Saca '+restart+'.');
 speak('La pelota se fue afuera. La mandó '+outBy+'. Saca '+restart+'.');
 if(wfoLastTouch==='player'){opponent.x=ball.x;opponent.y=ball.y;}else{player.x=ball.x;player.y=ball.y;}
}
window.wfoHandleOut=wfoHandleOut;
const wfoOldSquad=makeSquad;
makeSquad=function(w,h){wfoOldSquad(w,h);if(wfoHeadMode){blueTeam=[];redTeam=[];player.x=w*.22;player.y=h*.5;opponent.x=w*.78;opponent.y=h*.5;}};
const wfoOldDrawCharacter=drawCharacter;
drawCharacter=function(x,y,color,skin,hair,flip){if(wfoHeadMode){ctx.save();ctx.translate(x,y);ctx.scale(1.38,1.38);wfoOldDrawCharacter(0,0,color,skin,hair,flip);ctx.restore()}else wfoOldDrawCharacter(x,y,color,skin,hair,flip)};
const wfoOldDrawMode=draw;
draw=function(w,h){
 wfoOldDrawMode(w,h);
 if(wfoHeadMode&&ctx){ctx.save();ctx.strokeStyle='#fff';ctx.lineWidth=4;ctx.strokeRect(12,h*.32,75,h*.36);ctx.strokeRect(w-87,h*.32,75,h*.36);ctx.fillStyle='rgba(5,15,10,.75)';ctx.fillRect(w*.35,8,w*.3,28);ctx.fillStyle='#fff';ctx.font='bold 15px system-ui';ctx.textAlign='center';ctx.fillText('MODO CABEZÓN · 1 VS 1',w/2,28);ctx.restore()}
 if(ctx){ctx.save();const bands=Math.max(25,h*.08);for(const y of [0,h-bands]){ctx.fillStyle=wfoGround==='bombonera'?'#183d31':wfoGround==='monumental'?'#353b45':wfoGround==='national'?'#273c4d':'#202a37';ctx.fillRect(0,y,w,bands);for(let i=0;i<w/8;i++){ctx.fillStyle=['#e8e8e8','#e0bd39','#d64c43','#4185c7'][i%4];ctx.fillRect(i*8+2,y+7+(i%3)*4,4,4)}}ctx.restore()}
};
const wfoOldLoop=loop;
loop=function(now){
 if(wfoCelebratingUntil&&now<wfoCelebratingUntil){draw(canvas.clientWidth,canvas.clientHeight);$('score').textContent=scoreA+' - '+scoreB;raf=requestAnimationFrame(loop);return;}
 wfoOldLoop(now);
};
const wfoOldCelebrate3=celebrateGoal;
celebrateGoal=function(scored){
 wfoCelebratingUntil=performance.now()+3000;
 wfoOldCelebrate3(scored);
 const box=$('goalCelebration');box.style.animation='none';box.style.display='flex';box.style.background='rgba(3,16,9,.72)';
 box.style.animation='goalFlash 3s ease both';
 $('goalSub').textContent=scored?'¡'+wfoName()+' lo festeja con su equipo!':'¡El rival festeja el gol!';
 $('goalTitle').textContent=scored?'¡GOLAZO!':'¡GOL DEL RIVAL!';
 const dancers=box.querySelector('.celebration-dancers');if(dancers)dancers.innerHTML='<span>🏃</span><span>🙌</span><span>🏃</span><span>🕺</span>';
 box.querySelector('.goal-emoji').textContent='⚽🎉🏟️';
 if(wfoCrowdContext){const o=wfoCrowdContext.createOscillator(),g=wfoCrowdContext.createGain();o.type='sawtooth';o.frequency.value=95;g.gain.value=.025;o.connect(g);g.connect(wfoCrowdContext.destination);o.start();o.stop(wfoCrowdContext.currentTime+2.8)}
 speak(scored?'¡Golazo de '+wfoName()+'!':'¡Gol del rival!');
 setTimeout(()=>{box.classList.remove('show');box.style.display='none';box.style.animation='';wfoCelebratingUntil=0;},3000);
};
const wfoBaseStartExtra=startMatch;
startMatch=function(){
 wfoHeadMode=$('wfoGameMode').value==='head';wfoGround=$('wfoGround').value;
 if(wfoCrowdContext){try{wfoCrowdContext.close()}catch(e){}}
 const AC=window.AudioContext||window.webkitAudioContext;
 if(AC){wfoCrowdContext=new AC();const osc=wfoCrowdContext.createOscillator(),gain=wfoCrowdContext.createGain(),filter=wfoCrowdContext.createBiquadFilter();osc.type='triangle';osc.frequency.value=68;filter.type='lowpass';filter.frequency.value=180;gain.gain.value=.012;osc.connect(filter);filter.connect(gain);gain.connect(wfoCrowdContext.destination);osc.start();}
 wfoBaseStartExtra();
 const stadiumNames={bombonera:'La Bombonera',monumental:'el Monumental',national:'el Estadio Nacional',night:'la Arena Nocturna',sunset:'el Estadio del Atardecer'};
 speak('Desde '+stadiumNames[wfoGround]+', la tribuna ya está alentando.');
};
const wfoOldKick=kick;
kick=function(power,curve){wfoLastTouch='player';wfoOldKick(power,curve)};
const wfoOldCommentary=wfoCommentary;
wfoCommentary=function(){
 if(typeof player!=='undefined'&&typeof ball!=='undefined'){
  if(Math.hypot(ball.x-player.x,ball.y-player.y)<50)wfoLastTouch='player';
  else if(Math.hypot(ball.x-opponent.x,ball.y-opponent.y)<50)wfoLastTouch='rival';
 }
 wfoOldCommentary();
};


/* Celebracion de gol visible y animada: overlay, confeti y jugadores festejando */
const wfoGoalFX=document.createElement('style');
wfoGoalFX.textContent=`
#wfoGoalFX{position:absolute;inset:0;z-index:30;display:none;overflow:hidden;align-items:center;justify-content:center;flex-direction:column;gap:10px;text-align:center;background:radial-gradient(circle at center,rgba(30,120,54,.88),rgba(2,10,7,.94));pointer-events:none}
#wfoGoalFX.active{display:flex;animation:wfoGoalIn .28s ease-out both}
#wfoGoalFX .fx-kicker{font-size:clamp(15px,3vw,25px);font-weight:1000;letter-spacing:5px;color:#fff;text-shadow:0 3px 8px #000;animation:wfoKick .5s ease-out both}
#wfoGoalFX .fx-title{font-size:clamp(58px,14vw,132px);font-weight:1000;line-height:.9;color:#d7ff4f;-webkit-text-stroke:2px #173d1e;text-shadow:0 7px 0 #24552b,0 0 32px #fff;animation:wfoGoalZoom .65s cubic-bezier(.15,1.7,.35,1) both;letter-spacing:2px}#wfoGoalFX .fx-name{font-size:clamp(24px,6vw,54px);font-weight:1000;color:#fff;text-shadow:0 4px 0 #173d1e,0 0 18px #d7ff4f;animation:wfoNameFlash 1s steps(2,end) infinite}@keyframes wfoNameFlash{0%,100%{opacity:1;transform:scale(1)}50%{opacity:.72;transform:scale(1.05)}
#wfoGoalFX .fx-players{display:flex;gap:clamp(12px,4vw,38px);font-size:clamp(42px,9vw,76px);animation:wfoRun .55s ease-in-out infinite alternate}
#wfoGoalFX .fx-players span:nth-child(2){animation:wfoJump .45s ease-in-out infinite alternate}
#wfoGoalFX .fx-sub{font-size:clamp(16px,3.4vw,26px);font-weight:900;color:white;text-shadow:0 3px 8px #000;animation:wfoKick .7s .2s both}
#wfoGoalFX .fx-confetti{position:absolute;inset:0;pointer-events:none}
#wfoGoalFX .fx-confetti i{position:absolute;top:-12%;left:var(--x);width:9px;height:15px;background:var(--c);transform:rotate(var(--r));animation:wfoConfetti var(--d) linear var(--delay) infinite}
@keyframes wfoGoalIn{from{opacity:0}to{opacity:1}}
@keyframes wfoGoalZoom{0%{transform:scale(.15) rotate(-12deg);opacity:0}70%{transform:scale(1.12) rotate(3deg)}100%{transform:scale(1)}}
@keyframes wfoKick{from{transform:translateY(24px);opacity:0}to{transform:translateY(0);opacity:1}}
@keyframes wfoRun{from{transform:translateX(-14px) rotate(-4deg)}to{transform:translateX(14px) rotate(4deg)}}
@keyframes wfoJump{from{transform:translateY(0)}to{transform:translateY(-23px)}}
@keyframes wfoConfetti{to{transform:translate3d(35px,120vh,0) rotate(720deg)}}
`;
document.head.append(wfoGoalFX);
const wfoGoalBox=$('wfoGoalFX')||document.createElement('div');
wfoGoalBox.id='wfoGoalFX';
wfoGoalBox.innerHTML='<div class="fx-confetti"></div><div class="fx-kicker">WORLD FOOTBALL ONLINE</div><div class="fx-title">GOLAZO</div><div class="fx-name">Jugador</div><div class="fx-players"><span>🏃</span><span>🙌</span><span>⚽</span><span>🎉</span></div><div class="fx-sub">¡A FESTEJAR CON LA TRIBUNA!</div>';
if(!wfoGoalBox.parentNode)$('game').querySelector('.gamewrap').append(wfoGoalBox);
const wfoConfetti=wfoGoalBox.querySelector('.fx-confetti');
for(let i=0;i<65;i++){const bit=document.createElement('i');bit.style.setProperty('--x',(Math.random()*100)+'%');bit.style.setProperty('--c',['#d7ff4f','#fff','#ffcf33','#39d7ff','#ff5b5b'][i%5]);bit.style.setProperty('--r',(Math.random()*180)+'deg');bit.style.setProperty('--d',(1.7+Math.random()*1.8)+'s');bit.style.setProperty('--delay',(-Math.random()*3)+'s');wfoConfetti.append(bit)}
const wfoCelebrateFinal=celebrateGoal;
celebrateGoal=function(scored){
 wfoCelebrateFinal(scored);
 const title=wfoGoalBox.querySelector('.fx-title'),sub=wfoGoalBox.querySelector('.fx-sub');
 title.textContent=scored?'GOLAZO':'GOL DEL RIVAL';
 wfoGoalBox.querySelector('.fx-name').textContent=scored?wfoName():'Equipo rival';
 sub.textContent=scored?'¡'+wfoName()+'!':'¡El rival lo festeja!';
 wfoGoalBox.classList.remove('active');void wfoGoalBox.offsetWidth;wfoGoalBox.classList.add('active');
 const oldPlayers=wfoGoalBox.querySelector('.fx-players');
 oldPlayers.innerHTML=scored?'<span>🏃</span><span>🙌</span><span>🕺</span><span>🎉</span>':'<span>😮</span><span>🏃</span><span>🙌</span>';
 clearTimeout(window.wfoGoalFXTimer);
 window.wfoGoalFXTimer=setTimeout(()=>wfoGoalBox.classList.remove('active'),3000);
};


/* IA táctica: compañeros con roles, presión, cobertura y remates automáticos */
const wfoTacticalStyle=document.createElement('style');
wfoTacticalStyle.textContent=`
.gamewrap{height:min(78vh,820px)!important;min-height:430px!important;aspect-ratio:16/9}
.gamewrap canvas{touch-action:none}
#wfoTouchControls{position:absolute;z-index:12;left:0;right:0;bottom:12px;display:none;align-items:end;justify-content:space-between;padding:0 18px;pointer-events:none}
#wfoStickZone{width:142px;height:142px;border-radius:50%;background:rgba(4,18,12,.48);border:2px solid rgba(235,255,240,.58);position:relative;pointer-events:auto;touch-action:none;box-shadow:0 4px 22px #0007}
#wfoStickKnob{position:absolute;width:58px;height:58px;left:40px;top:40px;border-radius:50%;background:linear-gradient(145deg,#f5fff7,#9db9a5);border:3px solid #294d35;box-shadow:0 3px 10px #0008;pointer-events:none}
#wfoActionControls{display:flex;gap:12px;align-items:end;pointer-events:auto}
#wfoKickButton{width:82px;height:82px;border-radius:50%;font-size:27px;background:linear-gradient(145deg,#d9ff72,#83c52c);border:4px solid #f2ffd8;box-shadow:0 5px 18px #0008;touch-action:none}
#wfoFullButton{width:48px;height:48px;padding:0;border-radius:50%;background:#0a1b13dd;color:white;border:1px solid #b5d4bb}
#wfoRotateHint{display:none;position:absolute;z-index:20;inset:0;background:#06140fee;color:white;align-items:center;justify-content:center;text-align:center;padding:25px;font-weight:900;font-size:20px;pointer-events:none}
@media(max-width:800px){#wfoTouchControls{display:flex}.gamehint{display:none}.mobile-controls{display:none!important}}
@media(max-width:800px) and (orientation:landscape){.gamewrap{height:calc(100dvh - 118px)!important;min-height:250px!important;aspect-ratio:auto}}
@media(max-width:800px) and (orientation:portrait){#wfoRotateHint{display:flex}}
@media(max-height:500px) and (orientation:landscape){#wfoTouchControls{bottom:5px;padding:0 10px}#wfoStickZone{width:104px;height:104px}#wfoStickKnob{width:44px;height:44px;left:28px;top:28px}#wfoKickButton{width:66px;height:66px}}
`;
document.head.append(wfoTacticalStyle);
const wfoGameWrap=$('game').querySelector('.gamewrap');
const wfoTouch=document.createElement('div');wfoTouch.id='wfoTouchControls';
wfoTouch.innerHTML='<div id="wfoStickZone" aria-label="Joystick de movimiento"><div id="wfoStickKnob"></div></div><div id="wfoActionControls"><button id="wfoFullButton" title="Pantalla completa">⛶</button><button id="wfoKickButton" aria-label="Patear">⚽</button></div>';
wfoGameWrap.append(wfoTouch);
const wfoRotate=document.createElement('div');wfoRotate.id='wfoRotateHint';wfoRotate.textContent='↻ Girá el celular en horizontal para ver la cancha más grande';wfoGameWrap.append(wfoRotate);
let wfoStickX=0,wfoStickY=0,wfoStickPointer=null;
const wfoStickZone=$('wfoStickZone'),wfoStickKnob=$('wfoStickKnob');
function wfoSetStick(e){
 const r=wfoStickZone.getBoundingClientRect(),cx=r.left+r.width/2,cy=r.top+r.height/2;
 let dx=e.clientX-cx,dy=e.clientY-cy;const max=r.width*.31,len=Math.hypot(dx,dy)||1;
 if(len>max){dx=dx/len*max;dy=dy/len*max}
 wfoStickX=dx/max;wfoStickY=dy/max;
 wfoStickKnob.style.transform='translate('+dx+'px,'+dy+'px)';
 keys.arrowleft=wfoStickX<-.22;keys.arrowright=wfoStickX>.22;
 keys.arrowup=wfoStickY<-.22;keys.arrowdown=wfoStickY>.22;
}
function wfoResetStick(){
 wfoStickPointer=null;wfoStickX=0;wfoStickY=0;wfoStickKnob.style.transform='translate(0,0)';
 keys.arrowleft=keys.arrowright=keys.arrowup=keys.arrowdown=false;
}
wfoStickZone.addEventListener('pointerdown',e=>{e.preventDefault();wfoStickPointer=e.pointerId;wfoStickZone.setPointerCapture(e.pointerId);wfoSetStick(e)});
wfoStickZone.addEventListener('pointermove',e=>{if(e.pointerId===wfoStickPointer){e.preventDefault();wfoSetStick(e)}});
['pointerup','pointercancel','lostpointercapture'].forEach(ev=>wfoStickZone.addEventListener(ev,wfoResetStick));
const wfoKickButton=$('wfoKickButton');
wfoKickButton.addEventListener('pointerdown',e=>{e.preventDefault();keys[' ']=true;wfoKickButton.setPointerCapture(e.pointerId)});
['pointerup','pointercancel','lostpointercapture'].forEach(ev=>wfoKickButton.addEventListener(ev,()=>keys[' ']=false));
$('wfoFullButton').addEventListener('click',async()=>{
 try{if(!document.fullscreenElement)await wfoGameWrap.requestFullscreen();else await document.exitFullscreen()}catch(e){matchToast('Girá el celular para ampliar la cancha')}
 try{if(screen.orientation&&screen.orientation.lock)await screen.orientation.lock('landscape')}catch(e){}
 setTimeout(()=>{if(canvas&&ctx){resize();draw(canvas.clientWidth,canvas.clientHeight)}},250);
});
const wfoOldResize=resize;
resize=function(){wfoOldResize();if(canvas&&ctx){const w=canvas.clientWidth,h=canvas.clientHeight;player.x=Math.max(28,Math.min(w-28,player.x));player.y=Math.max(28,Math.min(h-28,player.y));ball.x=Math.max(12,Math.min(w-12,ball.x));ball.y=Math.max(12,Math.min(h-12,ball.y))}};
const wfoOldStartTactical=startMatch;
startMatch=function(){
 wfoResetStick();
 wfoOldStartTactical();
 try{if(screen.orientation&&screen.orientation.lock&&matchMedia('(max-width: 800px)').matches)screen.orientation.lock('landscape').catch(()=>{})}catch(e){}
};

/* Reemplaza la IA básica: solo presiona el jugador más cercano; el resto cubre espacios y busca desmarques. */
let wfoAiLastBlue=0,wfoAiLastRed=0;
function wfoMoveAI(p,tx,ty,dt,speed){
 const dx=tx-p.x,dy=ty-p.y,d=Math.hypot(dx,dy)||1,step=Math.min(speed*dt,d);
 p.x+=dx/d*step;p.y+=dy/d*step;
 p.x=Math.max(25,Math.min(canvas.clientWidth-25,p.x));p.y=Math.max(25,Math.min(canvas.clientHeight-25,p.y));
}
function wfoTeamBrain(team,attacksRight,dt,now){
 if(!team.length)return;
 const w=canvas.clientWidth,h=canvas.clientHeight;
 let chaser=0,best=Infinity;
 team.forEach((p,i)=>{const d=Math.hypot(ball.x-p.x,ball.y-p.y);if(d<best){best=d;chaser=i}});
 team.forEach((p,i)=>{
  let tx,ty;
  if(i===chaser){tx=ball.x+(attacksRight?-12:12);ty=ball.y}
  else{
   const lane=(i-(team.length-1)/2);
   const baseX=attacksRight?w*(.28+.13*i):w*(.72-.13*i);
   tx=baseX+(ball.x-w*.5)*(i===team.length-1?.16:.07);
   ty=h*.5+lane*h*.19+(ball.y-h*.5)*.22;
   if(attacksRight&&ball.x>w*.62&&i===team.length-1){tx=w*.78;ty=h*.5+(ball.y-h*.5)*.35}
   if(!attacksRight&&ball.x<w*.38&&i===team.length-1){tx=w*.22;ty=h*.5+(ball.y-h*.5)*.35}
  }
  wfoMoveAI(p,tx,ty,dt,i===chaser?190:128);
  const dBall=Math.hypot(ball.x-p.x,ball.y-p.y);
  const last=attacksRight?wfoAiLastBlue:wfoAiLastRed;
  if(dBall<31&&now-last>850){
   const goalX=attacksRight?w-5:5,goalY=h*.5;
   const aimY=goalY+(Math.random()-.5)*h*.22;
   const a=Math.atan2(aimY-ball.y,goalX-ball.x);
   ball.vx=Math.cos(a)* (attacksRight?430:-430);
   ball.vy=Math.sin(a)*430;
   if(attacksRight)wfoAiLastBlue=now;else wfoAiLastRed=now;
   p.kickingUntil=now+320;
  }
 });
}

loop=function(now){
 if(!canvas||$('game').classList.contains('hidden'))return;
 const dt=Math.min(Math.max((now-last)/1000,0),.04);last=now;elapsed+=dt;
 const w=canvas.clientWidth,h=canvas.clientHeight,speed=230*dt;
 if(wfoCelebratingUntil&&now<wfoCelebratingUntil){draw(w,h);$('score').textContent=scoreA+' - '+scoreB;raf=requestAnimationFrame(loop);return;}
 let dx=0,dy=0;
 if(keys.w||keys.arrowup)dy--;if(keys.s||keys.arrowdown)dy++;
 if(keys.a||keys.arrowleft)dx--;if(keys.d||keys.arrowright)dx++;
 const mag=Math.hypot(dx,dy)||1;
 if(matchRole==='referee'){
  referee.x=Math.max(24,Math.min(w-24,referee.x+dx/mag*speed));
  referee.y=Math.max(24,Math.min(h-24,referee.y+dy/mag*speed));
  if(keys.f){matchToast('📯 ¡Piiii! ¡Decisión del árbitro!');keys.f=false}
  if(keys.c){matchToast('🟨 ¡Tarjeta amarilla!');keys.c=false}
  if(keys.v){matchToast('🟥 ¡Tarjeta roja!');keys.v=false}
 }else{
  player.x=Math.max(24,Math.min(w-24,player.x+dx/mag*speed));
  player.y=Math.max(24,Math.min(h-24,player.y+dy/mag*speed));
 }
 if(matchRole==='player'&&!wfoHeadMode){
  wfoTeamBrain(blueTeam,true,dt,now);
  wfoTeamBrain([...redTeam,opponent],false,dt,now);
 }else if(matchRole==='player'&&wfoHeadMode){
  const d=Math.hypot(ball.x-opponent.x,ball.y-opponent.y)||1;
  wfoMoveAI(opponent,ball.x+(ball.x-opponent.x)/d*8,ball.y+(ball.y-opponent.y)/d*8,dt,190);
  if(d<36&&now-wfoAiLastRed>850){const a=Math.atan2(h*.5-ball.y,8-ball.x);ball.vx=Math.cos(a)*440;ball.vy=Math.sin(a)*440;wfoAiLastRed=now}
 }
 const playerDist=Math.hypot(ball.x-player.x,ball.y-player.y);
 if(playerDist<34){const d=playerDist||1;ball.vx+=(ball.x-player.x)/d*42*dt;ball.vy+=(ball.y-player.y)/d*42*dt}
 if(matchRole==='player'&&keys[' ']&&playerDist<76){
  const a=Math.atan2(ball.y-player.y,ball.x-player.x);
  ball.vx=Math.cos(a)*500;ball.vy=Math.sin(a)*500;keys[' ']=false;wfoLastTouch='player';
 }
 ball.x+=ball.vx*dt;ball.y+=ball.vy*dt;ball.vx*=Math.pow(.985,dt*60);ball.vy*=Math.pow(.985,dt*60);
 if(ball.x<8||ball.x>w-8){
  if(ball.y>h*.32&&ball.y<h*.68){
   const scoredRight=ball.x>w-8;if(scoredRight)scoreA++;else scoreB++;
   celebrateGoal(scoredRight);ball.x=w*.5;ball.y=h*.5;ball.vx=ball.vy=0;
  }else if(window.wfoHandleOut)window.wfoHandleOut('fondo');else{ball.x=Math.max(12,Math.min(w-12,ball.x));ball.vx*=-.7}
 }else if(ball.y<15||ball.y>h-15){
  if(window.wfoHandleOut)window.wfoHandleOut('lateral');else{ball.y=Math.max(15,Math.min(h-15,ball.y));ball.vy*=-.7}
 }
 draw(w,h);$('score').textContent=scoreA+' - '+scoreB;
 $('clock').textContent=String(Math.floor(elapsed/60)).padStart(2,'0')+':'+String(Math.floor(elapsed%60)).padStart(2,'0');
 raf=requestAnimationFrame(loop);
};
/* Controles claros para PC y móvil */
const wfoHint=document.querySelector('.gamehint');
if(wfoHint)wfoHint.textContent='WASD / flechas: moverte · ESPACIO: patear · En celular: joystick + ⚽';

})();
