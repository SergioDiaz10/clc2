const { request, response } = require("express");
const pool = require("../db/connection")
const modelojuego = require("../models/personajes");


const getUsers = async (req = request, res = response) =>{
    //estructura basica de cualquier endpoint al conectar en su BD
    let conn;
    //control de exepciones
    try {
        conn = await pool.getConnection()
        //esta es la consulta mas basica, se pueden hacer mas complejas
        const users = await conn.query(modelojuego.quieryGetUsers, (error) => {throw new Error(error) })
        //siempre validar que no se obtuvieron resultados
        if (!users) {
            res.status(404).json({msg:"no se encontraron registros"})
            return
        }
        res.json({users})
        //lo del cath y final siempre sera lo mismo
    } catch (error) {
        console.log(error)
        res.status(500).json({error})
    }finally{
        if(conn){
            conn.end()
        }
    }
}

const getUserByID = async (req = request, res = response) =>{
    //estructura basica de cualquier endpoint al conectar en su BD este indica el numero estatico
    const {id} = req.params

    let conn;
    //control de exepciones
    try {
        conn = await pool.getConnection()
        //esta es la consulta mas basica, se pueden hacer mas complejas
        const [user] = await conn.query(modelojuego.quieryGetUsersByeID, [id], (error) => {throw new Error(error) })
        //siempre validar que no se obtuvieron resultados
        if (!user) {
            res.status(404).json({msg:`no se encontro registro con el id ${id}`})
            return
        }
        res.json({user})
        //lo del cath y final siempre sera lo mismo
    } catch (error) {
        console.log(error)
        res.status(500).json({error})
    }finally{
        if(conn){
            conn.end()
        }
    }
}
const deleteUserByID = async (req = request, res = response) =>{
    //estructura basica de cualquier endpoint al conectar en su BD este indica el numero estatico
    const {id} = req.query

    let conn;
    //control de exepciones
    try {
        conn = await pool.getConnection()
        //esta es la consulta mas basica, se pueden hacer mas complejas EN ESTA SE ACTUALIZARA EL Personaje
        const {affectedRows} = await conn.query(modelojuego.quieryDeleteUsersByeID, [id], (error) => {throw new Error(error) })
        //siempre validar que no se obtuvieron resultados
        if (affectedRows === 0) {
            res.status(404).json({msg:`no se pudo eliminar el registro con el id ${id}`})
            return
        }
        res.json({msg: `El usuario con id ${id} se elimino correctamente.`})
        //lo del cath y final siempre sera lo mismo
    } catch (error) {
        console.log(error)
        res.status(500).json({error})
    }finally{
        if(conn){
            conn.end()
        }
    }
}

const addUser = async (req = request, res = response) =>{
    //estructura basica de cualquier endpoint al conectar en su BD este indica el numero estatico
    const{
        nombre,
        vida,
        entrenamiento,
        objectivofavorito,
        tipodps,
        objectivo,
        espaciovi,
        velocidad,
        activo
       
    } = req.body

    if (
        !nombre||
        !vida||
        !entrenamiento||
        !objectivofavorito||
        !tipodps||
        !objectivo||
        !espaciovi||
        !velocidad||
        !activo
       
    ){
        res.status(400).json({msg:"Falta informacion del personaje"})
        return
    }
  
    let conn;
    //control de exepciones
    try {
        conn = await pool.getConnection()
        
        //tarea aqui que el usuario no se duplique
       const [user] = await conn.query(modelojuego.quieryUsersExists,[nombre])
       
        if(user){
            res.status(403).json({msg: `El personaje ${nombre} ya se encuentra registrado`})
            return
        }
             //esta es la consulta mas basica, se pueden hacer mas complejas EN ESTA SE ACTUALIZARA EL personaje
        const {affectedRows} = await conn.query(modelojuego.quieryAddUser, [
            nombre,
            vida,
            entrenamiento,
            objectivofavorito,
            tipodps,
            objectivo,
            espaciovi,
            velocidad,
            activo
        ], (error) => {throw new Error(error)})
           
        //siempre validar que no se obtuvieron resultados
       
        if (affectedRows === 0) {
            res.status(404).json({msg:`no se pudo agregar el registro del personaje ${nombre}`})
            return
        }
        res.json({msg: `El personaje ${nombre} se agrego correctamente.`})
        //lo del cath y final siempre sera lo mismo
    } catch (error) {
        console.log(error)
        res.status(500).json({error})
    }finally{
        if(conn){
        conn.end()
        }
    }
}

const updateUserBypersonaje = async (req = request, res = response) =>{
    //estructura basica de cualquier endpoint al conectar en su BD este indica el numero estatico
    const {
        nombre,
        vida,
        entrenamiento,
        objectivofavorito,
        tipodps,
        objectivo,
        espaciovi,
        velocidad

    } = req.body

    if (
        !nombre||
        !vida||
        !entrenamiento||
        !objectivofavorito||
        !tipodps||
        !objectivo||
        !espaciovi||
        !velocidad

    ){
        res.status(400).json({msg:"Falta informacion del personaje"})
        return
    }

    let conn;
    //control de exepciones
    try {
        conn = await pool.getConnection()

        //tarea aqui que el usuario no se duplique
       const [user] = await conn.query(modelojuego.quieryGetUsersInfo,[nombre])

       if (!user){
        res.status(403).json({msg: `El personaje ${nombre} no se encuentra registrado`})
       }
        //esta es la consulta mas basica, se pueden hacer mas compleja EN ESTA SE ACTUALIZARA EL PERSONAJE
        //arreglar esta
        const {affectedRows} = await conn.query(modelojuego.quieryUpdateByeUsuario,[
            nombre|| user.nombre,
            vida|| user.vida,
            entrenamiento|| user.entrenamiento,
            objectivofavorito|| user.objectivofavorito,
            tipodps|| user.tipodps,
            objectivo|| user.objectivo,
            espaciovi|| user.espaciovi,
            velocidad|| user.velocidad
            ,
            ]
            , (error) => {throw new Error(error) })
            //'${Genero || ''}',
        //siempre validar que no se obtuvieron resultados
        if (affectedRows === 0) {
            res.status(404).json({msg:`no se pudo actualizar el registro del personaje ${nombre}`})
            return
        }
        res.json({msg: `El personaje ${nombre} se actualizo correctamente.`})
        //lo del cath y final siempre sera lo mismo
    } catch (error) {
        console.log(error)
        res.status(500).json({error})
    }finally{
        if(conn){
            conn.end()
        }
    }
}

module.exports = {getUsers, getUserByID, deleteUserByID, addUser, updateUserBypersonaje}