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
	if (!newUser.userName || !newUser.email || !newUser.password) {
		return res
			.status(400)
			.json({ error: "Datos Inválidos al crear nuevo usuario" });
	}
	//username in use
	const userFoundByName = await User.find({ userName: newUser.userName });
	if (userFoundByName.length > 0) {
		res.status(400).json({ error: "El nombre de usuario ya existe." });
	}
	//email in use
	const userFoundByEmail = await User.find({ email: newUser.email });
	if (userFoundByEmail.length > 0) {
		return res.status(400).json({ error: "El email ya existe." });
	}

	const salt = await bcrypt.genSalt(10);
	const encodedPass = await bcrypt.hash(newUser.password, salt);

	try {
		const savedData = await new User({
			...newUser,
			password: encodedPass,
		}).save();
		res.status(201).json(savedData);
	} catch (e) {
		console.error(e);
		res.status(400).json({ error: "Hubo un problema." });
	}
});
//signin
app.post("/signin", async (req, res) => {
	const userData = { ...req.body };
	//missing data
	if (!userData.userName || !userData.password) {
		return res.status(400).json({ error: "Datos Inválidos al ingresar" });
	}
	try {
		const userFoundByName = await User.findOne({ userName: userData.userName });

		if (!userFoundByName) {
			return res.status(401).json({ error: "Usuario desconocido" });
		}

		const passOK = await bcrypt.compare(
			userData.password,
			userFoundByName.password
		);
		if (!passOK) {
			return res.status(401).json({ error: "Contraseña Inválida" });
		}

		res.status(201).json({ ...userFoundByName._doc });
	} catch (e) {
		console.error(e);
	}
});

//Add Item
app.post("/add", (req, res) => {
	const item = new Item({
		item: req.body.item,
		cant: req.body.cant,
	});
	item
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
	const { _id, item, cant } = req.body;
	await Item.updateOne({ _id }, { item, cant });
	res.json({ error: null, message: _id + " Editado" });
});

//Delete Item
app.post("/delete", async (req, res) => {
	const { _id } = req.body;
	await Item.deleteOne({ _id });
	res.json({ error: null, message: _id + " Borrado" });
});

//Load data
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
