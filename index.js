import express from 'express';
import bodyParser from 'body-parser';
import { dirname } from "path";
import { fileURLToPath } from "url";
import methodOverride from 'method-override';

const __dirname = dirname(fileURLToPath(import.meta.url));

const app = express();
const port = 3000;
var blogs = [];
var response = [];
const year = new Date();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(methodOverride('_method'));

app.use(express.static("public"));

app.get("/", (req, res) => {
    res.render("index.ejs", {
        blogs: blogs,
        year,
    });
});

app.post("/submit", (req, res) => {
    const blogObj = {
        "name": req.body["name"],
        "title": req.body["title"],
        "desc": req.body["blog"],
        "createdAt": new Date().toLocaleString(),
    };
    blogs.push(blogObj);
    console.log(blogs);
    
    // Encode the title when redirecting
    const encodedTitle = encodeURIComponent(blogObj.title);
    res.redirect(`/blogs/${encodedTitle}`);
});

app.get("/blogs/:blogID", (req, res) => {
    // Decoding the URL parameter to get the correct blog title
    const postTitle = decodeURIComponent(req.params.blogID).toLowerCase();
    const blog = blogs.find(blog => blog.title.toLowerCase() === postTitle);

    if (blog) {
        res.render('blog.ejs', {
            blogTitle: blog.title,
            blogContent: blog.desc,
            year,
            createdAt: blog.createdAt,
            auth: blog.name,
        });
    }
});

app.patch('/blogs/update/:blogID', (req, res) => {
    // Decoding the URL parameter to get the correct blog title
    const blogID = decodeURIComponent(req.params.blogID);
    const { newTitle, newDesc } = req.body;

    let blog = blogs.find(blog => blogID === blog.title);

    if (blog) {
        blog.title = newTitle || blog.title;
        blog.desc = newDesc || blog.desc;
        
        // Encoding the updated title for URL
        const encodedTitle = encodeURIComponent(blog.title);
        res.redirect(`/blogs/${encodedTitle}`);
        console.log(blogs);
    }
});

app.get("/blogs/edit/:blogID", (req, res) => {
    // Decoding the URL parameter to get the correct blog title
    const blogTitle = decodeURIComponent(req.params.blogID);
    const blog = blogs.find(blog => blogTitle === blog.title);

    if (blog) {
        res.render("edit.ejs", {
            blogTitle,
            blogContent: blog.desc,
            year,
        });
    }
});

app.post("/blogs/delete/:blogID", (req, res) => {
    // Decoding the URL parameter to get the correct blog title
    let blogTitle = decodeURIComponent(req.params.blogID);
    blogs = blogs.filter(blog => blog.title !== blogTitle);

    res.redirect('/');
    res.status(204).send();
});

app.get("/about.ejs", (req, res) => {
    res.render("about.ejs", {
        year,
    });
});

app.get("/create.ejs", (req, res) => {
    res.render("create.ejs", {
        year,
    });
});

app.get("/contact.ejs", (req, res) => {
    res.render("contact.ejs", {
        response,
        year,
    });
    response.length = 0;
});

app.post("/contact/submit", (req, res) => {
    const responseObj = {
        "name": req.body.name,
        "email": req.body.email,
        "message": req.body.message,
    };
    response.push(responseObj);
    console.log(response);
    res.status(202).send;
    res.redirect("/contact.ejs");
});

app.listen(port, () => {
    console.log(`Server is live on ${port}`);
});
