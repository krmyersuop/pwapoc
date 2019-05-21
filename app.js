if('serviceWorker' in navigator) {
  navigator.serviceWorker.register('./sw.js')
  .then(function(registration){
    console.log('Service Worker Registered');

  }).catch(function(err){
    console.log('Service Worker Registration failed', err);
  })
}

document.addEventListener("DOMContentLoaded",function(){
    getToDo();
});

function getToDo() {

    if ('caches' in window) {
      const url = window.location.origin + '/apis/todo.json';
      caches.match(url)
        .then(renderToDo)
        .catch((err) => {
            console.error('Error getting data from cache', err);
            return null;
        });
    }

    setTimeout(function(){ 
        fetch("apis/todo.json")
        .then(renderToDo);
    }, 3000);
}

function renderToDo(response) {
  if (response) {
    const now = new Date();
    const responseTime = new Date(JSON.parse(response.headers.get("x-responseTime")));
    response.json()
      .then(tasklist => {
        const html = `
        <ul class="task-list">
        <li>This is from CACHE!</li>
        ${tasklist.map(task => 
              `<li class="list-item">
              <div class="due">
                  <div class="due-label">Due</div>
                  <div class="due-date">${task.due}</div>
              </div>
              <a href="${task.url}">${task.label}</a>
              </li>`
          ).join('')}
          </ul>
          `;
          document.querySelector('#todo').innerHTML = html;
      });
  }
}
