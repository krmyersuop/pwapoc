if('serviceWorker' in navigator) {
  navigator.serviceWorker.register('./sw.js')
  .then(function(registration){
    console.log('Service Worker Registered');

  }).catch(function(err){
    console.log('Service Worker Registration failed', err);
  })
}

document.addEventListener("DOMContentLoaded",function(){
    renderToDo();
});

function renderToDo() {

    if ('caches' in window) {
      const url = `${window.location.origin}/apis/todo.json`;
      caches.match(url)
        .then((response) => {
            if (response) {
              return response.json();
            }
            return null;
            })
        .then(function(tasklist) {
            const html = `
            <div>This is from CACHE!</div>            
            <ul class="task-list">
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
        })
        .catch((err) => {
            console.error('Error getting data from cache', err);
            return null;
        });
    }

    setTimeout(function(){ 
        fetch("apis/todo.json")
        .then(function(response) {
            return response.json();
        })
        .then(function(tasklist) {
            const html = `
                <ul class="task-list">
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
    }, 500);
}
