createTask = document.querySelector('.createTask');
inputTask = document.querySelector('.inputTask');
taskBoard = document.querySelector('.tasks');
let tasks = [];

document.addEventListener('DOMContentLoaded', () => {
  if (localStorage.getItem('Tasks')) {
    tasks = JSON.parse(localStorage.getItem('Tasks'));
    let task;
    for (let i = 0; i < tasks.length; i++) {
      task = JSON.parse(tasks[i]);
      addTask(task.text, task.state);
    }
  }
  if (!localStorage.getItem('firstTime')) {
    modal = document.getElementById('modal');
    cross = document.getElementsByClassName('close')[0];
    modal.style.display = "flex";
    cross.onclick = function () {
      display();
      // modal.style.display = "none";
    }
    window.onclick = function (event) {
      if (event.target == modal) {
        display();
        // modal.style.display = "none";
      }
    }
  }
})

function display() {
  modal.style.display = "none";
  if(document.getElementById('dontShow').checked){
    localStorage.setItem('firstTime', "dont Show");
  }
}

createTask.addEventListener('click', () => {
  addStorage();
});

inputTask.addEventListener('keyup', (e) => {
  e.preventDefault();
  if (e.keyCode === 13) {
    addStorage();
  }
})

taskBoard.addEventListener('dblclick', e => {
  if (e.target.className === 'task') {
    let edit = e.target;

    editInput = document.createElement('textarea');
    editInput.value = edit.firstChild.textContent;
    editInput.className = 'editInput';
    editInput.setAttribute('oninput', 'grow(this)');

    while (edit.firstChild) {
      edit.removeChild(edit.lastChild);
    }

    edit.append(editInput);
    grow(editInput);
    editInput.focus();

    editInput.addEventListener('keyup', e => {
      if (e.keyCode === 13) {
        e.preventDefault();
        editInput.blur();
      }
    });

    editInput.addEventListener('focusout', e => {
      if (e.target.value.slice(-1) === '\n') {
        append(edit, e.target.value.slice(0, e.target.value.length - 1));
        editInput.remove();
        setTasks(edit.parentNode.childNodes)
      }
      else {
        append(edit, e.target.value);
        editInput.remove();
        setTasks(edit.parentNode.childNodes)
      }
    });
  }
})

taskBoard.addEventListener('click', e => {
  if (e.target.textContent === 'delete') {
    const elem = e.target.parentNode;
    if (elem.className === 'task' || elem.className === "completed") {
      elem.classList.add('deleteAnimation');
      elem.addEventListener('transitionend', () => {
        const element = elem.parentNode.childNodes;
        let newList = [];
        for (let i = 0; i < element.length; i++) {
          if (!element[i].classList[1]) {
            newList.push('{"text":"' + element[i].firstChild.textContent + '", "state":"' + element[i].className + '"}');
          }
        }
        tasks = newList;
        localStorage.setItem('Tasks', JSON.stringify(newList));
        elem.remove();
      })
    }
  }
  if (e.target.textContent === 'done') {
    if (e.target.parentNode.className === "completed") {
      e.target.parentNode.className = 'task';
      setTasks(e.target.parentNode.parentNode.childNodes);
    }
    else if (e.target.parentNode.className === 'task') {
      e.target.parentNode.className = "completed";
      setTasks(e.target.parentNode.parentNode.childNodes);
    }
  }
  if (e.target.textContent === 'edit') {
    let edit = e.target.parentNode.firstChild;
    editInput = document.createElement('input');
    editInput.value = e.target.parentNode.firstChild.textContent;
    edit.innerHTML = '';
    editInput.className = 'editInput';
    edit.append(editInput);
    editInput.focus();
  }
})

function addTask(task, state) {
  newtask = document.createElement('div');
  newtask.className = state;
  append(newtask, task);
  taskBoard.append(newtask);
}

function append(element, content) {
  text = document.createElement('p');
  deleteBtn = document.createElement('button');
  completeBtn = document.createElement('button');

  text.innerHTML = content;
  deleteBtn.innerHTML = '<span class="material-icons">delete</span>';
  completeBtn.innerHTML = '<span class="material-icons">done</span>';

  text.className = 'text';
  deleteBtn.className = 'delete';
  completeBtn.className = 'complete';

  element.append(text);
  element.append(completeBtn);
  element.append(deleteBtn);
}

function addStorage() {
  if (inputTask.value) {
    tasks.push('{"text":"' + inputTask.value + '", "state": "task"}');
    localStorage.setItem('Tasks', JSON.stringify(tasks));
    addTask(inputTask.value, 'task');
    inputTask.value = "";
  }
}

function setTasks(tasks) {
  let newList = [];
  for (let i = 0; i < tasks.length; i++) {
    newList.push('{"text":"' + tasks[i].firstChild.textContent + '", "state":"' + tasks[i].className + '"}');
  }
  tasks = newList;
  localStorage.setItem('Tasks', JSON.stringify(newList));
}

function grow(e) {
  const span = document.createElement('p');
  span.textContent = e.value;
  span.className = "text";
  const task = document.createElement('div');
  task.className = "task";
  task.append(span)
  e.parentNode.parentNode.append(task);
  e.style.height = span.offsetHeight + "px";
  task.remove();
}

function option(e) {
  for (let i = 0; i < taskBoard.childNodes.length; i++) {
    if (taskBoard.childNodes[i].className === e.value) {
      taskBoard.childNodes[i].style.display = "none";
    }
    else {
      taskBoard.childNodes[i].style.display = "inline-grid";
    }
  }
} 