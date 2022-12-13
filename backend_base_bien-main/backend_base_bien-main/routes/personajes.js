const {Router} = require("express")
const {getUsers, getUserByID, deleteUserByID, addUser, updateUserByUsuario} = require("../controllers/personajes")
const router = Router()
//http://localhost:4000/api/v1/clc2/id/2
//http://localhost:4000/api/v1/clc2?id=1
//GET
router.get("/", getUsers)
//lo siguiente despues de //id es el identificador que esta declarado en controllers (la constante)
router.get("/id/:id", getUserByID)
//DELETE
router.delete("/", deleteUserByID)
//POST
router.post("/", addUser)
//put
router.put("/", updateUserByUsuario)
module.exports = router