// Если JavaScript загрузился, включаем анимации. Без JS весь контент остаётся видимым.
document.documentElement.classList.add('js-enabled');


document.addEventListener('DOMContentLoaded',()=>{
  const menu=document.querySelector('.menu-toggle'),nav=document.querySelector('.nav');
  if(menu&&nav) menu.addEventListener('click',()=>{nav.classList.toggle('open');menu.setAttribute('aria-expanded',nav.classList.contains('open'));});
  const revealItems=document.querySelectorAll('.reveal');
  if('IntersectionObserver' in window){
    const observer=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add('visible');observer.unobserve(e.target)}}),{threshold:.08});
    revealItems.forEach(el=>observer.observe(el));
  }else{
    revealItems.forEach(el=>el.classList.add('visible'));
  }
  const toast=document.querySelector('.toast');
  window.showToast=(msg)=>{if(!toast)return;toast.textContent=msg;toast.classList.add('show');setTimeout(()=>toast.classList.remove('show'),2600)};
  document.querySelectorAll('[data-demo]').forEach(el=>el.addEventListener('click',e=>{e.preventDefault();showToast(el.dataset.demo||'Функция будет доступна после подключения данных');}));
  const search=document.querySelector('[data-search]');
  if(search){const input=search.querySelector('input');search.addEventListener('submit',e=>{e.preventDefault();const q=(input?.value||'').trim();showToast(q?`Ищем: ${q}`:'Введите название вуза, направления или профессии');});}
  const egeForm=document.querySelector('#ege-form');
  if(egeForm){
    const checks=[...egeForm.querySelectorAll('[data-elective]')];
    const mathType=egeForm.querySelector('#math-type');
    const mathScore=egeForm.querySelector('#math-score');
    const count=()=>checks.filter(c=>c.checked).length;
    const updateMath=()=>{
      if(!mathType||!mathScore)return;
      const basic=mathType.value==='basic';
      mathScore.min=basic?'2':'0';
      mathScore.max=basic?'5':'100';
      mathScore.step='1';
      mathScore.placeholder=basic?'Базовая: оценка 2–5':'Профиль: баллы 0–100';
      mathScore.setCustomValidity('');
    };
    checks.forEach(check=>{
      const card=check.closest('.subject');
      const score=card?.querySelector('.score');
      if(score)score.disabled=!check.checked;
      card?.classList.toggle('selected',check.checked);
      check.addEventListener('change',()=>{
        if(count()>2){
          check.checked=false;
          showToast('Можно выбрать не больше двух предметов по выбору');
        }
        if(score){
          score.disabled=!check.checked;
          if(!check.checked)score.value='';
          else score.focus();
        }
        card?.classList.toggle('selected',check.checked);
      });
    });
    mathType?.addEventListener('change',updateMath);
    updateMath();
    egeForm.addEventListener('reset',()=>{
      setTimeout(()=>{
        checks.forEach(check=>{
          const card=check.closest('.subject');
          const score=card?.querySelector('.score');
          if(score)score.disabled=true;
          card?.classList.remove('selected');
        });
        updateMath();
      },0);
    });
    egeForm.addEventListener('submit',e=>{
      e.preventDefault();
      const invalidElective=checks.some(check=>check.checked&&!check.closest('.subject')?.querySelector('.score')?.value);
      if(invalidElective){showToast('Введи баллы по каждому выбранному предмету');return;}
      const basic=mathType?.value==='basic';
      const value=Number(mathScore?.value);
      if(!Number.isFinite(value)||(basic?(value<2||value>5):(value<0||value>100))){
        showToast(basic?'Для базовой математики укажи оценку от 2 до 5':'Для профильной математики укажи баллы от 0 до 100');
        mathScore?.focus();return;
      }
      showToast('Результаты заполнены! Для постоянного хранения подключите базу данных.');
    });
  }
  document.querySelectorAll('[data-filter]').forEach(sel=>sel.addEventListener('change',()=>{const cards=[...document.querySelectorAll('[data-city-card]')];cards.forEach(card=>{const val=sel.value;card.hidden=!!val&&val!=='Все города'&&card.dataset.cityCard!==val;});}));
});
