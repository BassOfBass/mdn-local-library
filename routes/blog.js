import express from "express";

const router = express.Router();

router.get("/", (req, res) => {
  res.render("blog/index", {
    title: "The blog section of the site"
  });
});

router.get("/blogs", (req, res) => {
  res.render("blog/blogs", {});
});

router.get("/blogger/:id", (req, res) => {
  const author = req.params.id;
  res.render("blog/blogger", {
    title: `${author}'s page`,
    blogger: author
  });
});

router.get("/bloggers", (req, res) => {
  res.render("blog/bloggers", {
    title: "All blog authors",
    bloggers: []
  })
});

router.get("/:id", (req, res) => {
  const blog = req.params.id;
  res.render("blog/blog-post", {
    title: ``,
    post: blog
  });
});

router.get("/:id/create", (req, res) => {
  res.render("")
});

router.get("", (req, res) => {});

router.get("", (req, res) => {});

router.get("", (req, res) => {});

export default router;