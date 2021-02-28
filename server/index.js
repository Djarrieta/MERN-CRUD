const express = require("express");
const mongoose = require("mongoose");
const Item = require("./models/Items");
require("dotenv").config();

const db = process.env.MONGO_DB;
const pass = process.env.MONGO_PASS;
const user = process.env.MONGO_USER;

//express
const app = express();
//permite leer como json los datos que vienen de front
app.use(express.json());

//mongo
const uri = `mongodb+srv://${user}:${pass}@clustermern-crud.sh7wu.mongodb.net/${db}?retryWrites=true&w=majority`;

mongoose
	.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
	.then(() => {
		app.listen(3001, () => console.log("servidor en 3001"));
	})
	.catch((e) => console.error(e));

//Agregar Item
app.post("/add", (req, res) => {
	const item = new Item({
		item: req.body.item,
		cant: req.body.cant,
	});
	item
		.save()
		.then((result) => {
			res.send(result);
		})
		.catch((e) => console.error(e));
});
//Editar Item
app.post("/update", async (req, res) => {
	const _id = req.body.id;
	const item = req.body.item;
	const cant = req.body.cant;
	await Item.updateOne({ _id }, { item, cant });
	res.send(_id + " Editado");
});

//Eliminar Item
app.post("/delete", async (req, res) => {
	const _id = req.body.itemId;
	await Item.deleteOne({ _id });
	res.send(_id + " Borrado");
});

//Cargar todos los items
app.post("/load", (req, res) => {
	Item.find()
		.sort("item")
		.then((result) => {
			res.send(result);
		});
});
