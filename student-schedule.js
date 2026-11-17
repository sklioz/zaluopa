(() => {
 const $=id=>document.getElementById(id);
 const KEY='tarelka_uni_schedule_v1';
 const days=[['1','Понедельник'],['2','Вторник'],['3','Среда'],['4','Четверг'],['5','Пятница'],['6','Суббота'],['0','Воскресенье']];
 const esc=value=>String(value??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
 const read=()=>{try{const v=JSON.parse(localStorage.getItem(KEY));return Array.isArray(v)?v:[]}catch{return[]}};
 const save=()=>{try{localStorage.setItem(KEY,JSON.stringify(lessons));return true}catch{return false}};
 let lessons=read();
 function render(){
  const root=$('uni-week');if(!root)return;
  const sorted=lessons.map((lesson,index)=>({...lesson,index})).sort((a,b)=>Number(a.day)-Number(b.day)||a.time.localeCompare(b.time));
  root.innerHTML=sorted.length?sorted.map(item=>'<article class="uni-lesson '+(item.done?'homework-done':'')+'"><div class="uni-lesson-top"><span class="uni-day">'+days.find(d=>d[0]===item.day)?.[1]+'</span><time>'+esc(item.time)+'</time><button type="button" data-lesson-remove="'+item.index+'" aria-label="Удалить пару">×</button></div><h4>'+esc(item.subject)+'</h4><div class="uni-meta">'+(item.room?'<span>Ауд. '+esc(item.room)+'</span>':'')+(item.teacher?'<span>'+esc(item.teacher)+'</span>':'')+'</div><div class="uni-homework"><label>ДОМАШНЕЕ ЗАДАНИЕ</label><textarea rows="2" maxlength="500" data-homework-text="'+item.index+'" placeholder="Пока ничего не задано">'+esc(item.homework)+'</textarea><div class="uni-homework-foot">'+(item.due?'<small>Сдать до: '+esc(item.due)+'</small>':'<small>Срок не указан</small>')+'<label class="uni-done"><input type="checkbox" data-homework-done="'+item.index+'" '+(item.done?'checked':'')+'> Выполнено</label></div><button type="button" class="uni-save-homework" data-homework-save="'+item.index+'">СОХРАНИТЬ ДЗ</button></div></article>').join(''):'<p class="small-note">Расписание пока пустое. Добавь первую пару через форму выше.</p>';
 }
 $('uni-lesson-form')?.addEventListener('submit',event=>{
  event.preventDefault();
  const lesson={subject:$('uni-subject').value.trim(),day:$('uni-day').value,time:$('uni-time').value,room:$('uni-room').value.trim(),teacher:$('uni-teacher').value.trim(),homework:$('uni-homework').value.trim(),due:$('uni-due').value,done:false};
  if(!lesson.subject||!lesson.time)return;
  lessons.push(lesson);
  if(save()){event.target.reset();$('uni-time').value='09:00';render();}
 });
 $('uni-week')?.addEventListener('click',event=>{
  const remove=event.target.closest('[data-lesson-remove]');
  if(remove){lessons.splice(Number(remove.dataset.lessonRemove),1);save();render();return;}
  const button=event.target.closest('[data-homework-save]');
  if(button){const index=Number(button.dataset.homeworkSave),field=$('uni-week').querySelector('[data-homework-text="'+index+'"]');if(lessons[index]&&field){lessons[index].homework=field.value.trim();save();button.textContent='СОХРАНЕНО ✓';}}
 });
 $('uni-week')?.addEventListener('change',event=>{
  const checkbox=event.target.closest('[data-homework-done]');if(!checkbox)return;
  const item=lessons[Number(checkbox.dataset.homeworkDone)];if(item){item.done=checkbox.checked;save();render();}
 });
 window.addEventListener('tarelka-cloud-loaded',()=>{lessons=read();render();});
 render();
})();