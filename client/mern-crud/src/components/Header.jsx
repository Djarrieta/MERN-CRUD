import { useState } from "react";
import { Link } from "react-router-dom";

const Header = (props) => {
	const { currentUser, signOut } = props;
	const [principalMenu, setPrincipalMenu] = useState(false);
	const [profileMenu, setProfileMenu] = useState(false);

	return (
		<div className="border-b bg-primary border-primary-light">
			<nav className="container flex items-center justify-around h-16 m-auto ">
				{/* PrincipalMenu */}
				<div className="relative flex items-center cursor-pointer">
					<svg
						onClick={() => setPrincipalMenu(!principalMenu)}
						className="w-12 h-12"
						xmlns="http://www.w3.org/2000/svg"
						viewBox="0 0 20 20"
						fill="currentColor"
					>
						<path
							fillRule="evenodd"
							d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
							clipRule="evenodd"
						/>
					</svg>
					<a href="/">Logo</a>
					{/* Principal Menu */}
					{principalMenu && (
						<div
							onClick={() => setPrincipalMenu(!principalMenu)}
							onMouseLeave={() => setPrincipalMenu(!principalMenu)}
							className="absolute top-0 left-0 w-64 pb-2 "
						>
							<div className="flex flex-col px-6 py-1 mt-16 border-b border-l rounded-lg border-primary-light bg-primary">
								<a
									className="w-full px-2 py-1 my-1 text-center border-b rounded hover:bg-primary-light border-primary-light text-realced"
									href="/login"
								>
									Login
								</a>
								<a
									className="w-full px-2 py-1 my-1 text-center rounded hover:bg-primary-light text-realced"
									href="/about"
								>
									About
								</a>
							</div>
						</div>
					)}
				</div>
				{/* ProfileMenu */}
				<div className="relative">
					<svg
						onClick={() => setProfileMenu(!profileMenu)}
						className={`w-12 h-12 ${currentUser && "text-realced"}`}
						xmlns="http://www.w3.org/2000/svg"
						viewBox="0 0 20 20"
						fill="currentColor"
					>
						<path
							fillRule="evenodd"
							d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-6-3a2 2 0 11-4 0 2 2 0 014 0zm-2 4a5 5 0 00-4.546 2.916A5.986 5.986 0 0010 16a5.986 5.986 0 004.546-2.084A5 5 0 0010 11z"
							clipRule="evenodd"
						/>
					</svg>
					{/* Profile Menu */}
					{profileMenu && (
						<div
							onClick={() => setProfileMenu(!profileMenu)}
							onMouseLeave={() => setProfileMenu(!profileMenu)}
							className="absolute top-0 right-0 w-64 pb-2 "
						>
							<div className="flex flex-col px-6 py-1 mt-16 border-b border-l rounded-lg border-primary-light bg-primary">
								{currentUser && (
									<Link
										className="w-full px-2 py-1 my-1 overflow-hidden text-center border-b rounded hover:bg-primary-light border-primary-light text-realced"
										to="/profile"
									>
										{currentUser.userName || "Perfil"}
									</Link>
								)}
								{!currentUser && (
									<Link
										className="w-full px-2 py-1 my-1 overflow-hidden text-center border-b rounded hover:bg-primary-light border-primary-light text-realced"
										to="/login"
									>
										Login
									</Link>
								)}

								<button
									className="w-full px-2 py-1 my-1 text-center rounded hover:bg-primary-light text-realced"
									onClick={() => signOut()}
								>
									Salir
								</button>
							</div>
						</div>
					)}
				</div>
			</nav>
		</div>
	);
};
export default Header;
