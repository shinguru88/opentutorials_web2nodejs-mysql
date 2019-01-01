var template = require('./template');
var db = require('./db');
var qs = require('querystring');

exports.home = function (request, response) {
  db.query('SELECT * from topic', function (error, topics) {
    if (error) {
      throw error;
    }
    db.query('SELECT * from author', function (error2, authors) {
      if (error2) {
        throw error2;
      }

      var tag = '<table>';
      var i = 0;
      while (i < authors.length) {
        tag += `<tr>
        <td>${authors[i].name}</td>
        <td>${authors[i].profile}</td>
        <td>update</td>
        <td>delete</td>
        </tr>`;
        i++;
      }

      tag += '</table>';

      var title = 'Author';
      var list = template.list(topics);
      var html = template.HTML(title, list,
        `
        ${tag}
        <style>
          table {
            border-collapse: collapse;
          }
          td {
            border: 1px solid black;
          }
        </style>
        <form action="/author/create_process" method="post">
          <p><input type="text" name="name" placeholder="author name"></p>
          <p>
          <textarea name="profile" placeholder="author profile"></textarea>
          </p>
          <p>
          <input type="submit">
          </p>
        </form>
        `,
        `
        `
      );
      response.writeHead(200);
      response.end(html);
    })
  });
}

exports.create_process = function (request, response) {
  var body = '';
  request.on('data', function (data) {
    body = body + data;
  });
  request.on('end', function () {
    var post = qs.parse(body);
    db.query(`INSERT INTO author (name, profile)
     VALUES(?,?);`, [post.name, post.profile], function (error, result) {
        if (error) {
          throw error;
        }

        response.writeHead(302, { Location: `/author` });
        response.end();
      });
  });
}

