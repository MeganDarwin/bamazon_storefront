//requiring npm packages

const mysql = require('mysql');

const inquirer = require('inquirer');

//creating a connection to mysql schema


var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "",
    database: "bamazon"
});

// connect to the mysql server and sql database
connection.connect(function(err) {
    if (err) throw err;
    displayProducts();
});



function displayProducts() {
    connection.query('SELECT * FROM products', function(err, inventory) {
        if (err) throw err;
        console.log("-----------------------------------------------------------------------------------------------");
        console.log("Bamazon's available inventory:");
        console.log("-----------------------------------------------------------------------------------------------");
        for (var i = 0; i < inventory.length; i++) {
            console.log("Item ID: " + inventory[i].item_id + " | Product: " + inventory[i].product_name + " | Department: " + inventory[i].department_name + " | Price: " + "$" + inventory[i].price + " | Quantity: " + inventory[i].stock);
        }

        console.log("-----------------------------------------------------------------------------------------------");
        console.log("-----------------------------------------------------------------------------------------------");

        inquirer.prompt([

            {
                type: "input",

                message: "What is the id of the product you would like to purchase?",

                name: "id"

            },

            {
                type: "input",

                message: "How many units of the product would you like to purchase?",

                name: "quantity"
            }





        ]).then(function(purchase) {

            let itemId = purchase.id;

            let quantity = purchase.quantity;

            connection.query('SELECT * FROM products WHERE item_id =' + itemId, function(err, selectedId) {
                if (err) throw err;
                if (selectedId[0].stock - quantity >= 0) {
                    console.log("thank you for your purchase of " + selectedId[0].product_name);
                    //console.log(selectedId[0].price);
                    let orderTotal = parseInt(quantity * selectedId[0].price);
                    let updatedStock = parseInt(selectedId[0].stock - quantity);
                    //console.log(updatedStock);
                    console.log("-----------------------------------------------------------------------------------------------");
                    console.log("Your order total is: " + " " + "$" + orderTotal);
                    console.log("Thank you for your purchase! Here is our updated inventory:");
                    console.log("-----------------------------------------------------------------------------------------------");
                    connection.query('UPDATE products SET stock=? WHERE item_id=?', [updatedStock, itemId], function(err) {
                        if (err) throw err;
                        displayProducts();
                    });

                } else {
                	console.log("-----------------------------------------------------------------------------------------------");
                    console.log("I'm sorry, we don't have enough inventory to complete your purchase. Please update your quantity or choose another item");
                    console.log("-----------------------------------------------------------------------------------------------");
                    displayProducts();

                }




            });


        })


        // connection.end(function(err) {
        //     if (err) throw err;
        //     console.log("Connection Released.");

        // });

    });
}
