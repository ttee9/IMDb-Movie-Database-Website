var config = require('./db-config.js');
var mysql = require('mysql');

config.connectionLimit = 10;
var connection = mysql.createPool(config);

/* -------------------------------------------------- */
/* ------------------- Route Handlers --------------- */
/* -------------------------------------------------- */


/* ---- Q1a (Dashboard) ---- */
function getAllGenres(req, res) {

  var query = `
  SELECT distinct g.genre

  FROM Genres g JOIN Movies m ON g.movie_id = m.id;
  `;
  connection.query(query, function(err, rows, fields) {
    if (err) console.log(err);
    else {
      res.json(rows);
    }
  });

};


/* ---- Q1b (Dashboard) ---- */
function getTopInGenre(req, res) {

  var inputGenre = req.params.genre;

  var query = `
  SELECT
  m.title,
  m.rating,
  m.vote_count as votes

  FROM
  Genres g JOIN Movies m ON g.movie_id = m.id

  WHERE
  g.genre LIKE '${inputGenre}'

  ORDER BY
  m.rating desc, m.vote_count desc

  LIMIT 10;
  `;
  connection.query(query, function(err, rows, fields) {
    if (err) console.log(err);
    else {
      res.json(rows);
    }
  });
};

/* ---- Q2 (Recommendations) ---- */
function getRecs(req, res) {

  var inputMovie = req.params.movie;
  var query = `

  WITH Temp AS (
  SELECT
  g.genre as genre
  FROM
  Genres g JOIN Movies m ON g.movie_id = m.id
  WHERE
  m.title LIKE '${inputMovie}'
  )

  SELECT
  m.title, m.id, m.rating, m.vote_count, COUNT(t.genre)
  FROM
  Genres g JOIN Movies m ON g.movie_id = m.id JOIN Temp t ON g.genre = t.genre
  GROUP BY
  m.id
  HAVING
  COUNT(g.genre) >= ALL (SELECT COUNT(distinct genre) FROM Temp) AND m.title != '${inputMovie}'
  ORDER BY
  m.rating desc, m.vote_count desc
  LIMIT 5;

  `;
  connection.query(query, function(err, rows, fields) {
    if (err) console.log(err);
    else {
      res.json(rows);
    }
  });

};

/* ---- (Best Genres) ---- */
function getDecades(req, res) {

	var query = `
    SELECT DISTINCT (FLOOR(year/10)*10) AS decade
    FROM (
      SELECT DISTINCT release_year as year
      FROM Movies
      ORDER BY release_year
    ) y
  `;
  connection.query(query, function(err, rows, fields) {
    if (err) console.log(err);
    else {
      res.json(rows);
    }
  });

}

/* ---- Q3 (Best Genres) ---- */
function bestGenresPerDecade(req, res) {

  var inputDecade = req.params.decade;

  var query = `
    WITH temp1 AS(
    SELECT
    g.genre as genre, AVG(m.rating) as avg_rating
    FROM
    Movies m JOIN Genres g ON m.id = g.movie_id
    WHERE
    m.release_year = '${inputDecade}' OR
    m.release_year = '${inputDecade}' + 1 OR
    m.release_year = '${inputDecade}'  + 2 OR
    m.release_year = '${inputDecade}'  + 3 OR
    m.release_year = '${inputDecade}'  + 4 OR
    m.release_year = '${inputDecade}'  + 5 OR
    m.release_year = '${inputDecade}'  + 6 OR
    m.release_year = '${inputDecade}'  + 7 OR
    m.release_year = '${inputDecade}'  + 8 OR
    m.release_year = '${inputDecade}'  + 9
    GROUP BY
    g.genre
    ),

    temp2 AS(
    SELECT
    distinct g.genre as genre
    FROM
    Genres g
    ),

    temp3 AS(
    SELECT
    t2.genre, 0 as avg_rating
    FROM
    temp2 t2 LEFT OUTER JOIN temp1 t1 on t2.genre = t1.genre
    WHERE
    avg_rating IS NULL
    )

    SELECT genre, avg_rating FROM temp1
    UNION ALL
    SELECT genre, avg_rating FROM temp3
    ORDER BY
    avg_rating desc, genre

  `;
  connection.query(query, function(err, rows, fields) {
    if (err) console.log(err);
    else {
      res.json(rows);
    }
  });
}

/* ---- EC (Posters) ---- */
function getPosters(req, res) {

  var query = `
  SELECT
  m.title as title,
  m.imdb_id as imdb_id

  FROM movies m
  ORDER BY RAND()
  LIMIT 12;
  `;
  connection.query(query, function(err, rows, fields) {
    if (err) console.log(err);
    else {
      res.json(rows);
    }
  });
};


// The exported functions, which can be accessed in index.js.
module.exports = {
	getAllGenres: getAllGenres,
	getTopInGenre: getTopInGenre,
	getRecs: getRecs,
	getDecades: getDecades,
  bestGenresPerDecade: bestGenresPerDecade,
  getPosters: getPosters
}
