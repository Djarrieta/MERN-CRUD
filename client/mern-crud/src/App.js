import { useState, useEffect } from "react";
import { BrowserRouter, Switch, Route, Redirect } from "react-router-dom";

import Home from "./views/Home";
import Login from "./views/Login";
import Profile from "./views/Profile";
import Header from "./components/Header";

function App() {
	const [currentUser, setCurrentUser] = useState(null);

	const signOut = () => {
		window.localStorage.removeItem("currentUser");
		setCurrentUser(null);
	};
	useEffect(() => {
		const localStorageUser = window.localStorage.getItem("currentUser");
		if (currentUser) {
			window.localStorage.setItem("currentUser", JSON.stringify(currentUser));
			//console.log("se guardó enlocal ", currentUser);
		} else if (!currentUser && localStorageUser) {
			setCurrentUser(JSON.parse(localStorageUser));
			//console.log("se cargó desde locale", localStorageUser);
		}
	}, [currentUser]);
	return (
		<BrowserRouter>
			<div className="h-screen overflow-x-hidden overflow-y-scroll text-secundary bg-primary-dark">
				<Header currentUser={currentUser} signOut={signOut} />
				<Switch>
					{/* Home */}
					<Route exact path="/">
						<Home />
					</Route>
					{/* Login */}
					<Route exact path="/login">
						{!currentUser ? (
							<Login setCurrentUser={setCurrentUser} />
						) : (
							<Redirect to="/" />
						)}
					</Route>
					{/* Profile */}
					<Route exact path="/profile">
						{currentUser ? (
							<Profile currentUser={currentUser} />
						) : (
							<Redirect to="/login" />
						)}
					</Route>
				</Switch>
			</div>
		</BrowserRouter>
	);
}

export default App;
