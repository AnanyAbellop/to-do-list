import React, { useEffect, useState, Fragment } from "react";
import Task from "./Task.jsx";
import { Container, Col, Row } from "react-bootstrap";
import PropTypes from "prop-types";

const ToDoList = () => {
	const [userExists, setUserExist] = useState(true);
	const [toDos, setToDos] = useState([]);
	const [task, setTask] = useState("");

	const URL_BASE = "https://assets.breatheco.de/apis/fake/todos";

	const getTask = async () => {
		try {
			const response = await fetch(`${URL_BASE}/user/deimian`);
			if (response.ok) {
				let tasks = await response.json();
				setToDos(tasks);
			} else {
				console.log("Algo falloen la consulta");
			}
		} catch (error) {
			console.log("explote", error);
		}
	};

	const addTask = async event => {
		if (event.keyCode == 13) {
			try {
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
					getTask();
					setTask("");
				} else {
					console.log("Falle");
				}
			} catch (error) {
				console.log("explote");
			}
		}
	};

	const deleteAll = async () => {
		try {
			const response = await fetch(`${URL_BASE}/user/deimian`, {
				method: "DELETE",
				body: JSON.stringify([]),
				headers: {
					"Content-Type": "application/json"
				}
			});
			if (response.ok) {
				console.log("se borro todo");
				setUserExist(true);
			} else {
				console.log("exploteee ");
			}
		} catch (error) {
			console.log("algo fallo delete all");
		}
	};

	const deleteTAsk = async index => {
		try {
			let newTasks = toDos.filter((value, i) => {
				return i != index;
			});

			const response = await fetch(`${URL_BASE}/user/deimian`, {
				method: "PUT",
				body: JSON.stringify(newTasks),
				headers: {
					"Content-Type": "application/json"
				}
			});
			if (response.ok) {
				getTask();
			} else {
				console.log("algo fallo");
				deleteAll();
			}
		} catch (error) {
			console.log("explote", error);
		}
	};

	useEffect(
		() => {
			if (userExists) {
				const verifyUser = async () => {
					try {
						const response = await fetch(
							`${URL_BASE}/user/deimian`
						);
						if (response.ok) {
							getTask();
						} else {
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
								console.log("se creo el usuario");
								getTask();
							} else {
								console.log("Algo fallo al crear el usuario");
							}
						}
						setUserExist(false);
					} catch (error) {
						console.log("explote", error);
					}
				};
				verifyUser();
			}
		},
		[userExists]
	);

	return (
		<Fragment>
			<Container>
				<Row>
					<Col md={12}>
						<h1 className="text-center">To Do List</h1>
					</Col>
					<Col md={12}>
						<input
							className="form-control"
							placeholder="Nueva Tarea"
							onKeyUp={addTask}
							onChange={e => setTask(e.target.value)}
							value={task}
						/>
						<Task toDos={toDos} deleteTAsk={deleteTAsk} />

						{/* <button onClick={() => deleteAll()}>clicme</button> */}
					</Col>
				</Row>
			</Container>
		</Fragment>
	);
};

export default ToDoList;
// ToDoList.propTypes = {
// 	deleteTask: PropTypes.func
// };
