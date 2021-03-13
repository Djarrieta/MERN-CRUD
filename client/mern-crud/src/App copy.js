import { useState, useEffect } from "react";
import { BrowserRouter, Switch, Route, Redirect } from "react-router-dom";
import Header from "./components/Header";
import axios from "axios";
import Swal from "sweetalert2";

function App() {
	const [currentUser, setCurrentUser] = useState({ user: "user" });
	const [id, setId] = useState("");
	const [item, setItem] = useState("");
	const [cant, setCant] = useState(0);
	const [items, setItems] = useState([]);
	const [loading, setLoading] = useState(true);

	/* SignIn */
	const signin = () => {};

	/* Read Items List */
	const loadData = () => {
		setLoading(true);
		axios
			.get("http://localhost:3001/load")
			.then((res) => {
				setItems(res.data.data);
				setLoading(false);
			})
			.catch((e) => {
				setLoading(false);
				console.error(e);
			});
	};
	useEffect(() => {
		loadData();
	}, []);

	/* Save items */
	const save = () => {
		if (id) {
			/* update */
			Swal.fire({
				title: "Seguro quieres actualizar estos datos?",
				showDenyButton: true,
				showCancelButton: true,
				confirmButtonText: `Guardar`,
				denyButtonText: `No guardar`,
			}).then((result) => {
				if (result.isConfirmed) {
					axios
						.post("http://localhost:3001/update", { id, item, cant })
						.then(() => {
							loadData();
							clearData();
						});
					Swal.fire("Guardado!", "", "success");
				} else if (result.isDenied) {
					Swal.fire("Los cambios no fueron guardados", "", "info");
				}
			});
		} else {
			/* create */
			if (!item) {
				Swal.fire({
					icon: "error",
					title: "Oops...",
					text: "No puedes crear un ítem sin texto!",
				});
				return;
			}

			Swal.fire({
				title: "Seguro quieres crear un nuevo ítem?",
				showDenyButton: true,
				showCancelButton: true,
				confirmButtonText: `Crear`,
				denyButtonText: `No crear`,
			}).then((result) => {
				if (result.isConfirmed) {
					axios
						.post("http://localhost:3001/add", { item, cant })
						.then(() => {
							loadData();
							clearData();
						})
						.catch((e) => console.error(e));
					Swal.fire("Guardado!", "", "success");
				} else if (result.isDenied) {
					Swal.fire("Los cambios no fueron guardados", "", "info");
				}
			});
		}
	};
	/*Delete existing item */
	const selecToDelete = (itemId) => {
		Swal.fire({
			title: "Seguro quieres eliminar este ítem?",
			showDenyButton: true,
			showCancelButton: true,
			confirmButtonText: `Eliminar`,
			denyButtonText: `No eliminar`,
		}).then((result) => {
			if (result.isConfirmed) {
				axios.post("http://localhost:3001/delete", { itemId }).then(() => {
					loadData();
				});
				Swal.fire("Eliminado!", "", "success");
			} else if (result.isDenied) {
				Swal.fire("Los cambios no fueron guardados", "", "info");
			}
		});
	};
	/* Edit existing item */
	const selecToEdit = (item) => {
		setId(item._id);
		setItem(item.item);
		setCant(item.cant);
	};
	/* Clear Data */
	const clearData = () => {
		setId("");
		setItem("");
		setCant(0);
	};

	return (
		<div className="container min-h-screen mx-auto App bg-primary-dark text-secundary">
			<Header currentUser={currentUser} signin={signin} />
			{/* Form */}
			<div className="flex items-center justify-center h-full">
				<div className="flex flex-col w-full max-w-md p-2 m-6 border-b border-l rounded-lg bg-primary text-secundary border-primary-light">
					{/* Id */}
					<div className="flex flex-col ">
						<label className="text-xs">Id</label>
						<input
							className="px-2 mb-2 rounded focus:outline-none text-primary"
							type="text"
							value={id}
							disabled
						/>
					</div>
					{/* Item */}
					<div className="flex flex-col ">
						<label className="text-xs">Item</label>
						<input
							className="px-2 mb-2 rounded focus:outline-none text-primary"
							type="text"
							value={item}
							onChange={(e) => {
								setItem(e.target.value);
							}}
						/>
					</div>
					{/* Cantidad */}
					<div className="flex flex-col ">
						<label className="text-xs">Cantidad</label>
						<input
							className="px-2 mb-2 rounded focus:outline-none text-primary"
							type="number"
							value={cant}
							onChange={(e) => {
								setCant(e.target.value);
							}}
						/>
					</div>
					<div className="flex w-full">
						<button
							className="w-2/3 py-2 mx-4 my-2 border rounded-lg focus:outline-none border-realced text-realced hover:bg-primary hover:text-secundary-light"
							onClick={save}
						>
							{id ? "Editar" : "Agregar"} Item
						</button>
						<button
							className="w-1/3 py-2 mx-4 my-2 border rounded-lg focus:outline-none border-realced text-realced hover:bg-primary hover:text-secundary-light"
							onClick={clearData}
						>
							Limpiar
						</button>
					</div>
				</div>
			</div>
			{/* List */}
			<div className="flex flex-col items-center w-full max-w-5xl mx-auto overflow-hidden rounded-lg">
				{/* Loading */}
				{loading && (
					<div className="w-32 h-32 p-1 rounded-full animate-ping bg-realced">
						<div className="w-full h-full rounded-full bg-primary-dark "></div>
					</div>
				)}
				{!loading &&
					items.map((item, index) => {
						return (
							<div
								className="flex items-center justify-between w-full px-2 py-1 border-b border-primary-light bg-primary"
								key={index}
							>
								<div className="flex flex-col mx-2">
									<div>{item.item}</div>
									<div className="text-xs">{item._id}</div>
								</div>
								<div className="">{item.cant}</div>
								<div className="flex">
									{/* Edit */}
									<svg
										className="h-5 mx-2 cursor-pointer text-realced"
										onClick={() => selecToEdit(item)}
										xmlns="http://www.w3.org/2000/svg"
										fill="none"
										viewBox="0 0 24 24"
										stroke="currentColor"
									>
										<path
											strokeLinecap="round"
											strokeLinejoin="round"
											strokeWidth={2}
											d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
										/>
									</svg>
									<svg
										className="h-5 mx-2 cursor-pointer text-error"
										onClick={() => selecToDelete(item._id)}
										xmlns="http://www.w3.org/2000/svg"
										fill="none"
										viewBox="0 0 24 24"
										stroke="currentColor"
									>
										<path
											strokeLinecap="round"
											strokeLinejoin="round"
											strokeWidth={2}
											d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
										/>
									</svg>
								</div>
							</div>
						);
					})}
			</div>
		</div>
	);
}

export default App;
