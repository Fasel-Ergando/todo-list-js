//DOM elements
const taskInput = document.querySelector('.taskInput');
const addBtn = document.querySelector('.addBtn');
const filters = document.querySelectorAll('.filters div');
const displayTask = document.querySelector('.displayTask');

initApp();
function initApp() {
  addBtn.addEventListener('click', renderTask);
  window.addEventListener('keyup', e => {
    if (e.key === 'Enter') {
      renderTask();
    }
  });
  filters.forEach(filter => {
    filter.addEventListener('click', e => {
      filters.forEach(f => f.classList.remove('active'));
      filter.classList.add('active');
      filterTask(e.target.getAttribute('data-filterName'));
    });
  });
  displayTask.innerHTML = getTask()||'<p class="task-not-defined">You have no tasks</p>';
  createScrollBar();
}
function renderTask() {
  //Responsible for rendering the html that contains the todo task on the page
  filterTask('all');
  filters.forEach(f => f.classList.remove('active'));
  filters[0].classList.add('active');

  if (taskInput.value.trim()) {
    let html = `
    <div class="userTask" data-status="progress">
      <div class="taskBody">
        <img src="Assets/unchecked.png" onclick="checkImage(event, true)" alt="">
        <div class="taskName" onclick="checkImage(event, false)">${taskInput.value}</div>
      </div>
      <div class="deleteTask" onclick="deleteTask(event)">

      </div>
  </div>
    `;
    taskInput.value = '';
    if (displayTask.innerHTML === '<p class="task-not-defined">You have no tasks</p>') {
      displayTask.innerHTML = html;
    } else {
      displayTask.innerHTML += html;
    }
    
    createScrollBar();
    saveTask();
  }
}
function checkImage(e, isImg) {
  //Responsible for changing the image's source
  if (isImg) {
    let imageSource = (e.target.src.slice(e.target.src.indexOf('Assets')));
    if (imageSource === 'Assets/unchecked.png'){
       e.target.parentElement.parentElement.setAttribute('data-status', 'finished');
       e.target.src = (e.target.src.slice(0, e.target.src.indexOf('Assets')) + 'Assets/checked.png');
       e.target.parentElement.parentElement.querySelector('.taskName').classList.add('line-through');
    } else {
        e.target.parentElement.parentElement.setAttribute('data-status', 'progress');
        e.target.src = (e.target.src.slice(0, e.target.src.indexOf('Assets')) + 'Assets/unchecked.png');
        e.target.parentElement.parentElement.querySelector('.taskName').classList.remove('line-through');
    }
  } else {
    let imageSource = (e.target.parentElement.querySelector('img').src);
    let slicedImageSource = (imageSource.slice(imageSource.indexOf('Assets')));
    if (slicedImageSource === 'Assets/unchecked.png'){
      e.target.parentElement.parentElement.setAttribute('data-status', 'finished');
      e.target.parentElement.querySelector('img').src = (e.target.parentElement.querySelector('img').src.slice(0, e.target.parentElement.querySelector('img').src.indexOf('Assets')) + 'Assets/checked.png');
      e.target.parentElement.parentElement.querySelector('.taskName').classList.add('line-through');
   } else {
      e.target.parentElement.parentElement.setAttribute('data-status', 'progress');
      e.target.parentElement.querySelector('img').src = (e.target.parentElement.querySelector('img').src.slice(0, e.target.parentElement.querySelector('img').src.indexOf('Assets')) + 'Assets/unchecked.png');
      e.target.parentElement.parentElement.querySelector('.taskName').classList.remove('line-through');
   }
  }
  saveTask();
}
function filterTask(filterName) {
  //Adding functionality to all the filter buttons
  if (filterName === 'all') {
    displayTask.innerHTML = getTask()||'<p class="task-not-defined">You have no tasks</p>';
    createScrollBar();
  } else if (filterName === 'progress') {
    displayTask.innerHTML = getTask();
    let userTasks = displayTask.querySelectorAll('.userTask');
    displayTask.innerHTML = '';
    userTasks.forEach(userTask => {
      let taskStatus = (userTask.getAttribute('data-status'));
      if (taskStatus === 'progress') {
        displayTask.innerHTML += `
        <div class="userTask" data-status="progress">
        <div class="taskBody">
          <img src="Assets/unchecked.png" alt="">
          <div class="taskName">${userTask.querySelector('.taskName').innerHTML}</div>
        </div>
    </div>
        `;
      } 
    });

    //Check if there are no pending tasks
    if (!displayTask.innerHTML) {
      displayTask.innerHTML = '<p class="task-not-defined">You have no tasks</p>';
    }
    createScrollBar();
  } else if (filterName === 'finished') {
    displayTask.innerHTML = getTask();
    let userTasks = displayTask.querySelectorAll('.userTask');
    displayTask.innerHTML = '';
    userTasks.forEach(userTask => {
      let taskStatus = (userTask.getAttribute('data-status'));
      if (taskStatus === 'finished') {
        displayTask.innerHTML += `
        <div class="userTask" data-status="progress">
        <div class="taskBody">
          <img src="Assets/checked.png" alt="">
          <div class="taskName">${userTask.querySelector('.taskName').innerHTML}</div>
        </div>
    </div>
        `;
      } 
    });
    //check if no tasks are complete
    if (!displayTask.innerHTML) {
      displayTask.innerHTML = '<p class="task-not-defined">You have no tasks</p>';
    }
    createScrollBar();
  }
}
function createScrollBar() {
  //Responsible for creating scrollbars if the content exceeds the max content
  let taskNames = document.querySelectorAll('.taskName');
  taskNames.forEach(taskName => {
    if (taskName.clientWidth >= 200 && taskName.clientHeight >= 100) {
      taskName.classList.add('scrollBar');
    } else {
      taskName.classList.remove('scrollBar');
    }
    
  });

  if (displayTask.clientHeight >= 330) {
    displayTask.classList.add('scrollBar');
  } else {
    displayTask.classList.remove('scrollBar');
  }
}
function deleteTask(e) {
  //Responsible for deleting tasks
  e.target.parentElement.remove();
  if (!displayTask.innerHTML.trim()) {
    displayTask.innerHTML = '<p class="task-not-defined">You have no tasks</p>';
  }
  saveTask();
  createScrollBar();
}
function saveTask() {
  //Responsible for saving the task in the localStorage
  localStorage.setItem('user-todo-task', displayTask.innerHTML);
}
function getTask() {
  //Responsible for retrieving the task from the localStorage
  return localStorage.getItem('user-todo-task');
}
