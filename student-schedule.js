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
 function renderOfficial(){
  const root=$('official-week');if(!root)return;
  const parity=$('official-parity')?.value||'all';
  const entries=official.filter(x=>parity==='all'||!x[3]||x[3]===parity);
  $('official-count').textContent=entries.length+' записей';
  root.innerHTML=days.map((day,index)=>{
   const list=entries.filter(x=>x[0]===index).sort((a,b)=>a[1]-b[1]||a[2].localeCompare(b[2]));
   if(!list.length)return '';
   return '<section class="official-day"><h4>'+day+'</h4>'+list.map(x=>'<article class="official-lesson"><div class="official-lesson-time"><b>'+x[1]+' пара</b><time>'+x[2]+'</time><span>'+(x[3]||'Ч/З')+'</span></div><div class="official-lesson-body"><strong>'+esc(x[5])+'</strong><div class="official-meta">'+esc(x[4])+' · ауд. '+esc(x[6])+' · '+esc(x[7])+'</div>'+(x[9]?'<small>'+esc(x[9])+'</small>':'')+'<small>'+esc(x[8])+'</small></div></article>').join('')+'</section>';
  }).join('')||'<p class="small-note">На выбранную неделю занятий нет.</p>';
 }
 $('official-parity')?.addEventListener('change',renderOfficial);
 const daysForm=[['1','Понедельник'],['2','Вторник'],['3','Среда'],['4','Четверг'],['5','Пятница'],['6','Суббота'],['0','Воскресенье']];
 const read=()=>{try{const v=JSON.parse(localStorage.getItem(KEY));return Array.isArray(v)?v:[]}catch{return[]}};
 let lessons=read();
 const save=()=>{try{localStorage.setItem(KEY,JSON.stringify(lessons));return true}catch{return false}};
 function renderPersonal(){
  const root=$('uni-week');if(!root)return;
  const sorted=lessons.map((lesson,index)=>({...lesson,index})).sort((a,b)=>Number(a.day)-Number(b.day)||a.time.localeCompare(b.time));
  root.innerHTML=sorted.length?sorted.map(item=>'<article class="uni-lesson '+(item.done?'homework-done':'')+'"><div class="uni-lesson-top"><span class="uni-day">'+daysForm.find(d=>d[0]===item.day)?.[1]+'</span><time>'+esc(item.time)+'</time><button type="button" data-lesson-remove="'+item.index+'" aria-label="Удалить пару">×</button></div><h4>'+esc(item.subject)+'</h4><div class="uni-meta">'+(item.room?'<span>Ауд. '+esc(item.room)+'</span>':'')+(item.teacher?'<span>'+esc(item.teacher)+'</span>':'')+'</div><div class="uni-homework"><label>ДОМАШНЕЕ ЗАДАНИЕ</label><textarea rows="2" maxlength="500" data-homework-text="'+item.index+'" placeholder="Пока ничего не задано">'+esc(item.homework)+'</textarea><div class="uni-homework-foot">'+(item.due?'<small>Сдать до: '+esc(item.due)+'</small>':'<small>Срок не указан</small>')+'<label class="uni-done"><input type="checkbox" data-homework-done="'+item.index+'" '+(item.done?'checked':'')+'> Выполнено</label></div><button type="button" class="uni-save-homework" data-homework-save="'+item.index+'">СОХРАНИТЬ ДЗ</button></div></article>').join(''):'<p class="small-note">Личных пар пока нет. Добавь заметку или свою пару через форму ниже.</p>';
 }
 $('uni-lesson-form')?.addEventListener('submit',event=>{
  event.preventDefault();
  const lesson={subject:$('uni-subject').value.trim(),day:$('uni-day').value,time:$('uni-time').value,room:$('uni-room').value.trim(),teacher:$('uni-teacher').value.trim(),homework:$('uni-homework').value.trim(),due:$('uni-due').value,done:false};
  if(!lesson.subject||!lesson.time)return;
  lessons.push(lesson);
  if(save()){event.target.reset();$('uni-time').value='09:00';renderPersonal();}
 });
 $('uni-week')?.addEventListener('click',event=>{
  const remove=event.target.closest('[data-lesson-remove]');
  if(remove){lessons.splice(Number(remove.dataset.lessonRemove),1);save();renderPersonal();return;}
  const button=event.target.closest('[data-homework-save]');
  if(button){const index=Number(button.dataset.homeworkSave),field=$('uni-week').querySelector('[data-homework-text="'+index+'"]');if(lessons[index]&&field){lessons[index].homework=field.value.trim();save();button.textContent='СОХРАНЕНО ✓';}}
 });
 $('uni-week')?.addEventListener('change',event=>{
  const checkbox=event.target.closest('[data-homework-done]');if(!checkbox)return;
  const item=lessons[Number(checkbox.dataset.homeworkDone)];if(item){item.done=checkbox.checked;save();renderPersonal();}
 });
 window.addEventListener('tarelka-cloud-loaded',()=>{lessons=read();renderPersonal();});
 renderOfficial();renderPersonal();
})();