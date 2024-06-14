document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("todo-form");
  const input = document.getElementById("todo-input");
  const todoList = document.getElementById("todo-list");

  // Load tasks from localStorage
  const storedTasks = JSON.parse(localStorage.getItem("todos")) || [];
  storedTasks.forEach((task) => {
    addTodoElement(task);
  });

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    addTodo();
  });

  function addTodo() {
    const text = input.value.trim();
    if (text === "") return;

    const createdDate = new Date().toLocaleString();
    const task = {
      text,
      done: false,
      createdDate,
      modifiedDate: createdDate,
    };

    storedTasks.push(task);
    localStorage.setItem("todos", JSON.stringify(storedTasks));

    addTodoElement(task);
    input.value = "";
  }

  function addTodoElement(task) {
    const li = document.createElement("li");

    const spanTask = document.createElement("span");
    spanTask.className = "task";
    spanTask.textContent = task.text;

    const spanTimestamps = document.createElement("span");
    spanTimestamps.className = "timestamps";
    spanTimestamps.textContent = `Created: ${task.createdDate} | Modified: ${task.modifiedDate}`;

    const doneButton = createButton("done", "Done");
    const editButton = createButton("edit", "Edit");
    const deleteButton = createButton("delete", "Delete");

    const actionsDiv = document.createElement("div");
    actionsDiv.className = "actions";
    actionsDiv.appendChild(doneButton);
    actionsDiv.appendChild(editButton);
    actionsDiv.appendChild(deleteButton);

    li.appendChild(spanTask);
    li.appendChild(spanTimestamps);
    li.appendChild(actionsDiv);

    if (task.done) {
      li.classList.add("done");
    }

    todoList.appendChild(li);
  }

  function createButton(className, text) {
    const button = document.createElement("button");
    button.className = className;
    button.textContent = text;
    button.addEventListener("click", handleButtonClick);
    return button;
  }

  function handleButtonClick(e) {
    const li = e.target.parentElement.parentElement;
    const spanTask = li.querySelector("span.task");
    const spanTimestamps = li.querySelector("span.timestamps");
    const index = Array.from(todoList.children).indexOf(li);
    const task = storedTasks[index];

    const action = e.target.className;
    if (action === "done") {
      task.done = !task.done;
      li.classList.toggle("done");
    } else if (action === "edit") {
      startEdit(li, spanTask, spanTimestamps, task, index);
    } else if (action === "delete") {
      storedTasks.splice(index, 1);
      localStorage.setItem("todos", JSON.stringify(storedTasks));
      todoList.removeChild(li);
    }

    if (action !== "edit" && action !== "delete") {
      task.modifiedDate = new Date().toLocaleString();
      spanTimestamps.textContent = `Created: ${task.createdDate} | Modified: ${task.modifiedDate}`;
      localStorage.setItem("todos", JSON.stringify(storedTasks));
    }
  }

  function startEdit(li, spanTask, spanTimestamps, task, index) {
    const currentText = spanTask.textContent;
    const input = document.createElement("input");
    input.className = "edit-input";
    input.type = "text";
    input.value = currentText;

    const saveButton = createButton("save", "Save");
    const cancelButton = createButton("cancel", "Cancel");

    const editActions = document.createElement("div");
    editActions.className = "edit-actions";
    editActions.appendChild(saveButton);
    editActions.appendChild(cancelButton);

    li.innerHTML = "";
    li.appendChild(input);
    li.appendChild(editActions);

    saveButton.addEventListener("click", () => saveEdit(li, input, spanTimestamps, task, index));
    cancelButton.addEventListener("click", () => cancelEdit(li, spanTask, spanTimestamps, task));
  }

  function saveEdit(li, input, spanTimestamps, task, index) {
    const newText = input.value.trim();
    if (newText !== "") {
      task.text = newText;
      task.modifiedDate = new Date().toLocaleString();
      storedTasks[index] = task;
      localStorage.setItem("todos", JSON.stringify(storedTasks));
      li.innerHTML = "";
      addTodoElement(task);
    } else {
      cancelEdit(li, task);
    }
  }

  function cancelEdit(li, spanTask, spanTimestamps, task) {
    li.innerHTML = "";
    li.appendChild(spanTask);
    li.appendChild(spanTimestamps);
    const actionsDiv = document.createElement("div");
    actionsDiv.className = "actions";
    actionsDiv.appendChild(createButton("done", "Done"));
    actionsDiv.appendChild(createButton("edit", "Edit"));
    actionsDiv.appendChild(createButton("delete", "Delete"));
    li.appendChild(actionsDiv);
    if (task.done) {
      li.classList.add("done");
    }
  }
});
