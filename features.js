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
function wfoName(){return ($('wfoName').value||pdata.name||'Fran').trim()||'Fran'}
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
 $('goalSub').textContent=scored?'¡Fran y el equipo salen corriendo a festejar! ¡Saludo a la tribuna!':'¡El rival corre a festejar el gol!';
 $('goalTitle').textContent=scored?'¡¡GOOOOL DE FRAN!!':'¡GOL DEL RIVAL!';
 const dancers=box.querySelector('.celebration-dancers');if(dancers)dancers.innerHTML='<span>🏃</span><span>🙌</span><span>🏃</span><span>🕺</span>';
 box.querySelector('.goal-emoji').textContent='⚽🎉🏟️';
 if(wfoCrowdContext){const o=wfoCrowdContext.createOscillator(),g=wfoCrowdContext.createGain();o.type='sawtooth';o.frequency.value=95;g.gain.value=.025;o.connect(g);g.connect(wfoCrowdContext.destination);o.start();o.stop(wfoCrowdContext.currentTime+2.8)}
 speak(scored?'¡La tribuna canta: Fran, Fran, Fran! ¡Golazo!':'¡La tribuna explota con el gol!');
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

})();