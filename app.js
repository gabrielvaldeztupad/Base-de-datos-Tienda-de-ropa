const { MongoClient, ObjectId } = require("mongodb");

// Connection String de Atlas: usa la variable de entorno si existe, si no el texto fijo
const URI = process.env.MONGODB_URI ||
  "mongodb+srv://gabrielvaldeztupad_db:.......@tpi.fj0z7fw.mongodb.net/";

const client = new MongoClient(URI);

// CREATE: inserta un usuario nuevo
async function crearUsuario(db, datos) {
  const doc = { ...datos, activo: true, fecha_alta: new Date(), fecha_baja: null };
  const r = await db.collection("usuarios").insertOne(doc); // guarda el documento en Atlas
  return r.insertedId; 
}

// READ: trae solo los usuarios que NO estan dados de baja
async function listarUsuarios(db) {
  return db.collection("usuarios").find({ activo: true }).toArray();
}

// UPDATE: cambia solo el campo telefono
async function actualizarTelefono(db, id, telefono) {
  return db.collection("usuarios").updateOne(
    { _id: new ObjectId(id), activo: true }, // filtro: cual documento modificar
    { $set: { telefono } }                   // $set cambia solo ese campo
  );
}

// DELETE (baja logica): NO borra, solo marca false y guarda la fecha
async function bajaLogicaUsuario(db, id) {
  return db.collection("usuarios").updateOne(
    { _id: new ObjectId(id) },
    { $set: { activo: false, fecha_baja: new Date() } }
  );
}

// Programa principal
async function main() {
  try {
    await client.connect();               // abre la conexion con Atlas
    const db = client.db("Tienda_Ropa"); 

    const id = await crearUsuario(db, {
      nombre: "Prueba",
      email: "prueba@mail.com",
      telefono: "3510000000",
      direcciones: [{ calle: "Calle 123", ciudad: "Cordoba", principal: true }]
    });
    console.log("CREATE ok, id:", id.toString());

    console.log("READ activos:", (await listarUsuarios(db)).length);

    await actualizarTelefono(db, id, "3519999999");
    console.log("UPDATE ok");

    await bajaLogicaUsuario(db, id);
    console.log("DELETE (baja logica) ok");

    console.log("READ despues de la baja:", (await listarUsuarios(db)).length);
  } catch (e) {
    console.error("Error:", e.message); 
  } finally {
    await client.close();              
  }
}

main();
 