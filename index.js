const express = require('express');
const app = express();
const axios = require('axios');

  app.get('/top-posts', async (req, res) => {
    try {
      const rootUrl = 'https://jsonplaceholder.typicode.com';
      const [commentsResponse, postsResponse] = await axios.all([
        axios.get(rootUrl+'/comments'),
        axios.get(rootUrl+'/posts')
       ]);
      const comments = commentsResponse.data;
      const posts = postsResponse.data.map(post => {
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
      res.status(500).json({ message: 'Error fetching data' });
    }
  });

// PORT
const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}`));

