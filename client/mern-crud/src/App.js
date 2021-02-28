import { useState, useEffect } from "react";
import "./App.css";
import Header from "./components/Header";
import axios from "axios";

function App() {
	const [id, setId] = useState("");
	const [item, setItem] = useState("");
	const [cant, setCant] = useState(0);
	const [items, setItems] = useState([]);

	/* Read Items List */
	const loadData = () => {
		axios
			.post("http://localhost:3001/load")
			.then((res) => {
				setItems(res.data);
			})
			.catch((e) => console.error(e));
	};
	useEffect(() => {
		loadData();
	}, []);

	/* Save items */
	const save = () => {
		if (id) {
			/* update */
			axios
				.post("http://localhost:3001/update", { id, item, cant })
				.then(() => loadData());
		} else {
			/* create */
			axios
				.post("http://localhost:3001/add", { item, cant })
				.then(() => {
					loadData();
				})
				.catch((e) => console.error(e));
		}
		clearData();
	};

	/*Delete existing item */
	const selecToDelete = (itemId) => {
		axios.post("http://localhost:3001/delete", { itemId }).then(() => {
			loadData();
		});
	};
	/* Edit existing item */
	const selecToEdit = (item) => {
		setId(item._id);
		setItem(item.item);
		setCant(item.cant);
	};
	const clearData = () => {
		setId("");
		setItem("");
		setCant(0);
	};

	return (
		<div className="App container mx-auto min-h-screen bg-gray-100 text-gray-50">
			<Header />
			{/* Form */}
			<div className="flex justify-center items-center h-full">
				<div className="w-full max-w-md bg-gray-300 text-gray-700 m-6 flex flex-col rounded-lg p-2">
					{/* Id */}
					<div className="flex flex-col ">
						<label className="text-xs">Id</label>
						<input
							className="focus:outline-none mb-2 rounded px-2"
							type="text"
							value={id}
							disabled
						/>
					</div>
					{/* Item */}
					<div className="flex flex-col ">
						<label className="text-xs">Item</label>
						<input
							className="focus:outline-none mb-2 rounded px-2"
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
							className="focus:outline-none mb-2 rounded px-2"
							type="number"
							value={cant}
							onChange={(e) => {
								setCant(e.target.value);
							}}
						/>
					</div>
					<div className="flex w-full">
						<button
							className="w-2/3 focus:outline-none border border-blue-600 rounded-lg mx-4 my-2 py-2 text-blue-600 hover:bg-blue-600 hover:text-gray-100"
							onClick={save}
						>
							{id ? "Editar" : "Agregar"} Item
						</button>
						<button
							className="w-1/3 focus:outline-none border border-blue-600 rounded-lg mx-4 my-2 py-2 text-blue-600 hover:bg-blue-600 hover:text-gray-100"
							onClick={clearData}
						>
							Limpiar
						</button>
					</div>
				</div>
			</div>
			{/* List */}
			<div className="flex flex-col w-full max-w-3xl mx-auto bg-gray-300 rounded-lg overflow-hidden text-gray-700">
				{items.map((item, index) => {
					return (
						<div
							className="w-full border justify-between items-center flex px-2 py-1"
							key={index}
						>
							<div className="flex flex-col">
								<div>{item.item}</div>
								<div className="text-xs">{item._id}</div>
							</div>
							<div>{item.cant}</div>
							<div className="flex">
								{/* Edit */}
								<svg
									className="h-5 text-blue-700 cursor-pointer mx-2"
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
									className="h-5 text-red-700 cursor-pointer mx-2"
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
