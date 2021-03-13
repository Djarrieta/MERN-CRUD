import { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";

const Profile = (props) => {
	const { currentUser } = props;
	const [loading, setLoading] = useState(true);
	const [users, setUsers] = useState([]);

	const handleChangeRole = (_id, role) => {
		if (role === "admin") {
			role = "basic";
		} else if (role === "basic") {
			role = "admin";
		}
		const countAdmins = users.filter((u) => {
			return u.role === "admin";
		});
		if (countAdmins.length <= 1 && role === "basic") {
			Swal.fire({
				icon: "error",
				title: "Debe haber por lo menos un administrador",
			});
			return;
		}
		if (currentUser.role !== "admin") {
			Swal.fire({
				icon: "error",
				title: "Solo los administradores pueden editar esta información",
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
					.post("http://localhost:3001/user/update", {
						_id,
						role,
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

	/* Read UsersList */
	const loadData = () => {
		setLoading(true);
		axios
			.get("http://localhost:3001/user/load")
			.then((res) => {
				setUsers(res.data.data);
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
		<div>
			{/* USER DATA */}
			<div className="flex flex-col items-center h-full">
				<div className="flex flex-col w-full max-w-md p-2 m-6 border-b border-l rounded-lg bg-primary text-secundary border-primary-light">
					<h1 className="text-3xl">MY INFORMATION</h1>
					<div className="flex items-center">
						<label>Username:</label>
						<span className="mx-2 text-lg">{currentUser.userName}</span>
					</div>
					<div className="flex items-center">
						<label>Role:</label>
						<span className="mx-2 text-lg">{currentUser.role}</span>
					</div>
				</div>
			</div>
			{/* USER LIST */}
			{currentUser.role === "admin" && (
				<div className="flex flex-col items-center w-full max-w-5xl mx-auto overflow-hidden rounded-lg">
					{loading && (
						<div className="w-32 h-32 p-1 rounded-full animate-ping bg-realced">
							<div className="w-full h-full rounded-full bg-primary-dark "></div>
						</div>
					)}
					{!loading &&
						users.map((user, index) => {
							return (
								<div
									className="flex items-center justify-between w-full px-2 py-1 border-b border-primary-light bg-primary hover:bg-primary-light"
									key={index}
								>
									<div className="flex flex-col mx-2">
										<div>{user.userName}</div>
										<div className="text-xs">{user._id}</div>
									</div>
									<button
										onClick={() => handleChangeRole(user._id, user.role)}
										className="px-2 py-1 mx-2 rounded bg-primary-light hover:bg-primary"
									>
										{user.role}
									</button>
								</div>
							);
						})}
				</div>
			)}
		</div>
	);
};
export default Profile;
