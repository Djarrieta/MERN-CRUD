const express = require("express");
const mongoose = require("mongoose");
const Item = require("./models/Items");
const User = require("./models/users");
const cors = require("cors");
const bcrypt = require("bcryptjs");
require("dotenv").config();

const db = process.env.MONGO_DB;
const pass = process.env.MONGO_PASS;
const userName = process.env.MONGO_USER;

//express
const app = express();
//permite leer como json los datos que vienen de front
app.use(express.json());
app.use(cors());

//mongo
const uri = `mongodb+srv://${userName}:${pass}@clustermern-crud.sh7wu.mongodb.net/${db}?retryWrites=true&w=majority`;

mongoose
	.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
	.then(() => {
		app.listen(3001, () => console.log("servidor en 3001"));
	})
	.catch((e) => console.error(e));

//SignUp
app.post("/signup", async (req, res) => {
	const newUser = { ...req.body };
	//missing data
	if (!newUser.userName || !newUser.password) {
		return res
			.status(400)
			.send({ error: "Datos Inválidos al crear nuevo usuario" });
	}
	//username in use
	const userFoundByName = await User.find({ userName: newUser.userName });
	if (userFoundByName.length > 0) {
		return res.status(400).send({ error: "El nombre de usuario ya existe." });
	}

	const salt = await bcrypt.genSalt(10);
	const encodedPass = await bcrypt.hash(newUser.password, salt);
	User({
		...newUser,
		password: encodedPass,
		role: "basic",
	})
		.save()
		.then((result) => {
			res.status(201).send({
				uid: result._doc._id,
				userName: result._doc.userName,
				role: result._doc.role,
			});
		})
		.catch((e) => {
			console.log(e);
			res.status(400).send({ error: "Hubo un problema" });
		});
});
//signin
app.post("/signin", async (req, res) => {
	const userData = { ...req.body };
	//missing data
	if (!userData.userName || !userData.password) {
		return res.status(400).send({ error: "Datos Inválidos al ingresar" });
	}
	try {
		const userFoundByName = await User.findOne({ userName: userData.userName });

		if (!userFoundByName) {
			return res.status(401).send({ error: "Usuario desconocido" });
		}

		const passOK = await bcrypt.compare(
			userData.password,
			userFoundByName.password
		);
		if (!passOK) {
			return res.status(401).json({ error: "Contraseña Inválida" });
		}

		res.status(201).send({
			uid: userFoundByName._id,
			userName: userFoundByName.userName,
			role: userFoundByName.role,
		});
	} catch (e) {
		console.error(e);
		res.status(400).send({ error: "Hubo un problema" });
	}
});
//Add Item
app.post("/add", async (req, res) => {
	const { uid, item, cant } = req.body;

	if (!uid || !item) {
		return res.status(400).send({ error: "Datos Inválidos al crear item" });
	}
	const itemObject = await new Item({ uid, item, cant });
	console.log(itemObject);
	itemObject
		.save()
		.then((result) => {
			res.json({ error: null, ...result._doc });
		})
		.catch((e) => {
			console.error(e);
			res.json({ error: "Hubo un problema", message: e });
		});
});
//Update Item
app.post("/update", async (req, res) => {
	const { _id, item, cant, uid } = req.body;
	const user = await User.findById(uid);
	if (user.role === "admin") {
		await Item.updateOne({ _id }, { item, cant, uid });
		res.status(200).send({ message: _id + " Editado" });
	} else {
		res.status(400).send({ error: "Solo los administradores pueden editar" });
	}
});
//Delete Item
app.post("/delete", async (req, res) => {
	const _id = req.body.itemId;
	const uid = req.body.uid;
	const user = await User.findById(uid);
	if (user.role === "admin") {
		await Item.deleteOne({ _id });
		res.status(200).send({ message: _id + " Borrado" });
	} else {
		res.status(400).send({ error: "Solo los administradores pueden eliminar" });
	}
});
//Load Items data
app.get("/load", (req, res) => {
	Item.find()
		.sort("item")
		.then((result) => {
			res.json({
				error: null,
				data: result,
			});
		});
});
//Load Users data
app.get("/user/load", (req, res) => {
	User.find().then((result) => {
		res.json({
			error: null,
			data: result,
		});
	});
});

//Update User
app.post("/user/update", async (req, res) => {
	const { _id, role, uid } = req.body;
	const user = await User.findById(uid);
	if (user.role === "admin") {
		await User.updateOne({ _id }, { role, uid });
		res.status(200).send({ message: _id + " Editado" });
	} else {
		res.status(400).send({ error: "Solo los administradores pueden editar" });
	}
});
