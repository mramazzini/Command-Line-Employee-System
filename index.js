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
              console.log('\nSuccessfully added new employee');
              viewEmployees();
            });
          });
          openMenu();
          return;
        }
      }
      
      console.log('\nFailed to add new employee - Role does not exist');
      openMenu();
    });
    
  });
  
}


function updateEmployeeRole(){
  inquirer.prompt([
    {
      type: 'input',
      message: 'What is the ID of the Employee\n',
      name: 'id'
    },
    {
      type: 'input',
      message: 'What is the employees new Role?\n',
      name: 'role'
    }
  ])
  .then((res) => {
    if(!isNumeric(res.id)){
      console.log('\nFailed to update employee - ID must be a number');
      openMenu();
      return;
  }
    let role = res.role;
    db.query('SELECT id, title FROM role', function (err, results) {
      for (let i=0; i<results.length; i++){
        if(results[i].title == role){
          let roleID = results[i].id;
          db.query('UPDATE employee SET role_id = "'+roleID+'" WHERE id = '+res.id, function (err, results) {
            console.log(err);
            console.log('\nSuccessfully updated employee role');
          });
          openMenu();
          return;
        }
      }
      console.log('\nFailed to update employee - employee with ID:'+res.id+' does not exist')
      
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

//Checks if string is numeric
function isNumeric(str) {
  if (typeof str != "string") return false 
  return !isNaN(str) && 
         !isNaN(parseFloat(str)) 
}

function addRole(){
  inquirer.prompt([
    {
      type: 'input',
      message: 'What is the name of the new role\n',
      name: 'role'
    },
    {
      type: 'input',
      message: 'What is the salary of the role\n',
      name: 'salary'
    },
    {
      type: 'input',
      message: 'What department is it under\n',
      name: 'department'
    }
  ])
  .then((res) => {
    db.query('SELECT id, name FROM department', function (err, results) {
      if(!isNumeric(res.salary)){
          console.log('\nFailed to add Role - Salary must be a number');
          openMenu();
          return;
      }
      for (let i=0; i<results.length; i++){

        if(results[i].name == res.department){
          let departmentID = results[i].id;
          db.query('SELECT COUNT(id) FROM role', function (err, results) {
            let newID = Object.values(results[0])[0]+1;
            db.query('INSERT INTO role (id, department_id, title, salary) VALUES ('+newID+', '+departmentID+', "'+res.role+'", '+res.salary+')', function (err, results) {
              console.log('\nSuccessfully added role');
            });
          });
          openMenu();
          return;
        }
      }

      console.log('Failed to add role - Department does not exist');
      openMenu();
  });
})
}

function viewAllDepartments(){
  db.query('SELECT * FROM department', function (err, results) {
    console.log('\n');
    console.table(results);
    
  });
  openMenu();
}

function addDepartment(){
  inquirer.prompt([
    {
      type: 'input',
      message: 'What is the name of the new Department\n',
      name: 'name'
    }
  ])
  .then((res) => {
    let name = res.name;
    db.query('SELECT COUNT(id) FROM department', function (err, results) {
      let newID = Object.values(results[0])[0]+1;
      db.query('INSERT INTO department (id, name) VALUES ('+newID+', "'+name+'")', function (err, results) {
        console.log(err);
        console.log('\nSuccessfully added department');
      });
    });
    
    openMenu();

  })
}

