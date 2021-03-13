import axios from "axios";
import Swal from "sweetalert2";

const ListItems = (props) => {
	const {
		loading,
		items,
		loadData,
		setId,
		setItem,
		setCant,
		currentUser,
	} = props;
	/*Delete existing item */
	const selecToDelete = (itemId) => {
		if (currentUser.role !== "admin") {
			Swal.fire({
				icon: "error",
				title:
					"Solo los administradores pueden eliminar, como usuario básico, solo puedes crear",
			});
			return;
		}
		Swal.fire({
			title: "Seguro quieres eliminar este ítem?",
			showDenyButton: true,
			showCancelButton: true,
			confirmButtonText: `Eliminar`,
			denyButtonText: `No eliminar`,
		}).then((result) => {
			if (result.isConfirmed) {
				axios
					.post("http://localhost:3001/delete", {
						itemId,
						uid: currentUser.uid,
					})
					.then(() => {
						loadData();
					});
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
	return (
		<div className="flex flex-col items-center w-full max-w-5xl mx-auto overflow-hidden rounded-lg">
			{loading && (
				<div className="w-32 h-32 p-1 rounded-full animate-ping bg-realced">
					<div className="w-full h-full rounded-full bg-primary-dark "></div>
				</div>
			)}
			{!loading &&
				items.map((item, index) => {
					return (
						<div
							className="flex items-center justify-between w-full px-2 py-1 border-b border-primary-light bg-primary hover:bg-primary-light"
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
	);
};
export default ListItems;
