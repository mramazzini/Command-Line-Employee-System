INSERT INTO department (id, name)
VALUES (1, "Sales"),
       (2, "Engineering"),
       (3, "Finance"),
       (4, "Legal");
       
INSERT INTO role (id, department_id, title, salary )
VALUES (1, 1, "Sales Lead", 100000),
       (2, 1, "Sales Person", 80000),
       (3, 2, "Lead Engineer", 150000),
       (4, 2, "Software Engineer", 120000),
       (5, 3, "Account Manager", 160000),
       (6, 3, "Accountant", 125000),
       (7, 4, "Legal Team Lead", 250000),
       (8, 4, "Lawyer", 190000);
       
INSERT INTO employee (id, role_id, first_name, last_name)
VALUES (1, 1, "John", "Doe"),
       (2, 2, "Mike", "Chan"),
       (3, 3, "Ashley", "Rodriguez"),
       (4, 4, "Kevin", "Tupik"),
       (5, 5, "Kunal", "Singh"),
       (6, 6, "Malia", "Brown"),
       (7, 7, "Sarah", "Lourd"),
       (8, 8, "Tom", "Allen");

