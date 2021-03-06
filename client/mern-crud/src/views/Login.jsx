import axios from "axios";
import React, { useState } from "react";
import { useHistory } from "react-router-dom";

const Login = (props) => {
	const { setCurrentUser } = props;
	const [userName, setUserName] = useState("");
	const [password, setPassword] = useState("");
	const [confirmation, setConfirmation] = useState("");
	const [problems, setProblems] = useState("");
	const [hasAccount, setHasAccount] = useState(true);

	const history = useHistory();
	const clearData = () => {
		setUserName("");
		setPassword("");
		setConfirmation("");
		setProblems("");
	};

	const handleSignIn = () => {
		setProblems("");
		if (!password) {
			setProblems("Contraseña inválida");
		}
		if (!userName) {
			setProblems("Nombre de usuario inválido");
		}
		if (problems) {
			return;
		}
		axios
			.post("http://localhost:3001/signin", { userName, password })
			.then((user) => {
				setCurrentUser({
					userName: user.data.userName,
					uid: user.data.uid,
					role: user.data.role,
				});

				//cleaning data
				clearData();
				//redirect
				history.push("/");
			})
			.catch((e) => {
				setProblems(
					"Datos inválidos! nombre de usuario o contraseña incorrecta."
				);
				console.error(e.error);
			});
	};
	const handleSignUp = () => {
		setProblems("");

		if (password !== confirmation) {
			setProblems("Contraseñas no coinciden");
		}
		if (!password) {
			setProblems("Contraseña inválida");
		}
		if (!userName) {
			setProblems("Nombre de usuario inválido");
		}

		if (problems) {
			return;
		}
		axios
			.post("http://localhost:3001/signup", { userName, password })
			.then((user) => {
				console.log(user);
				setCurrentUser({
					userName: user.data.userName,
					uid: user.data.uid,
					role: user.data.role,
				});

				//cleaning data
				clearData();
				//redirect
				history.push("/");
			})
			.catch((e) => {
				setProblems("Datos inválidos! nombre de usuario ya existen.");
				console.error(e);
			});
	};

	return (
		<div className="flex items-center justify-center h-full">
			<div className="flex flex-col w-full max-w-md px-6 py-4 m-6 border-b border-l rounded-lg bg-primary text-secundary border-primary-light">
				<h1 className="my-3 text-4xl ">
					{hasAccount ? "Ingreso" : "Registro"}
				</h1>
				{/* userName */}
				<div className="flex flex-col">
					<label className="text-xs">Usuario</label>
					<input
						className="px-2 mb-2 rounded focus:outline-none text-primary"
						type="text"
						autoFocus
						required
						value={userName}
						onChange={(e) => {
							setUserName(e.target.value);
						}}
					/>
				</div>

				{/* password */}
				<div className="flex flex-col">
					<label className="text-xs">Contraseña</label>
					<input
						className="px-2 mb-2 rounded focus:outline-none text-primary"
						type="password"
						autoFocus
						required
						value={password}
						onChange={(e) => {
							setPassword(e.target.value);
						}}
					/>
				</div>
				{/* confirmation */}
				{!hasAccount && (
					<div className="flex flex-col">
						<label className="text-xs">Confirmación</label>
						<input
							className="px-2 mb-2 rounded focus:outline-none text-primary"
							type="password"
							autoFocus
							required
							value={confirmation}
							onChange={(e) => {
								setConfirmation(e.target.value);
							}}
						/>
					</div>
				)}

				{/* Problems */}
				<p className="text-error">{problems}</p>
				{/* Buttons */}
				<div className="flex flex-col justify-between w-full px-6">
					<button
						className="w-full py-2 mx-4 my-2 border rounded-lg focus:outline-none border-realced text-realced hover:bg-primary hover:text-secundary-light"
						onClick={hasAccount ? handleSignIn : handleSignUp}
					>
						{hasAccount ? "Ingreso" : "Registro"}
					</button>
					<div className="flex justify-center my-2">
						<p>
							{hasAccount ? "¿No tienes una cuenta?" : "¿Ya tienes una cuenta?"}
						</p>
						<span
							className="mx-2 text-blue-500 cursor-pointer "
							onClick={() => setHasAccount(!hasAccount)}
						>
							{hasAccount ? "Registrate" : "Ingresa"}
						</span>
					</div>
				</div>
			</div>
		</div>
	);
};
export default Login;
