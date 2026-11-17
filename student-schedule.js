(() => {
 const $=id=>document.getElementById(id);
 const KEY='tarelka_uni_schedule_v1';
 const days=['Понедельник','Вторник','Среда','Четверг','Пятница','Суббота'];
 // Entries transcribed from the uploaded TOGU PDF. Ч = числитель, З = знаменатель.
 const official=[
 [0,5,'15:30','','пр','Математика','133л','Ясеновская И. В.','01.09.2026 – 05.01.2027',''],
 [1,1,'08:30','','пр','Проектная деятельность','101ц','Слепов Д. С.','14.09.2026 – 01.09.2026','Подгруппы 54, 56, 57'],
 [1,1,'08:30','','пр','Проектная деятельность','114п','Воронина Н. В.','14.09.2026 – 05.01.2027','Подгруппа 83'],
 [1,2,'10:10','','пр','Проектная деятельность','101ц','Фокин С. А.','14.09.2026 – 19.09.2026','Подгруппы 58, 59, 60, 63'],
 [1,2,'10:10','','пр','Проектная деятельность','101ц','Фокин С. А.','14.09.2026 – 30.09.2026','Подгруппы 58, 59, 60, 63'],
 [1,2,'10:10','','пр','Проектная деятельность','114п','Воронина Н. В.','14.09.2026 – 05.01.2027','Подгруппы 87, 89, 91'],
 [1,3,'11:50','','пр','Проектная деятельность','315п','Оттева И. В.','14.09.2026 – 05.01.2027','Подгруппы 66, 69'],
 [1,3,'11:50','','пр','Проектная деятельность','114п','Воронина Н. В.','14.09.2026 – 01.09.2026','Подгруппы 93, 98, 99'],
 [1,4,'13:50','','пр','Проектная деятельность','114п','Воронина Н. В.','01.09.2026 – 05.01.2027','Подгруппа 104'],
 [1,4,'13:50','','пр','Проектная деятельность','101ц','Фокин С. А.','21.09.2026 – 04.01.2027','Подгруппы 58, 59, 60, 63'],
 [1,5,'15:30','','пр','Проектная деятельность','440л','Шитова И. А.','01.09.2026 – 01.09.2026',''],
 [1,5,'15:30','','пр','Проектная деятельность','34л','Оттева И. В.','14.09.2026 – 01.09.2026','Подгруппа 73'],
 [2,2,'10:10','Ч','лк','Правоведение','418л','Коваленко Е. Г.','01.09.2026 – 05.01.2027',''],
 [2,3,'11:50','Ч','пр','Информатика','402л','Бегункова Н. О.','01.09.2026 – 05.01.2027','1 подгруппа'],
 [2,3,'11:50','Ч','лб','Физика','304ц','Зайцев С. А.','01.09.2026 – 04.01.2027','2 подгруппа'],
 [2,3,'11:50','З','лк','Физика','606ц','Крамарь Е. И.','01.09.2026 – 05.01.2027',''],
 [2,4,'13:50','Ч','пр','Информатика','402л','Бегункова Н. О.','01.09.2026 – 04.01.2027','1 подгруппа'],
 [2,4,'13:50','З','пр','Информатика','402лд','Бегункова Н. О.','01.09.2026 – 05.01.2027','2 подгруппа'],
 [2,5,'15:30','Ч','лк','Основы российской государственности','418л','Ким А. С.','01.09.2026 – 05.01.2027',''],
 [2,5,'15:30','З','пр','Информатика','402л','Бегункова Н. О.','14.09.2026 – 05.01.2027','2 подгруппа'],
 [2,6,'17:10','Ч','лк','Безопасность жизнедеятельности','418л','Мищенко О. А.','01.09.2026 – 05.01.2027',''],
 [3,2,'10:10','Ч','лб','Физика','302ц','Крамарь Е. И.','01.09.2026 – 04.01.2027','1 подгруппа'],
 [3,3,'11:50','','пр','Основы российской государственности','03л','Ким А. С.','01.09.2026 – 04.01.2027',''],
 [3,4,'13:50','Ч','пр','Правоведение','227п','Коваленко Е. Г.','01.09.2026 – 05.01.2027',''],
 [3,4,'13:50','З','лк','Информатика','422л','Зуфарова А. С.','01.09.2026 – 04.01.2027',''],
 [4,1,'08:30','','лк','Математика','422л','Ясеновская И. В.','01.09.2026 – 05.01.2027',''],
 [4,2,'10:10','Ч','пр','Физика','325л','Крамарь Е. И.','01.09.2026 – 05.01.2027',''],
 [4,2,'10:10','З','пр','Безопасность жизнедеятельности','313п','Волосникова Г. А.','01.09.2026 – 05.01.2027',''],
 [4,3,'11:50','','пр','История России','202п','Прудникова О. А.','01.09.2026 – 04.01.2027',''],
 [4,4,'13:50','Ч','пр','Риторика и академическое письмо','229п','Кузнецов В. В.','01.09.2026 – 04.01.2027',''],
 [4,4,'13:50','З','пр','Риторика и академическое письмо','453ц','Кузнецов В. В.','01.09.2026 – 04.01.2027',''],
 [5,1,'08:30','Ч','лк','История России','418л','Погарцев В. В.','01.09.2026 – 04.01.2027',''],
 [5,1,'08:30','З','лк','Риторика и академическое письмо','418л','Ковальчук И. Ю.','01.09.2026 – 05.01.2027',''],
 [5,2,'10:10','Ч','пр','Иностранный язык','419л','Рябинина М. В.','01.09.2026 – 05.01.2027','1 подгруппа'],
 [5,2,'10:10','Ч','пр','Иностранный язык','423па','Коваленко И. В.','01.09.2026 – 05.01.2027','2 подгруппа'],
 [5,2,'10:10','З','пр','Математика','227п','Ясеновская И. В.','01.09.2026 – 04.01.2027',''],
 [5,3,'11:50','','пр','Иностранный язык','419л','Рябинина М. В.','01.09.2026 – 05.01.2027','1 подгруппа'],
 [5,3,'11:50','','пр','Иностранный язык','455ца','Коваленко И. В.','01.09.2026 – 05.01.2027','2 подгруппа']
 ];
 const esc=value=>String(value??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
 const HW_KEY='tarelka_togu_homework_v1';
 const iso=d=>[d.getFullYear(),String(d.getMonth()+1).padStart(2,'0'),String(d.getDate()).padStart(2,'0')].join('-');
 const monday=d=>{const x=new Date(d+'T12:00:00');x.setDate(x.getDate()-((x.getDay()+6)%7));return x;};
 const weekStart=$('week-start');
 if(weekStart)weekStart.value=iso(monday(iso(new Date())));
 const signatures=official.map((x,i)=>String(i)+'|'+x[0]+'|'+x[1]+'|'+x[2]+'|'+x[5]+'|'+x[6]);
 const readHomework=()=>{try{return JSON.parse(localStorage.getItem(HW_KEY)||'{}')||{}}catch{return{}}};
 let homework=readHomework();
 const saveHomework=()=>{try{localStorage.setItem(HW_KEY,JSON.stringify(homework));return true}catch{return false}};
 const lessonTitle=x=>x[5]+' · '+days[x[0]]+', '+x[1]+' пара, '+x[2];
 function updateHomeworkCount(){
  const count=Object.values(homework).filter(x=>x&&x.text&&x.text.trim()).length;
  const badge=$('homework-count');if(badge)badge.textContent=count;
 }
 function renderHomework(){
  const root=$('homework-list');if(!root)return;
  const items=official.map((x,i)=>({x,i,h:homework[signatures[i]]||{}})).filter(v=>v.h.text&&v.h.text.trim());
  root.innerHTML=items.length?items.map(({x,i,h})=>'<article class="homework-entry '+(h.done?'is-done':'')+'"><strong>'+esc(lessonTitle(x))+'</strong><p>'+esc(h.text)+'</p><small>'+esc(x[6]+' · '+x[7])+(h.due?' · Сдать до '+esc(h.due):'')+'</small><div class="official-homework-foot"><label><input type="checkbox" data-hw-done="'+i+'" '+(h.done?'checked':'')+'> Выполнено</label><button type="button" data-hw-edit="'+i+'">Открыть пару</button></div></article>').join(''):'<div class="homework-empty">Пока нет сохранённых заданий. Добавь ДЗ под нужной парой во вкладке «Расписание».</div>';
  updateHomeworkCount();
 }
 function renderOfficial(){
  const root=$('official-week');if(!root)return;
  const parity=$('official-parity')?.value||'all';
  const entries=official.filter(x=>parity==='all'||!x[3]||x[3]===parity);
  $('official-count').textContent=entries.length+' занятий';
  const start=weekStart?.value?new Date(weekStart.value+'T12:00:00'):monday(iso(new Date()));
  const end=new Date(start);end.setDate(end.getDate()+5);
  const today=iso(new Date());
  const caption=$('week-caption');if(caption)caption.textContent=start.toLocaleDateString('ru-RU',{day:'numeric',month:'short'})+' – '+end.toLocaleDateString('ru-RU',{day:'numeric',month:'short'});
  root.innerHTML=days.map((day,index)=>{
   const list=entries.map(x=>({x,i:official.indexOf(x)})).filter(v=>v.x[0]===index).sort((a,b)=>a.x[1]-b.x[1]||a.x[2].localeCompare(b.x[2]));
   if(!list.length)return '';
   const dayDate=new Date(start);dayDate.setDate(dayDate.getDate()+index);
   const dayIso=iso(dayDate);
   return '<section class="official-day '+(dayIso===today?'is-today':'')+'"><h4>'+day+'<small class="day-date">'+dayDate.toLocaleDateString('ru-RU',{day:'numeric',month:'short'})+(dayIso===today?' · СЕГОДНЯ':'')+'</small></h4>'+list.map(({x,i})=>{
    const h=homework[signatures[i]]||{};
    const expanded=Boolean(h.text&&h.text.trim());
    return '<article class="official-lesson" id="lesson-'+i+'"><div class="official-lesson-time"><b>'+x[1]+' пара</b><time>'+x[2]+'</time><span>'+(x[3]||'Ч/З')+'</span></div><div class="official-lesson-body"><strong>'+esc(x[5])+'</strong><div class="official-meta">'+esc(x[4])+' · ауд. '+esc(x[6])+' · '+esc(x[7])+'</div>'+(x[9]?'<small>'+esc(x[9])+'</small>':'')+'<small>'+esc(x[8])+'</small><button class="hw-toggle" type="button" data-hw-toggle="'+i+'" aria-expanded="'+expanded+'">'+(expanded?'Изменить ДЗ':'＋ Добавить ДЗ')+'</button></div><div class="official-homework" data-hw-panel="'+i+'" '+(expanded?'':'hidden')+'><textarea maxlength="1200" data-hw-text="'+i+'" placeholder="Запиши домашнее задание...">'+esc(h.text||'')+'</textarea><div class="official-homework-foot"><label>Срок <input type="date" data-hw-due="'+i+'" value="'+esc(h.due||'')+'"></label><label><input type="checkbox" data-hw-done="'+i+'" '+(h.done?'checked':'')+'> Выполнено</label><button type="button" data-hw-save="'+i+'">СОХРАНИТЬ</button></div></div></article>';
   }).join('')+'</section>';
  }).join('')||'<p class="small-note">На выбранный тип недели занятий нет.</p>';
 }
 function selectTab(which){
  const schedule=which==='schedule';
  $('panel-schedule').hidden=!schedule;$('panel-homework').hidden=schedule;
  $('tab-schedule').classList.toggle('is-active',schedule);$('tab-homework').classList.toggle('is-active',!schedule);
  $('tab-schedule').setAttribute('aria-selected',String(schedule));$('tab-homework').setAttribute('aria-selected',String(!schedule));
  if(!schedule)renderHomework();
 }
 $('tab-schedule')?.addEventListener('click',()=>selectTab('schedule'));
 $('tab-homework')?.addEventListener('click',()=>selectTab('homework'));
 $('official-parity')?.addEventListener('change',renderOfficial);
 $('week-start')?.addEventListener('change',()=>{if(weekStart.value)weekStart.value=iso(monday(weekStart.value));renderOfficial();});
 $('week-prev')?.addEventListener('click',()=>{const d=monday(weekStart.value);d.setDate(d.getDate()-7);weekStart.value=iso(d);renderOfficial();});
 $('week-next')?.addEventListener('click',()=>{const d=monday(weekStart.value);d.setDate(d.getDate()+7);weekStart.value=iso(d);renderOfficial();});
 $('week-current')?.addEventListener('click',()=>{weekStart.value=iso(monday(iso(new Date())));renderOfficial();});
 $('official-week')?.addEventListener('click',event=>{
  const toggle=event.target.closest('[data-hw-toggle]');
  if(toggle){
   const i=Number(toggle.dataset.hwToggle);
   const panel=$('official-week').querySelector('[data-hw-panel="'+i+'"]');
   const open=panel?.hidden;
   if(panel)panel.hidden=!open;
   toggle.setAttribute('aria-expanded',String(Boolean(open)));
   toggle.textContent=open?'Скрыть ДЗ':'＋ Добавить ДЗ';
   if(open)panel?.querySelector('textarea')?.focus();
   return;
  }
  const button=event.target.closest('[data-hw-save]');
  if(button){
   const i=Number(button.dataset.hwSave);
   const area=$('official-week').querySelector('[data-hw-text="'+i+'"]');
   const due=$('official-week').querySelector('[data-hw-due="'+i+'"]');
   homework[signatures[i]]={...(homework[signatures[i]]||{}),text:area?.value||'',due:due?.value||''};
   if(saveHomework()){button.textContent='СОХРАНЕНО ✓';renderHomework();updateHomeworkCount();}
   else button.textContent='ОШИБКА СОХРАНЕНИЯ';
   return;
  }
 });
 $('homework-list')?.addEventListener('click',event=>{
  const edit=event.target.closest('[data-hw-edit]');if(!edit)return;
  const i=Number(edit.dataset.hwEdit);
  selectTab('schedule');
  const card=$('official-week').querySelector('#lesson-'+i);
  const toggle=card?.querySelector('[data-hw-toggle]');
  const panel=card?.querySelector('[data-hw-panel]');
  if(panel){panel.hidden=false;toggle?.setAttribute('aria-expanded','true');if(toggle)toggle.textContent='Скрыть ДЗ';}
  card?.scrollIntoView({behavior:'smooth',block:'center'});
 });
 $('official-week')?.addEventListener('change',event=>{
  const due=event.target.closest('[data-hw-due]');const done=event.target.closest('[data-hw-done]');
  if(due){const i=Number(due.dataset.hwDue);homework[signatures[i]]={...(homework[signatures[i]]||{}),due:due.value};}
  if(done){const i=Number(done.dataset.hwDone);homework[signatures[i]]={...(homework[signatures[i]]||{}),done:done.checked};}
  saveHomework();renderHomework();
 });
 $('homework-list')?.addEventListener('change',event=>{
  const box=event.target.closest('[data-hw-done]');if(!box)return;
  const i=Number(box.dataset.hwDone);homework[signatures[i]]={...(homework[signatures[i]]||{}),done:box.checked};saveHomework();renderHomework();
 });
 window.addEventListener('tarelka-cloud-loaded',()=>{homework=readHomework();renderOfficial();renderHomework();});
 updateHomeworkCount();renderOfficial();renderHomework();
})();