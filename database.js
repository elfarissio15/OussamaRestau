const http = require('http');
const { createPool } = require('mysql');
const url = require('url');
const PDFDocument = require('pdfkit');
const fs = require('fs');

const pool = createPool({
    host: "sql11.freesqldatabase.com",
    port: 3306, 
    user: "sql11706243",
    password: "L4zyDmH3vs",
    database: "sql11706243"
});

const server = http.createServer((req, res) => {
    res.setHeader('Access-Control-Allow-Origin', 'https://oussama-restau.vercel.app');
    res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    // Handle preflight requests
    if (req.method === 'OPTIONS') {
        res.writeHead(200);
        res.end();
        return;
    }
    
    // Check the URL and method of the request
    if (req.method === 'GET') {
        if (req.url === '/products') {
            // Fetch products data
            pool.query(`SELECT * FROM products`, (err, result, fields) => {
                if (err) {
                    res.writeHead(500, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ error: 'Internal Server Error' }));
                } else {
                    res.writeHead(200, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify(result));
                }
            });
        }else if (req.url === '/faqs') {
            // Fetch FAQ data
            pool.query(`SELECT * FROM faqs`, (err, result, fields) => {
                if (err) {
                    res.writeHead(500, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ error: 'Internal Server Error' }));
                } else {
                    res.writeHead(200, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify(result));
                }
            });
        }else if (req.url === '/members'){
            //fetch memeber data
            pool.query('SELECT * FROM members',(err, result, fields) => {
                if (err) {
                    res.writeHead(500, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ error: 'Internal Server Error' }));
                } else {
                    res.writeHead(200, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify(result));
                }
            });
        }else if (req.url === '/Commandes'){
            //fetch commandes data
            pool.query('SELECT * FROM commandes',(err, result, fields) => {
                if (err) {
                    res.writeHead(500, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ error: 'Internal Server Error' }));
                } else {
                    res.writeHead(200, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify(result));
                }
            });
        }else if (req.url === '/Comments'){
            //fetch commandes data
            pool.query('SELECT * FROM comments',(err, result, fields) => {
                if (err) {
                    res.writeHead(500, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ error: 'Internal Server Error' }));
                } else {
                    res.writeHead(200, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify(result));
                }
            });
        }else if (req.url === '/Reclamations'){
            //fetch commandes data
            pool.query('SELECT * FROM reclamations',(err, result, fields) => {
                if (err) {
                    res.writeHead(500, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ error: 'Internal Server Error' }));
                } else {
                    res.writeHead(200, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify(result));
                }
            });
        }else if (req.url === '/Messages'){
            //fetch Messages data
            pool.query('SELECT * FROM messages',(err, result, fields) => {
                if (err) {
                    res.writeHead(500, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ error: 'Internal Server Error' }));
                } else {
                    res.writeHead(200, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify(result));
                }
            });
        }else if (req.url === '/Promotions'){
            //fetch promotions data
            pool.query('SELECT * FROM promotions',(err, result, fields) => {
                if (err) {
                    res.writeHead(500, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ error: 'Internal Server Error' }));
                } else {
                    res.writeHead(200, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify(result));
                }
            });
        }else {
            // Handle invalid routes
            res.writeHead(404, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'Not Found' }));
        }
    } else if (req.method === 'POST') {
        if(req.url === '/members'){
            let body = '';
            req.on('data', chunk => {
                body += chunk.toString();
            });
            req.on('end', () => {
                try {
                    const userData = JSON.parse(body);
    
                    // Insert user data into the database
                    pool.query('INSERT INTO members SET ?', userData, (err, result) => {
                        if (err) {
                            res.writeHead(500, { 'Content-Type': 'application/json' });
                            res.end(JSON.stringify({ error: 'Internal Server Error' }));
                        } else {
                            res.writeHead(201, { 'Content-Type': 'application/json' });
                            res.end(JSON.stringify({ message: 'User signed up successfully!' }));
                        }
                    });
                } catch (error) {
                    res.writeHead(400, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ error: 'Invalid JSON' }));
                }
            });
        }else if (req.url === '/checkEmail'){
            let body = '';
            req.on('data', chunk => {
                body += chunk.toString();
            });
            req.on('end', () => {
                try {
                    const { email } = JSON.parse(body);

                    // Query your database to check if the email exists
                    pool.query('SELECT COUNT(*) AS count FROM members WHERE email = ?', [email], (err, results) => {
                        if (err) {
                            res.writeHead(500, { 'Content-Type': 'application/json' });
                            res.end(JSON.stringify({ error: 'Internal Server Error' }));
                        } else {
                            const emailExists = results[0].count > 0;
                            res.writeHead(200, { 'Content-Type': 'application/json' });
                            res.end(JSON.stringify({ exists: emailExists }));
                        }
                    });
                } catch (error) {
                    res.writeHead(400, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ error: 'Invalid JSON' }));
                }
            });
        }else if (req.url === '/login'){
            let body = '';
            req.on('data', chunk => {
                body += chunk.toString();
            });
            req.on('end', () => {
                try {
                    const { email, password } = JSON.parse(body);

                    // Query your database to check if the email and password match
                    pool.query('SELECT * FROM members WHERE email = ? AND passwrd = ?', [email, password], (err, results) => {
                        if (err) {
                            res.writeHead(500, { 'Content-Type': 'application/json' });
                            res.end(JSON.stringify({ error: 'Internal Server Error' }));
                        } else {
                            if (results.length === 1) {
                                // Login successful, send user information
                                const user = results[0];
                                res.writeHead(200, { 'Content-Type': 'application/json' });
                                res.end(JSON.stringify({ message: 'Login successful', user }));
                            } else {
                                // No user found with the provided credentials
                                res.writeHead(401, { 'Content-Type': 'application/json' });
                                res.end(JSON.stringify({ error: 'Incorrect email or password' }));
                            }
                        }
                    });
                } catch (error) {
                    res.writeHead(400, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ error: 'Invalid JSON' }));
                }
            });
        }else if (req.url === '/getUserInfo'){
            let body = '';
            req.on('data', chunk => {
                body += chunk.toString();
            });
            req.on('end', () => {
                try {
                    const { email } = JSON.parse(body);

                    // Query your database to check if the email 
                    pool.query('SELECT * FROM members WHERE email = ?', [email], (err, results) => {
                        if (err) {
                            res.writeHead(500, { 'Content-Type': 'application/json' });
                            res.end(JSON.stringify({ error: 'Internal Server Error' }));
                        } else {
                            if (results.length === 1) {
                                // Email successful, send user information
                                const user = results[0];
                                res.writeHead(200, { 'Content-Type': 'application/json' });
                                res.end(JSON.stringify({ message: 'Email Found successful', user }));
                            } else {
                                // No user found with the provided Email
                                res.writeHead(401, { 'Content-Type': 'application/json' });
                                res.end(JSON.stringify({ error: 'Email Not fuond' }));
                            }
                        }
                    });
                } catch (error) {
                    res.writeHead(400, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ error: 'Invalid JSON' }));
                }
            });
        }else if (req.url === '/Reclamations'){
            let body = '';
            req.on('data', chunk => {
                body += chunk.toString();
            });
            req.on('end', () => {
                try {
                    const ReclamationData = JSON.parse(body);
    
                    // Insert user data into the database
                    pool.query('INSERT INTO reclamations SET ?', ReclamationData, (err, result) => {
                        if (err) {
                            res.writeHead(500, { 'Content-Type': 'application/json' });
                            res.end(JSON.stringify({ error: 'Internal Server Error' }));
                        } else {
                            res.writeHead(201, { 'Content-Type': 'application/json' });
                            res.end(JSON.stringify({ message: 'User signed up successfully!' }));
                        }
                    });
                } catch (error) {
                    res.writeHead(400, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ error: 'Invalid JSON' }));
                }
            });
        }else if (req.url === '/Promotions'){
            let body = '';
            req.on('data', chunk => {
                body += chunk.toString();
            });
            req.on('end', () => {
                try {
                    const promotionsData = JSON.parse(body);
    
                    // Insert promotions data into the database
                    pool.query('INSERT INTO promotions SET ?', promotionsData, (err, result) => {
                        if (err) {
                            res.writeHead(500, { 'Content-Type': 'application/json' });
                            res.end(JSON.stringify({ error: 'Internal Server Error' }));
                        } else {
                            res.writeHead(201, { 'Content-Type': 'application/json' });
                            res.end(JSON.stringify({ message: 'promotions added successfully!' }));
                        }
                    });
                } catch (error) {
                    res.writeHead(400, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ error: 'Invalid JSON' }));
                }
            });
        }else if (req.url === '/updateMember') {
            // Update member data
            let body = '';
            req.on('data', chunk => {
                body += chunk.toString();
            });
            req.on('end', () => {
                try {
                    const userData = JSON.parse(body);
                    const memberid = userData.memberid;
    
                    // Update user data in the database based on email
                    pool.query('UPDATE members SET ? WHERE memberid = ?', [userData, memberid], (err, result) => {
                        if (err) {
                            res.writeHead(500, { 'Content-Type': 'application/json' });
                            res.end(JSON.stringify({ error: 'Internal Server Error' }));
                        } else {
                            res.writeHead(200, { 'Content-Type': 'application/json' });
                            res.end(JSON.stringify({ message: 'User data updated successfully!' }));
                        }
                    });
                } catch (error) {
                    res.writeHead(400, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ error: 'Invalid JSON' }));
                }
            });
        }else if (req.url === '/removeMember') {
            // Remove Member entry
            let body = '';
            req.on('data', chunk => {
                body += chunk.toString();
            });
            req.on('end', () => {
                try {
                    const userData = JSON.parse(body);
                    const memberid = userData.memberid;
                    const user_id = userData.memberid;
                    const userID = userData.memberid;
                    const Email = userData.email;
                    pool.query('DELETE FROM messages WHERE memberid = ?', [memberid], (err, result) => {
                        if (err) {
                            res.writeHead(500, { 'Content-Type': 'application/json' });
                            res.end(JSON.stringify({ error: 'Internal Server Error' }));
                        } else {
                            // Remove entries from various tables based on memberid and email
                            pool.query('DELETE FROM commandes WHERE user_id = ?', [user_id], (err, result) => {
                                if (err) {
                                    res.writeHead(500, { 'Content-Type': 'application/json' });
                                    res.end(JSON.stringify({ error: 'Internal Server Error' }));
                                } else {
                                    // Continue deleting entries from other tables
                                    pool.query('DELETE FROM comments WHERE Email = ?', [Email], (err, result) => {
                                        if (err) {
                                            res.writeHead(500, { 'Content-Type': 'application/json' });
                                            res.end(JSON.stringify({ error: 'Internal Server Error' }));
                                        } else {
                                            pool.query('DELETE FROM reclamations WHERE userID = ?', [userID], (err, result) => {
                                                if (err) {
                                                    res.writeHead(500, { 'Content-Type': 'application/json' });
                                                    res.end(JSON.stringify({ error: 'Internal Server Error' }));
                                                } else {
                                                    pool.query('DELETE FROM members WHERE memberid = ?', [memberid], (err, result) => {
                                                        if (err) {
                                                            res.writeHead(500, { 'Content-Type': 'application/json' });
                                                            res.end(JSON.stringify({ error: 'Internal Server Error' }));
                                                        } else {
                                                            res.writeHead(200, { 'Content-Type': 'application/json' });
                                                            res.end(JSON.stringify({ message: 'User entry removed successfully!' }));
                                                        }
                                                    });
                                                }
                                            });
                                        }
                                    });
                                }
                            });
                        }
                    });
                } catch (error) {
                    res.writeHead(400, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ error: 'Invalid JSON' }));
                }
            });
        }else if (req.url === '/insertfaqs'){
            let body = '';
            req.on('data', chunk => {
                body += chunk.toString();
            });
            req.on('end', () => {
                try {
                    const faqData = JSON.parse(body);
    
                    // Insert faq data into the database
                    pool.query('INSERT INTO faqs SET ?', faqData, (err, result) => {
                        if (err) {
                            res.writeHead(500, { 'Content-Type': 'application/json' });
                            res.end(JSON.stringify({ error: 'Internal Server Error' }));
                        } else {
                            res.writeHead(201, { 'Content-Type': 'application/json' });
                            res.end(JSON.stringify({ message: 'faq inserted successfully!' }));
                        }
                    });
                } catch (error) {
                    res.writeHead(400, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ error: 'Invalid JSON' }));
                }
            });
        }else if (req.url === '/updateFaq') {
            // Update member data
            let body = '';
            req.on('data', chunk => {
                body += chunk.toString();
            });
            req.on('end', () => {
                try {
                    const FaqData = JSON.parse(body);
                    const FAQID = FaqData.FAQID;
    
                    // Update user data in the database based on email
                    pool.query('UPDATE faqs SET ? WHERE FAQID = ?', [FaqData, FAQID], (err, result) => {
                        if (err) {
                            res.writeHead(500, { 'Content-Type': 'application/json' });
                            res.end(JSON.stringify({ error: 'Internal Server Error' }));
                        } else {
                            res.writeHead(200, { 'Content-Type': 'application/json' });
                            res.end(JSON.stringify({ message: 'FAQ data updated successfully!' }));
                        }
                    });
                } catch (error) {
                    res.writeHead(400, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ error: 'Invalid JSON' }));
                }
            });
        }else if (req.url === '/removeFaq') {
            // Remove FAQ entry
            let body = '';
            req.on('data', chunk => {
                body += chunk.toString();
            });
            req.on('end', () => {
                try {
                    const faqData = JSON.parse(body);
                    const FAQID = faqData.FAQID;
        
                    // Remove FAQ entry from the database based on FAQID
                    pool.query('DELETE FROM faqs WHERE FAQID = ?', [FAQID], (err, result) => {
                        if (err) {
                            res.writeHead(500, { 'Content-Type': 'application/json' });
                            res.end(JSON.stringify({ error: 'Internal Server Error' }));
                        } else {
                            res.writeHead(200, { 'Content-Type': 'application/json' });
                            res.end(JSON.stringify({ message: 'FAQ entry removed successfully!' }));
                        }
                    });
                } catch (error) {
                    res.writeHead(400, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ error: 'Invalid JSON' }));
                }
            });
        }else if (req.url === '/insertproducts'){
            let body = '';
            req.on('data', chunk => {
                body += chunk.toString();
            });
            req.on('end', () => {
                try {
                    const productData = JSON.parse(body);
    
                    // Insert product data into the database
                    pool.query('INSERT INTO products SET ?', productData, (err, result) => {
                        if (err) {
                            res.writeHead(500, { 'Content-Type': 'application/json' });
                            res.end(JSON.stringify({ error: 'Internal Server Error' }));
                        } else {
                            res.writeHead(201, { 'Content-Type': 'application/json' });
                            res.end(JSON.stringify({ message: 'product added successfully!' }));
                        }
                    });
                } catch (error) {
                    res.writeHead(400, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ error: 'Invalid JSON' }));
                }
            });
        }else if (req.url === '/updateProduct') {
            // Update Products data
            let body = '';
            req.on('data', chunk => {
                body += chunk.toString();
            });
            req.on('end', () => {
                try {
                    const ProductData = JSON.parse(body);
                    const ProductID = ProductData.ProductID;
    
                    // Update product data in the database based on productID
                    pool.query('UPDATE products SET ? WHERE productID = ?', [ProductData, ProductID], (err, result) => {
                        if (err) {
                            res.writeHead(500, { 'Content-Type': 'application/json' });
                            res.end(JSON.stringify({ error: 'Internal Server Error' }));
                        } else {
                            res.writeHead(200, { 'Content-Type': 'application/json' });
                            res.end(JSON.stringify({ message: 'Product data updated successfully!' }));
                        }
                    });
                } catch (error) {
                    res.writeHead(400, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ error: 'Invalid JSON' }));
                }
            });
        }else if (req.url === '/removeProduct') {
            // Remove Product entry
            let body = '';
            req.on('data', chunk => {
                body += chunk.toString();
            });
            req.on('end', () => {
                try {
                    const ProductData = JSON.parse(body);
                    const ProductID = ProductData.ProductID;
        
                    // Remove product entry from the database based on ProductID
                    pool.query('DELETE FROM products WHERE ProductID = ?', [ProductID], (err, result) => {
                        if (err) {
                            res.writeHead(500, { 'Content-Type': 'application/json' });
                            res.end(JSON.stringify({ error: 'Internal Server Error' }));
                        } else {
                            res.writeHead(200, { 'Content-Type': 'application/json' });
                            res.end(JSON.stringify({ message: 'product entry removed successfully!' }));
                        }
                    });
                } catch (error) {
                    res.writeHead(400, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ error: 'Invalid JSON' }));
                }
            });
        }else if (req.url === '/PublicComments') {
            let body = '';
            req.on('data', chunk => {
                body += chunk.toString();
            });
            req.on('end', () => {
                try {
                    const CommentInfo = JSON.parse(body);
    
                    // Insert user data into the database
                    pool.query('INSERT INTO comments SET ?', CommentInfo, (err, result) => {
                        if (err) {
                            res.writeHead(500, { 'Content-Type': 'application/json' });
                            res.end(JSON.stringify({ error: 'Internal Server Error' }));
                        } else {
                            res.writeHead(201, { 'Content-Type': 'application/json' });
                            res.end(JSON.stringify({ message: 'User signed up successfully!' }));
                        }
                    });
                } catch (error) {
                    res.writeHead(400, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ error: 'Invalid JSON' }));
                }
            });
        }else if (req.url === '/Commandes') {
            let body = '';
            req.on('data', chunk => {
                body += chunk.toString();
            });
            req.on('end', () => {
                try {
                    const CommandeInfo = JSON.parse(body);
    
                    // Insert user data into the database
                    pool.query('INSERT INTO commandes SET ?', CommandeInfo, (err, result) => {
                        if (err) {
                            res.writeHead(500, { 'Content-Type': 'application/json' });
                            res.end(JSON.stringify({ error: 'Internal Server Error' }));
                        } else {
                            res.writeHead(201, { 'Content-Type': 'application/json' });
                            res.end(JSON.stringify({ message: 'User signed up successfully!' }));
                        }
                    });
                } catch (error) {
                    res.writeHead(400, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ error: 'Invalid JSON' }));
                }
            });
        }else if (req.url === '/updateCommandes') {
            // Update Commandes data
            let body = '';
            req.on('data', chunk => {
                body += chunk.toString();
            });
            req.on('end', () => {
                try {
                    const Commandeata = JSON.parse(body);
                    const id = Commandeata.id;
    
                    // Update user data in the database based on email
                    pool.query('UPDATE commandes SET ? WHERE id = ?', [Commandeata, id], (err, result) => {
                        if (err) {
                            res.writeHead(500, { 'Content-Type': 'application/json' });
                            res.end(JSON.stringify({ error: 'Internal Server Error' }));
                        } else {
                            res.writeHead(200, { 'Content-Type': 'application/json' });
                            res.end(JSON.stringify({ message: 'Commandes data updated successfully!' }));
                        }
                    });
                } catch (error) {
                    res.writeHead(400, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ error: 'Invalid JSON' }));
                }
            });
        }else if (req.url === '/updateReclamation') {
            // Update Reclamations data
            let body = '';
            req.on('data', chunk => {
                body += chunk.toString();
            });
            req.on('end', () => {
                try {
                    const ReclaData = JSON.parse(body);
                    const reclamationID = ReclaData.reclamationID;
    
                    // Update user data in the database based on email
                    pool.query('UPDATE reclamations SET ? WHERE reclamationID = ?', [ReclaData, reclamationID], (err, result) => {
                        if (err) {
                            res.writeHead(500, { 'Content-Type': 'application/json' });
                            res.end(JSON.stringify({ error: 'Internal Server Error' }));
                        } else {
                            res.writeHead(200, { 'Content-Type': 'application/json' });
                            res.end(JSON.stringify({ message: 'Reclamation data updated successfully!' }));
                        }
                    });
                } catch (error) {
                    res.writeHead(400, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ error: 'Invalid JSON' }));
                }
            });
        }else if (req.url === '/removeReclamation') {
            // Remove Reclamation entry
            let body = '';
            req.on('data', chunk => {
                body += chunk.toString();
            });
            req.on('end', () => {
                try {
                    const ReclamationData = JSON.parse(body);
                    const reclamationID = ReclamationData.reclamationID;
        
                    // Remove reclamation entry from the database based on reclamationID
                    pool.query('DELETE FROM reclamations WHERE reclamationID = ?', [reclamationID], (err, result) => {
                        if (err) {
                            res.writeHead(500, { 'Content-Type': 'application/json' });
                            res.end(JSON.stringify({ error: 'Internal Server Error' }));
                        } else {
                            res.writeHead(200, { 'Content-Type': 'application/json' });
                            res.end(JSON.stringify({ message: 'reclamation entry removed successfully!' }));
                        }
                    });
                } catch (error) {
                    res.writeHead(400, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ error: 'Invalid JSON' }));
                }
            });
        }else if (req.url === '/removeComment') {
            // Remove Product entry
            let body = '';
            req.on('data', chunk => {
                body += chunk.toString();
            });
            req.on('end', () => {
                try {
                    const CommentData = JSON.parse(body);
                    const CommentID = CommentData.CommentID;
        
                    // Remove comments entry from the database based on CommentID
                    pool.query('DELETE FROM comments WHERE CommentID = ?', [CommentID], (err, result) => {
                        if (err) {
                            res.writeHead(500, { 'Content-Type': 'application/json' });
                            res.end(JSON.stringify({ error: 'Internal Server Error' }));
                        } else {
                            res.writeHead(200, { 'Content-Type': 'application/json' });
                            res.end(JSON.stringify({ message: 'comment entry removed successfully!' }));
                        }
                    });
                } catch (error) {
                    res.writeHead(400, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ error: 'Invalid JSON' }));
                }
            });
        }else if (req.url === '/removeCommande') {
            // Remove Commande entry
            let body = '';
            req.on('data', chunk => {
                body += chunk.toString();
            });
            req.on('end', () => {
                try {
                    const CommandeData = JSON.parse(body);
                    const id = CommandeData.id;
        
                    // Remove reclamations entry from the database based on commandID
                    pool.query('DELETE FROM reclamations WHERE commandID = ?', [id], (err, reclamationsResult) => {
                        if (err) {
                            res.writeHead(500, { 'Content-Type': 'application/json' });
                            res.end(JSON.stringify({ error: 'Internal Server Error' }));
                        } else {
                            // Remove commandes entry from the database based on id
                            pool.query('DELETE FROM commandes WHERE id = ?', [id], (err, commandesResult) => {
                                if (err) {
                                    res.writeHead(500, { 'Content-Type': 'application/json' });
                                    res.end(JSON.stringify({ error: 'Internal Server Error' }));
                                } else {
                                    res.writeHead(200, { 'Content-Type': 'application/json' });
                                    res.end(JSON.stringify({ message: 'Commande entry removed successfully!' }));
                                }
                            });
                        }
                    });
                } catch (error) {
                    res.writeHead(400, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ error: 'Invalid JSON' }));
                }
            });
        }else if (req.url === '/updateCommentes') {
            // Update Comments data
            let body = '';
            req.on('data', chunk => {
                body += chunk.toString();
            });
            req.on('end', () => {
                try {
                    const Commentdata = JSON.parse(body);
                    const CommentID = Commentdata.CommentID;
    
                    // Update user data in the database based on email
                    pool.query('UPDATE comments SET ? WHERE CommentID = ?', [Commentdata, CommentID], (err, result) => {
                        if (err) {
                            res.writeHead(500, { 'Content-Type': 'application/json' });
                            res.end(JSON.stringify({ error: 'Internal Server Error' }));
                        } else {
                            res.writeHead(200, { 'Content-Type': 'application/json' });
                            res.end(JSON.stringify({ message: 'Comment data updated successfully!' }));
                        }
                    });
                } catch (error) {
                    res.writeHead(400, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ error: 'Invalid JSON' }));
                }
            });
        }else if (req.url === '/generate-pdf') {
            let body = '';
            req.on('data', chunk => {
                body += chunk.toString();
            });
            req.on('end', () => {
                try {
                    const commandInfo = JSON.parse(body);
        
                    // Generate PDF with command information
                    const doc = new PDFDocument();
        
                    // Buffer to hold the PDF data
                    const pdfBuffer = [];
                    
                    // Pipe PDF content to the buffer
                    doc.on('data', data => {
                        pdfBuffer.push(data);
                    });
        
                    // When PDF generation is complete
                    doc.on('end', () => {
                        // Concatenate PDF buffer into a single buffer
                        const pdfData = Buffer.concat(pdfBuffer);
        
                        // Respond with the PDF file
                        res.setHeader('Content-Type', 'application/pdf');
                        res.setHeader('Content-Disposition', 'attachment; filename="receipt.pdf"');
                        res.end(pdfData);
                    });
        
                    // Add content to the PDF dynamically
                    doc.fontSize(18).text('Receipt', { align: 'center' });
                    doc.fontSize(14).text('Thank you for your purchase!', { align: 'center' });
                    doc.fontSize(12).text('Transaction details:', { align: 'left' });

                    // Format command information
                    const commandKeys = Object.keys(commandInfo);
                    commandKeys.forEach((key, index) => {
                        const value = commandInfo[key];
                        doc.fontSize(10).text(`${key}: ${value}`, { align: 'left' });
                        if (index < commandKeys.length - 1) {
                            doc.moveDown();
                        }
                    });

                    doc.moveDown();
                    doc.fontSize(12).text('This file is a prove if you encontred a problem In remembering password', { align: 'center' });
                    doc.fontSize(12).text('In case The commande Deosn\'t send The Life limite of this paper is 48 hours ', { align: 'center' });
                    doc.fontSize(12).text('So Please Be quik in contacting uss ', { align: 'center' });
                    // Add more content as needed
                    
                    // End PDF creation
                    doc.end();
                } catch (error) {
                    console.error('Error processing command data:', error);
                    res.writeHead(400, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ error: 'Invalid JSON' }));
                }
            });
        }else if (req.url === '/insertmessages'){
            let body = '';
            req.on('data', chunk => {
                body += chunk.toString();
            });
            req.on('end', () => {
                try {
                    const message = JSON.parse(body);
    
                    // Insert faq data into the database
                    pool.query('INSERT INTO messages SET ?', message, (err, result) => {
                        if (err) {
                            res.writeHead(500, { 'Content-Type': 'application/json' });
                            res.end(JSON.stringify({ error: 'Internal Server Error' }));
                        } else {
                            res.writeHead(201, { 'Content-Type': 'application/json' });
                            res.end(JSON.stringify({ message: 'message inserted successfully!' }));
                        }
                    });
                } catch (error) {
                    res.writeHead(400, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ error: 'Invalid JSON' }));
                }
            });
        }else if (req.url === '/updateMessages') {
            // Update messages data
            let body = '';
            req.on('data', chunk => {
                body += chunk.toString();
            });
            req.on('end', () => {
                try {
                    const message = JSON.parse(body);
                    const messageid = message.messageid;
    
                    // Update user data in the database based on email
                    pool.query('UPDATE messages SET ? WHERE messageid = ?', [message, messageid], (err, result) => {
                        if (err) {
                            res.writeHead(500, { 'Content-Type': 'application/json' });
                            res.end(JSON.stringify({ error: 'Internal Server Error' }));
                        } else {
                            res.writeHead(200, { 'Content-Type': 'application/json' });
                            res.end(JSON.stringify({ message: 'message data updated successfully!' }));
                        }
                    });
                } catch (error) {
                    res.writeHead(400, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ error: 'Invalid JSON' }));
                }
            });
        }else if (req.url === '/removeMessage') {
            // remove messages data
            let body = '';
            req.on('data', chunk => {
                body += chunk.toString();
            });
            req.on('end', () => {
                try {
                    const message = JSON.parse(body);
                    const messageid = message.messageid;
    
                    // Update user data in the database based on email
                    pool.query('DELETE FROM messages WHERE messageid = ?', [messageid], (err, result) => {
                        if (err) {
                            res.writeHead(500, { 'Content-Type': 'application/json' });
                            res.end(JSON.stringify({ error: 'Internal Server Error' }));
                        } else {
                            res.writeHead(200, { 'Content-Type': 'application/json' });
                            res.end(JSON.stringify({ message: 'message data removed successfully!' }));
                        }
                    });
                } catch (error) {
                    res.writeHead(400, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ error: 'Invalid JSON' }));
                }
            });
        }else if (req.url === '/updatePromotions') {
            // Update messages data
            let body = '';
            req.on('data', chunk => {
                body += chunk.toString();
            });
            req.on('end', () => {
                try {
                    const promotion = JSON.parse(body);
                    const promotionid = promotion.id;
    
                    // Update user data in the database based on email
                    pool.query('UPDATE promotions SET ? WHERE id = ?', [promotion,promotionid], (err, result) => {
                        if (err) {
                            res.writeHead(500, { 'Content-Type': 'application/json' });
                            res.end(JSON.stringify({ error: 'Internal Server Error' }));
                        } else {
                            res.writeHead(200, { 'Content-Type': 'application/json' });
                            res.end(JSON.stringify({ message: 'promotion data updated successfully!' }));
                        }
                    });
                } catch (error) {
                    res.writeHead(400, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ error: 'Invalid JSON' }));
                }
            });
        }else if (req.url === '/removePromotions') {
            // remove promotion data
            let body = '';
            req.on('data', chunk => {
                body += chunk.toString();
            });
            req.on('end', () => {
                try {
                    const promotion = JSON.parse(body);
                    const id = promotion.id;
    
                    // Update promotion data in the database based on id
                    pool.query('DELETE FROM promotions WHERE id = ?', [id], (err, result) => {
                        if (err) {
                            res.writeHead(500, { 'Content-Type': 'application/json' });
                            res.end(JSON.stringify({ error: 'Internal Server Error' }));
                        } else {
                            res.writeHead(200, { 'Content-Type': 'application/json' });
                            res.end(JSON.stringify({ message: 'promotion data removed successfully!' }));
                        }
                    });
                } catch (error) {
                    res.writeHead(400, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ error: 'Invalid JSON' }));
                }
            });
        }else {
            // Handle invalid routes
            res.writeHead(404, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'Not Found' }));
        }
    } else {
        // Handle invalid methods
        res.writeHead(405, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Method Not Allowed' }));
    }
});

const port = process.env.PORT || 3000;

server.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});