document.addEventListener('DOMContentLoaded', function () {
        let tasks = [];
        document.querySelector('.tform').addEventListener('submit', function (e) {
            e.preventDefault();

            const title = document.getElementById('title').value.trim();
            const desc = document.getElementById('desc').value.trim();
            const date = document.getElementById('dateinput').value;

            if (title === '' || desc === '' || date === '') {
                alert('Please fill out all fields');
                return;
            }

            const newTask = {
                id: Date.now(), 
                title,
                desc,
                date,
                status: 'pending' 
            };

            tasks.push(newTask);

        
            addTaskToServer(newTask);

            document.querySelector('.tform').reset();

            
            displayTasks('all');
        });

        
        document.querySelectorAll('.statusbtn').forEach(button => {
            button.addEventListener('click', function () {
                const filter = this.textContent.toLowerCase();
                displayTasks(filter);
            });
        });

       
        function addTaskToServer(task) {
            const xhttp = new XMLHttpRequest();
            xhttp.onreadystatechange = function () {
                if (this.readyState == 4 && this.status == 200) {
                    console.log('Task added:', task);
                }
            };
            xhttp.open('POST', '/add-task', true);
            xhttp.setRequestHeader('Content-Type', 'application/json');
            xhttp.send(JSON.stringify(task));
        }

        
        function displayTasks(filter) {
            const taskList = document.querySelector('.taskslist');
            taskList.innerHTML = '';

            const filteredTasks = tasks.filter(task => {
                if (filter === 'all') return true;
                if (filter === 'pending') return task.status === 'pending';
                if (filter === 'completed') return task.status === 'completed';
            });

            filteredTasks.forEach(task => {
                const li = document.createElement('li');
                li.innerHTML = `
                    <div class='list'>
                    <div class='h44' >${task.title}</div>
                    <div class='des'>${task.desc}</div>
                    <p style='margin-left:10px;'    >${task.date}</p>
                    <button class='actions'  onclick="editTask(${task.id})">Edit</button>
                    <button class='actions' onclick="deleteTask(${task.id})">Delete</button>
                    <button class='actions' style='margin-left:10px;' onclick="toggleTaskStatus(${task.id})">
                        ${task.status === 'pending' ? 'Completed' : 'Pending'}
                    </button>
                    </div>
                `;
                li.classList.add(task.status);
                taskList.appendChild(li);
            });
        }

        
        window.editTask = function (id) {
            const task = tasks.find(task => task.id === id);
            if (!task) return;

            
            document.getElementById('title').value = task.title;
            document.getElementById('desc').value = task.desc;
            document.getElementById('dateinput').value = task.date;

           
            tasks = tasks.filter(task => task.id !== id);
        };

      
        window.deleteTask = function (id) {
            tasks = tasks.filter(task => task.id !== id);

            deleteTaskFromServer(id);

            displayTasks('all');
        };

        
        function deleteTaskFromServer(id) {
            
            const xhttp = new XMLHttpRequest();
            xhttp.onreadystatechange = function () {
                if (this.readyState == 4 && this.status == 200) {
                    console.log('Task deleted:', id);
                }
            };
            xhttp.open('DELETE', `/delete-task/${id}`, true);
            xhttp.send();
        }

     
        window.toggleTaskStatus = function (id) {
            const task = tasks.find(task => task.id === id);
            if (task) {
                task.status = task.status === 'pending' ? 'completed' : 'pending';
                displayTasks('all');
            }
        };
    });
