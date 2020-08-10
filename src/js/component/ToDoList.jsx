import React, { useEffect, useState, Fragment } from "react";

//componente que renderiza todas mis tareas, las tareas se las paso por props
import Task from "./Task.jsx";

//Import de los componentes de react/bootstrab
import { Container, Col, Row } from "react-bootstrap";

const ToDoList = () => {
	//hook que me avisa si el usuario existe o no existe, arranca en true porque verifica en la primera carga
	//si el usuario existe
	const [userExists, setUserExist] = useState(true);

	//Este es el hook en donde guardo todas mis tareas, tiene un arreglo vacio porque cada tarea es un objeto
	const [toDos, setToDos] = useState([]);

	//Este hook es el que tiene la tarea que estoy escribiendo en el input, para luego guardarla en mi hook toDos
	const [task, setTask] = useState("");

	//Esta es mi url base de la api la escribi en mayuscolas porque esta no de modifica en el componente, solo se complementa
	//y si otro programador ve que esta en mayuscula sabe que es una variable que no se modifica, sin embargo al ser una
	//variable de tipo cons no permite se modifique
	const URL_BASE = "https://assets.breatheco.de/apis/fake/todos";

	//Esta funcion me trae todas las tareas de la app
	const getTask = async () => {
		try {
			//este es el fetch que hace un GET (consulta) a la api y me trae todas las tareas
			const response = await fetch(`${URL_BASE}/user/deimian`);

			if (response.ok) {
				//Aqui verifico si la consulta responde bien guardo mis tareas en el hook toDos,
				// -->asi --> setToDos(tarea que me responde la api)
				let tasks = await response.json();
				setToDos(tasks);
			} else {
				//si falla la consulta me imprime por consola que fallo, sin embargo los console.log solo se usan en desarrollo
				console.log("Algo falloen la consulta");
			}
		} catch (error) {
			//aqui esta el error si tienes problemas de sintaxis o errores de fetch, igual solo imprimes console.lo para desarrollo
			console.log("explote", error);
		}
	};

	//Esta es una funcion que me agrega la tarea a la app con el metodo PUT, en la documentacion de la api me dice que para actualizar
	//debo hacer un put con todo mi arreglo de objetos
	const addTask = async event => {
		//en este condicional (if) verifico si el usuario le dio a la tecla enter indicando que ya quiere guardar la tarea, el evento keyCode
		//me dice el codigo de la tecla enter
		if (event.keyCode == 13) {
			try {
				//este es el fecth que envia el arreglo nuevo que se guardara en la api
				const response = await fetch(`${URL_BASE}/user/deimian`, {
					method: "PUT",
					body: JSON.stringify([
						...toDos,
						{ label: task, done: false }
					]),
					headers: {
						"Content-Type": "application/json"
					}
				});

				if (response.ok) {
					//aqui verifico que me responde la api en caso que se actualice correctamente llamo la funcion getTask que el me actualiza
					//las tareas que tengo guardada en la api
					getTask();
					//aqui hago que el input este vacio ya que el input toma por valor lo que tenga en el hook task, al darte setTask vacio se borra lo
					//que escribimos en el input
					setTask("");
				} else {
					//error que fallo la carga de mi tarea, nuevamente console.log es solo para desarrollo no los borre para que sepas donde da error
					console.log("fallo la actualizacion");
				}
			} catch (error) {
				//error de consulta de la api, o de sintaxis del fetch
				console.log("explote");
			}
		}
	};

	//este metodo cuando se llama borra todas las tareas, Todas la tareas
	const deleteAll = async () => {
		try {
			//fetch que borras todas las tareas, en la documentacion de la api dice que si haces
			//DELETE con un arreglo vacio se borran todas las tareas
			const response = await fetch(`${URL_BASE}/user/deimian`, {
				method: "DELETE",
				body: JSON.stringify([]),
				headers: {
					"Content-Type": "application/json"
				}
			});

			if (response.ok) {
				//Aqui si me borra las tareas le,cambio el estado al hook de userExist a true para que me
				//verifique de nuevo si el usuario existe y en caso que no lo cree de nuevo, esto es para que nunca
				//este vacio las tareas. cabe destacar que al cambiar el userExiste a true se ejecuta el useEffect
				//que verifica si el usuario existe si no existe lo crea
				setUserExist(true);
			} else {
				console.log("falle");
				//error si falla al borrar todas las tareas
			}
		} catch (error) {
			//error en caso de que falle la consulta a la api, recordar que los console solo se usn en dearrollo
			console.log("algo fallo delete all");
		}
	};

	//esta funcion borra una sola tarea la cual le pasamos el indice de la tarea que borraremos
	const deleteTAsk = async index => {
		try {
			//aqui le asignamos a la variable newTask el nuevo arreglo y sacamos el indice que vamos a borrar
			//usando la funcion filter se puede investigar mas sobre esta funcion para que la entiendas mejor
			//de como funciona
			let newTasks = toDos.filter((value, i) => {
				return i != index;
			});

			//aqui agarro mi nueva variable newTask que tiene el nuevo arreglo ya sin la tarea que vamos a borrar
			//y le hacemos un PUT a la api con el nuevo arreglo de objetos, debemos recordar que en la documentacio
			//de eta api nos dice que para actualiozar enviamos un PUT sin la tarea que vamos a eliminar, por eso la eliminamos
			//antes y le enviamos nestro nuevo arreglo
			const response = await fetch(`${URL_BASE}/user/deimian`, {
				method: "PUT",
				body: JSON.stringify(newTasks),
				headers: {
					"Content-Type": "application/json"
				}
			});
			if (response.ok) {
				//Si se actualiza correctamente la api, llamo a la funciopn getTask que esta me actualioza mis tareas
				//la llamamos porque acabamos de borrar una tarea de la api y queremos que se actualice las tareas
				getTask();
			} else {
				//en caso de error
				console.log("algo fallo");
				deleteAll();
			}
		} catch (error) {
			//En caso de rror de api o sintaxis
			console.log("explote", error);
		}
	};

	//El Hook de efecto te permite llevar a cabo efectos secundarios en componentes funcionales,
	//este se va a renderizar siempre y cuando userExist este en true y aqui es donde verifico si el usuario esta
	//creado y si no lo esta lo creo
	useEffect(
		() => {
			//verifico que userExists este en true y ejecuto el useEffect
			if (userExists) {
				//Funcion que me verifica que elusuario existe
				const verifyUser = async () => {
					try {
						//consulta a la api con un GET en donde me reponde si el usuario existe o no
						const response = await fetch(
							`${URL_BASE}/user/deimian`
						);
						//si el usuario esiste llamo a la funcion getTask para que me muestre las tareas que tiene  creadas
						if (response.ok) {
							getTask();
						} else {
							//si no hay un usuario creado entonces lo agrego, hago mi fetch POST como nos indica la app
							//con un array vacio para crear un nuevo usuario
							const addUser = await fetch(
								`${URL_BASE}/user/deimian`,
								{
									method: "POST",
									body: JSON.stringify([]),
									headers: {
										"Content-Type": "application/json"
									}
								}
							);

							if (addUser.ok) {
								//si el usuario se creo satifactoriamente llamamos a la funcion getTask para que me actualice las tareas
								getTask();
							} else {
								//Si no pues bueno debemos arrojar un error, recordar esto es solo para desarrollo jajaja
								console.log("Algo fallo al crear el usuario");
							}
						}
						//al finalizar esta funcion cambiamos que el user ya existe a false para que no se ejecute mas este useEFfect
						setUserExist(false);
					} catch (error) {
						//error de falla de coneulta de api
						console.log("explote", error);
					}
				};
				verifyUser();
			}
		},
		[userExists] //aqui e; useEffect esta escuchando este hook para que cada vez que cambie a true se ejecura y crea de nuevo el usuario en caso de no existir
	);

	return (
		<Fragment>
			<Container>
				<Row>
					{/*
					 este Col es un componente de react-bootstrap  que simplemete me imprime
					un h1 que me imprime el titulo de mi to do list
					*/}
					<Col md={12}>
						<h1 className="text-center">To Do List</h1>
					</Col>
					<Col md={12}>
						{/* 
							este es el input en donde escribimos la tarea, el cual tiene una clase, un placeholder 
							una funcion onKEyUp que es la que detecta la tecla que le de, una funcion onchange 
							que me va guardando el el hook task lo que se este escribiendo en el input y le asignamos
							el value del hook task
						*/}
						<input
							className="form-control"
							placeholder="Nueva Tarea"
							onKeyUp={addTask}
							onChange={e => setTask(e.target.value)}
							value={task}
						/>

						{/* 
							este es componente que me imprime las tareas es un componente el cual le envio por popps
							la listas de las tareas para que en el componente ella se encargue de renderizar las tareas 
							tambien tiene otro prop que de llama deleteTAsk que el recibe del componente el indice que debo
							borrar cuando se le de borrar, toDos son todas las tareas son un arreglo de objetos y deleteTAsk 
							es una funcion que recibe por parametro el indice y borra ese indice delas tareas
						*/}
						<Task toDos={toDos} deleteTAsk={deleteTAsk} />
					</Col>
				</Row>
			</Container>
		</Fragment>
	);
};

export default ToDoList;
