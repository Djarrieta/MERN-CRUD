const About = () => {
	return (
		<div className="container p-6 mx-auto mt-6 border-b border-l rounded-lg bg-primary border-primary-light">
			<h1 className="text-xl">MERN CRUD</h1>
			<p className="my-2">
				It is a simple web application made using React as frontend framework,
				Express as backend framework with Node and Mongo for storage all the
				data needed.
			</p>
			<p className="my-2">
				This app can add a list of items and quantity. You can do simple
				operatios like create, read, update and delete. It uses Sweet Alert
				library to error and alert messages and mongoose to manage mongodb.
			</p>
			<p className="my-2">
				You can also make your own user and only admins can upgrate you.{" "}
			</p>
			<p className="my-2">Made by Darío Arrieta</p>
			<a href="https://github.com/Djarrieta/MERN-CRUD" className="text-realced">
				GitHub Repository
			</a>
		</div>
	);
};
export default About;
