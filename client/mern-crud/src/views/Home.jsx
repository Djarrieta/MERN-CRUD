import { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import ListItems from "../components/ListItems";

const Home = (props) => {
	const { currentUser } = props;
	const [_id, setId] = useState("");
	const [item, setItem] = useState("");
	const [cant, setCant] = useState(0);
	const [items, setItems] = useState([]);
	const [loading, setLoading] = useState(true);
	const save = () => {
		if (!currentUser) {
			Swal.fire({
				icon: "error",
				title: "Debes estar registrado para guardar cambios.",
			});
			return;
		}
		if (_id) {
			/* update */
			if (currentUser.role !== "admin") {
				Swal.fire({
					icon: "error",
					title:
						"Solo los administradores pueden editar, como usuario básico, solo puedes crear",
				});
				return;
			}
			if (!item) {
				Swal.fire({
					icon: "error",
					title: "No puedes crear un ítem sin texto!",
				});
				return;
			}
			Swal.fire({
				title: "Seguro quieres actualizar estos datos?",
				showDenyButton: true,
				showCancelButton: true,
				confirmButtonText: `Guardar`,
				denyButtonText: `No guardar`,
			}).then((result) => {
				if (result.isConfirmed) {
					axios
						.post("http://localhost:3001/update", {
							uid: currentUser.uid,
							_id,
							item,
							cant,
						})
						.then(() => {
							loadData();
							clearData();
						});
				} else if (result.isDenied) {
					Swal.fire("Los cambios no fueron guardados", "", "info");
				}
			});
		} else {
			/* create */
			if (!item) {
				Swal.fire({
					icon: "error",
					title: "No puedes crear un ítem sin texto!",
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
						.post("http://localhost:3001/add", {
							uid: currentUser.uid,
							item,
							cant,
						})
						.then(() => {
							loadData();
							clearData();
						})
						.catch((e) => console.error(e));
				} else if (result.isDenied) {
					Swal.fire("Los cambios no fueron guardados", "", "info");
				}
			});
		}
	};
	const clearData = () => {
		setId("");
		setItem("");
		setCant(0);
	};
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

	return (
		<div className="flex flex-col items-center h-full">
			<div className="flex flex-col w-full max-w-md p-2 m-6 border-b border-l rounded-lg bg-primary text-secundary border-primary-light">
				{/* Id */}
				{_id && (
					<div className="flex flex-col ">
						<label className="text-xs">Id</label>
						<input
							className="px-2 mb-2 rounded focus:outline-none text-primary"
							type="text"
							value={_id}
							disabled
						/>
					</div>
				)}
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
						{_id ? "Editar" : "Agregar"} Item
					</button>
					<button
						className="w-1/3 py-2 mx-4 my-2 border rounded-lg focus:outline-none border-realced text-realced hover:bg-primary hover:text-secundary-light"
						onClick={clearData}
					>
						Limpiar
					</button>
				</div>
			</div>
			<ListItems
				loading={loading}
				items={items}
				loadData={loadData}
				setId={setId}
				setItem={setItem}
				setCant={setCant}
				currentUser={currentUser}
			/>
		</div>

		/* List */
	);
};
export default Home;
