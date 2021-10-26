import React from 'react';
import PageNavbar from './PageNavbar';
import BestGenreRow from './BestGenreRow';
import '../style/BestGenres.css';
import 'bootstrap/dist/css/bootstrap.min.css';

export default class BestGenre extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			selectedDecade: "",
			decades: [],
			genres: []
		};

		this.submitDecade = this.submitDecade.bind(this);
		this.handleChange = this.handleChange.bind(this);
	}

	/* ---- Q3a (Best Genres) ---- */
	componentDidMount() {
		// Send an HTTP request to the server.
    fetch("http://localhost:8081/decades",
    {
      method: 'GET' // The type of HTTP request.
    }).then(res => {
      // Convert the response data to a JSON.
      return res.json();
    }, err => {
      // Print the error if there is one.
      console.log(err);
    }).then(decadeList => {
      if (!decadeList) return;

			let decadeDivs = decadeList.map((decade, i) =>
				<option value={decade.decade}>{decade.decade} </option>
			);

			this.setState({
				decades: decadeDivs
			});
		});
	}

	handleChange(e) {
		this.setState({
			selectedDecade: e.target.value
		});
	}

	/* ---- Q3b (Best Genres) ---- */
	submitDecade() {

		    fetch("http://localhost:8081/bestgenres/" + this.state.selectedDecade,
				{
					method: "GET"
				}).then(res => {
					return res.json();
				}, err => {
					console.log(err);
				}).then(decadeGenreList => {
					console.log(decadeGenreList); //displays your JSON object in the console
					let decadeGenreDivs = decadeGenreList.map((decadeGenre, i) =>

						<div key={i} className="movieResults">
							<div className="genre">{decadeGenre.genre}</div>
							<div className="rating">{decadeGenre.avg_rating}</div>
						</div>
					);

					//This saves our HTML representation of the data into the state, which we can call in our render function
					this.setState({
						genres: decadeGenreDivs
					});
				});

	}

	render() {

		return (
			<div className="BestGenres">
				<PageNavbar active="bestgenres" />

				<div className="container bestgenres-container">
			      <div className="jumbotron">
			        <div className="h5">Best Genres</div>

			        <div className="years-container">
			          <div className="dropdown-container">
			            <select value={this.state.selectedDecade} onChange={this.handleChange} className="dropdown" id="decadesDropdown">
			            	<option select value> -- select an option -- </option>
			            	{this.state.decades}
			            </select>
			            <button className="submit-btn" id="decadesSubmitBtn" onClick={this.submitDecade}>Submit</button>
			          </div>
			        </div>
			      </div>
			      <div className="jumbotron">
			        <div className="movies-container">
			          <div className="movie">
			            <div className="header"><strong>Genre</strong></div>
			            <div className="header"><strong>Average Rating</strong></div>
			          </div>
			          <div className="movies-container" id="results">
			            {this.state.genres}
			          </div>
			        </div>
			      </div>
			    </div>
			</div>
		);
	}
}
