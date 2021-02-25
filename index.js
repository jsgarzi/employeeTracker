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
                "Add roles",
                "View employees",
                "Add employees",
                "Update employees"
            ]
        })
        .then(function (answer) {
            var arr = answer.action.split(" ")
            switch (arr[0]) {
                case "View":
                    if (arr[1] = "department") {
                        depSearch();
                    }
                    else if (arr[1] = "roles") {
                        roleSearch();
                    }
                    else {
                        empSearch();
                    }
                    break;
                case "Add":
                    if (arr[1] = "department") {
                        depAdd();
                    }
                    else if (arr[1] = "roles") {
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

function depSearch(){
    connection.query("SELECT * FROM department",function(err, res) {
        console.log(tableView.getTable(res))
    }
)};

function roleSearch(){
    connection.query("SELECT A.title, A.salary, B.name FROM roles AS A INNER JOIN department AS B ON B.id = A.department_id",function(err, res) {
        console.log(tableView.getTable(res))
    }
)};

function empSearch(){
    connection.query("SELECT A.first_name, A.last_name, B.title, B.salary, C.name FROM employees AS A INNER JOIN roles AS B ON B.id = A.role_id INNER JOIN department AS C ON C.id = B.department_id",function(err, res) {
        console.log(tableView.getTable(res))
    }
)};
