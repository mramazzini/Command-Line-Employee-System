const inquirer = require('inquirer');
const express = require('express');
const mysql = require('mysql2');
const cTable = require('console.table');

const app = express();
const PORT = process.env.PORT || 3001;


app.use(express.json());
app.use(express.urlencoded({ extended: true }));


const db = mysql.createConnection(
  {
    host: 'localhost',
   
    user: 'root',
    
    password: '',
    database: 'management_db'
  },
  console.log(`Connected to the management_db database.`)
);

const menuOptions= ['View All Employees', 'Add Employee', 'Update Employee Role', 'View All Roles', 'Add Role', 'View All Departments', 'Add Department', 'Quit'];

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  openMenu();
});

//Main menu
function openMenu(){
    inquirer.prompt([
        {
          type: 'list',
          message: 'Choose an Option',
          name: 'option',
          choices: menuOptions,
        }
    ])
        .then((res) => {
            let opt = res.option;
            const functions = {
              0:viewEmployees, 1:addEmployee, 2:updateEmployeeRole, 3: viewAllRoles, 4:addRole, 5:viewAllDepartments, 6:addDepartment
            }
            for(let i = 0; i<menuOptions.length; i++){
              if(opt == menuOptions[i]){
                
                functions[i]();
                return;
              }
            }
          });
}

//Shows all databases joined together
function viewEmployees(){
  db.query('SELECT employee.id, employee.first_name, employee.last_name, role.title, role.salary, department.name AS department FROM employee JOIN role ON employee.role_id = role.id JOIN department ON role.department_id = department.id', function (err, results) {
    console.log('\n')
    console.table(results);
  });
  openMenu();
}

function addEmployee(){
    inquirer.prompt([
      {
        type: 'input',
        message: 'What is the employees First Name?\n',
        name: 'fname'
      },
      {
        type: 'input',
        message: 'What is the employees Last Name?\n',
        name: 'lname'
      },
      {
        type: 'input',
        message: 'What is the employees role?\n',
        name: 'role'
      }
  ])
  .then((res) => {
    let role = res.role;
    db.query('SELECT id, title FROM role', function (err, results) {
      for (let i=0; i<results.length; i++){
        if(results[i].title == role){
          let roleID = results[i].id;
          db.query('SELECT COUNT(id) FROM employee', function (err, results) {
            let newID = Object.values(results[0])[0]+1;
            db.query('INSERT INTO employee (id, role_id, first_name, last_name) VALUES ('+newID+', '+roleID+', "'+res.fname+'", "'+res.lname+'")', function (err, results) {
              console.log('\n');
              console.log('Successfully added new employee');
              viewEmployees();
            });
          });
          openMenu();
          return;
        }
      }
      
      console.log('Failed to add new employee - Role does not exist');
      openMenu();
    });
    
  });
  
}


function updateEmployeeRole(){
  inquirer.prompt([
    {
      type: 'input',
      message: 'What is the id of the Employee\n',
      name: 'id'
    },
    {
      type: 'input',
      message: 'What is the employees new Role?\n',
      name: 'role'
    }
  ])
  .then((res) => {
    let role = res.role;
    db.query('SELECT id, title FROM role', function (err, results) {
      for (let i=0; i<results.length; i++){
        if(results[i].title == role){
          let roleID = results[i].id;
          db.query('UPDATE employee SET role_id = "'+roleID+'" WHERE id = '+res.id, function (err, results) {
            console.log('\n');
            console.log('Successfully updated employee role');
            viewEmployees();
          });
          openMenu();
          return;
        }
      }
      
  })
})
}

function viewAllRoles(){
  db.query('SELECT * FROM role', function (err, results) {
    console.log('\n');
    console.table(results);
  });
  openMenu();
}

function addRole(){
  inquirer.prompt([
    {
      type: 'input',
      message: 'What is the name of the new role\n',
      name: 'id'
    },
    {
      type: 'input',
      message: 'What department is it under\n',
      name: 'role'
    }
  ])
  .then((res) => {
}

function viewAllDepartments(){
  db.query('SELECT * FROM department', function (err, results) {
    console.log('\n');
    console.table(results);
    
  });
  openMenu();
}

function addDepartment(){
  
}
