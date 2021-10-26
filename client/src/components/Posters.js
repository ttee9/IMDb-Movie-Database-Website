import React from 'react';
import '../style/Posters.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import PageNavbar from './PageNavbar';


export default class BestGenre extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			posterImage: []
		};

	}

	/* ---- EC (Posters) ---- */
	componentDidMount() {
		// Send an HTTP request to the server.
    fetch("http://localhost:8081/posters",
    {
      method: 'GET' // The type of HTTP request.
    }).then(res => {
      // Convert the response data to a JSON.
      return res.json();
    }, err => {
      // Print the error if there is one.
      console.log(err);
    }).then(posterList => {
			console.log("testEC1 " + posterList); //displays your JSON object in the console
      if (!posterList) return;
			let posterDivs = posterList.map((poster, i) =>

							// Send an HTTP request to the server.
							fetch("http://www.omdbapi.com/?i=" + poster.imdb_id + "&apikey=442a1b8e",
							{
							  method: 'GET' // The type of HTTP request.
							}).then(res => {
							  // Convert the response data to a JSON.
							  console.log("testEC2" + res);
							  return res.json();

							}, err => {
							  // Print the error if there is one.
							  console.log(err);
							}).then(omdbList => {
							  console.log(JSON.stringify(omdbList));
							  if (!omdbList) return;

							  console.log("testEC4 " + JSON.stringify(omdbList.Poster));
							  console.log("testEC5 " + omdbList.Poster); //displays your JSON object in the console

							  this.setState({
							    posterImage: this.state.posterImage.concat(

											<div class="red">
												<a href={this.showPoster(omdbList.Website, omdbList.Title, omdbList.Year )} target="_blank"> <img src={omdbList.Poster} width="300" height="450" alt=""/> </a>
												<p style={{color: "white"}}> {omdbList.Title} </p>
											</div>

									)
							  });
							}),
			);
		});
	}

	showPoster(website, title, year) {
		if (website == "N/A") {
			return "https://www.google.com/search?q=" + title + " " + year + " film";
		}
		else {
			return website;
		}
  }


	render() {
		return (

			<div className="Dashboard">
				<PageNavbar active="posters" />
								<div class="postercontainer">
										{this.state.posterImage}
								</div>

			</div>

		);
	}
}
