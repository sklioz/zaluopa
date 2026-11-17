(() => {
 const $=id=>document.getElementById(id);
 const KEYS={budget:'tarelka_student_budget_v1',expenses:'tarelka_student_expenses_v1',tasks:'tarelka_student_tasks_v1'};
 const read=(key,fallback)=>{try{const value=JSON.parse(localStorage.getItem(key));return value??fallback}catch{return fallback}};
 const save=(key,value)=>{try{localStorage.setItem(key,JSON.stringify(value));return true}catch{return false}};
 const money=value=>new Intl.NumberFormat('ru-RU',{maximumFractionDigits:0}).format(value)+' ₽';
 let limit=read(KEYS.budget,null),expenses=read(KEYS.expenses,[]),tasks=read(KEYS.tasks,[]);
 function renderBudget(){
  $('student-budget-limit').value=limit??'';
  const spent=expenses.reduce((sum,item)=>sum+item.amount,0);
  $('student-budget-left').textContent=limit===null?'Не задано':money(limit-spent);
  $('student-budget-left').style.color=limit!==null&&limit-spent<0?'#ff8ca8':'';
  $('student-budget-spent').textContent=money(spent);
  $('student-expense-list').innerHTML=expenses.length?expenses.slice().reverse().map((item,index)=>'<div class="student-list-row"><span><strong>'+escapeHtml(item.name)+'</strong><small>'+escapeHtml(item.date)+'</small></span><b>'+money(item.amount)+'</b><button type="button" data-expense-remove="'+(expenses.length-1-index)+'" aria-label="Удалить расход">×</button></div>').join(''):'<p class="small-note">Пока расходов нет. Добавь первую запись.</p>';
 }
 function renderTasks(){
  tasks.sort((a,b)=>a.date.localeCompare(b.date));
  $('student-task-list').innerHTML=tasks.length?tasks.map((task,index)=>'<div class="student-list-row '+(task.done?'is-done':'')+'"><label class="student-task-check"><input type="checkbox" data-task-done="'+index+'" '+(task.done?'checked':'')+'><span><strong>'+escapeHtml(task.title)+'</strong><small>'+escapeHtml(task.type)+' · '+escapeHtml(task.date)+'</small></span></label><button type="button" data-task-remove="'+index+'" aria-label="Удалить задачу">×</button></div>').join(''):'<p class="small-note">Список пуст. Добавь ближайший дедлайн или пару.</p>';
 }
 function escapeHtml(value){return String(value).replace(/[&<>"']/g,char=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));}
 $('student-budget-save').addEventListener('click',()=>{
  const raw=$('student-budget-limit').value;
  if(raw===''||!Number.isFinite(Number(raw))||Number(raw)<0){$('student-budget-left').textContent='Введи корректную сумму';return;}
  limit=Math.round(Number(raw));save(KEYS.budget,limit);renderBudget();
 });
 $('student-expense-form').addEventListener('submit',event=>{
  event.preventDefault();const name=$('student-expense-name').value.trim(),amount=Number($('student-expense-amount').value);
  if(!name||!Number.isFinite(amount)||amount<=0)return;
  expenses.push({name,amount:Math.round(amount),date:new Date().toLocaleDateString('ru-RU')});
  if(save(KEYS.expenses,expenses)){event.target.reset();renderBudget();}
 });
 $('student-expense-list').addEventListener('click',event=>{
  const button=event.target.closest('[data-expense-remove]');if(!button)return;
  expenses.splice(Number(button.dataset.expenseRemove),1);save(KEYS.expenses,expenses);renderBudget();
 });
 $('student-task-form').addEventListener('submit',event=>{
  event.preventDefault();const title=$('student-task-title').value.trim(),date=$('student-task-date').value,type=$('student-task-type').value;
  if(!title||!date)return;tasks.push({title,date,type,done:false});
  if(save(KEYS.tasks,tasks)){event.target.reset();renderTasks();}
 });
 $('student-task-list').addEventListener('click',event=>{
  const remove=event.target.closest('[data-task-remove]');
  if(remove){tasks.splice(Number(remove.dataset.taskRemove),1);save(KEYS.tasks,tasks);renderTasks();}
 });
 $('student-task-list').addEventListener('change',event=>{
  const checkbox=event.target.closest('[data-task-done]');if(!checkbox)return;
  const task=tasks[Number(checkbox.dataset.taskDone)];if(task){task.done=checkbox.checked;save(KEYS.tasks,tasks);renderTasks();}
 });
 const dateInput=$('student-task-date');if(dateInput){const today=new Date();dateInput.value=[today.getFullYear(),String(today.getMonth()+1).padStart(2,'0'),String(today.getDate()).padStart(2,'0')].join('-');}
 renderBudget();renderTasks();
})();