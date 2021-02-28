var mysql = require("mysql");
var inquirer = require("inquirer");
var tableView = require("console.table")

var connection = mysql.createConnection({
    host: "localhost",

    // Your port; if not 3306
    port: 3306,

    // Your username
    user: "root",

    // Your password
    password: "password",
    database: "employee_trackDB"
});

connection.connect(function (err) {
    if (err) throw err;
    run();
});

function run() {
    inquirer
        .prompt({
            name: "action",
            type: "list",
            message: "What would you like to do?",
            choices: [
                "View departments",
                "Add department",
                "View roles",
                "Add role",
                "View employees",
                "Add employee",
                "Update employee"
            ]
        })
        .then(function (answer) {
            var arr = answer.action.split(" ")
            switch (arr[0]) {
                case "View":
                    if (arr[1] == "departments") {
                        depSearch();
                    }
                    else if (arr[1] == "roles") {
                        roleSearch();
                    }
                    else {
                        empSearch();
                    }
                    break;
                case "Add":
                    if (arr[1] == "department") {
                        depAdd();
                    }
                    else if (arr[1] == "role") {
                        roleAdd();
                    }
                    else {
                        empAdd();
                    }
                    break;
                case "Update":
                    empUpdate();
                    break;
            }
        });
}

function depSearch() {
    connection.query("SELECT * FROM department", function (err, res) {
        console.log(tableView.getTable(res))
        run();
    }
    )
};

function roleSearch() {
    connection.query("SELECT A.title, A.salary, B.name FROM roles AS A INNER JOIN department AS B ON B.id = A.department_id", function (err, res) {
        console.log(tableView.getTable(res))
        run();
    }
    )
};

function empSearch() {
    connection.query("SELECT A.first_name, A.last_name, B.title, B.salary, C.name FROM employees AS A INNER JOIN roles AS B ON B.id = A.role_id INNER JOIN department AS C ON C.id = B.department_id", function (err, res) {
        console.log(tableView.getTable(res))
        run();
    }
    )
};

function depAdd() {
    inquirer
        .prompt({
            name: "name",
            type: "input",
            message: "What is the department name?"
        }).then(function (answer) {
            connection.query("INSERT INTO department SET ?",
                {
                    name: answer.name
                }, function (err, res) {
                    console.log(tableView.getTable(res))
                    depSearch();
                })

        }
        )
};

function roleAdd() {
    connection.query("SELECT * FROM department", function (err, res) {
        var deparments = [];
        for (let i = 0; i < res.length; i++) {
            deparments.push(res[i].name)
        }
        inquirer
            .prompt([{
                name: "title",
                type: "input",
                message: "What is the role title?"
            }, {
                name: "salary",
                type: "input",
                message: "What is the role's salary?"
            }, {
                name: "departments",
                type: "list",
                message: "Please select department this role falls under?",
                choices: deparments
            }
            ]).then(function (answer) {
                var depID;
                for (let i = 0; i < res.length; i++) {
                    if (res[i].name == answer.departments) {
                        depID = res[i].id
                    }
                    console.log(depID);
                }
                connection.query("INSERT INTO roles SET ?",
                    {
                        title: answer.title,
                        salary: answer.salary,
                        department_id: depID

                    }, function (err, res) {
                        console.log(tableView.getTable(res))
                        roleSearch();
                    })
            }
            )

    })
};

function empAdd() {
    connection.query("SELECT * FROM roles", function (err, res) {
        var roles = [];
        for (let i = 0; i < res.length; i++) {
            roles.push(res[i].title)
        }
        console.log(roles)
        inquirer
            .prompt([{
                name: "firstname",
                type: "input",
                message: "What is employee's first name?"
            }, {
                name: "lastname",
                type: "input",
                message: "What is employee's last name?"
            }, {
                name: "roles",
                type: "list",
                message: "Please select department this employee works in?",
                choices: roles
            }
            ]).then(function (answer) {
                var roleID;
                for (let i = 0; i < res.length; i++) {
                    if (res[i].title == answer.roles) {
                        roleID = res[i].id
                    }
                }
                connection.query("INSERT INTO employees SET ?",
                    {
                        first_name: answer.firstname,
                        last_name: answer.lastname,
                        role_id: roleID

                    }, function (err, res) {
                        console.log(tableView.getTable(res))
                        empSearch();
                    })
            }
            )
    })
};