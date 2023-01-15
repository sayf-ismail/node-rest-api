const express = require('express');
const app = express();
const axios = require('axios');
const rootUrl = 'https://jsonplaceholder.typicode.com';

app.get('/top-posts', async (req, res) => {
  try {
    const [axiosComments, axiosPosts] = await axios.all([
      axios.get(rootUrl+'/comments'),
      axios.get(rootUrl+'/posts')
     ]);
    const comments = axiosComments.data;
    const posts = axiosPosts.data.map(post => {
      return {
        post_id: post.id,
        post_title: post.title,
        post_body: post.body,
        total_number_of_comments: comments.filter(c => c.postId === post.id).length
      }
    });
    posts.sort((a, b) => b.total_number_of_comments - a.total_number_of_comments);
    res.json(posts);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Unable to fetch the requested data.' });
  }
});

app.get('/comments', async(req, res) => {
  try {
    const axiosComments = await axios.get(rootUrl + '/comments');
    const comments = axiosComments.data;
    const filteredComments = comments.filter(comment => {
      return Object.keys(req.query).every(key => {
        if(key === 'postId' || key === 'id'){
          return parseInt(req.query[key]) === comment[key]
        }
        return req.query[key] === comment[key];
      });
    });
    res.json(filteredComments);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Unable to fetch the requested data.' });
  }
});

// PORT
const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}`));
