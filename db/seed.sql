USE employee_trackDB;

INSERT INTO department (name) 
VALUES ("Sales"),("Operations"),("Development");

INSERT INTO roles (title,salary,department_id) 
VALUES ("Salesman", 40000 , 1),("Project Manager", 75000, 2),("Front-End Developer", 50000, 3);

INSERT INTO employees (first_name,last_name,role_id) 
VALUES ("John" , "Smith", 1),("Jane", "Doe", 2),("Jason", "Alexander", 3);