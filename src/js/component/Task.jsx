import React from "react";
import PropTypes from "prop-types";

//aqui es donde se reciben los dos props que envie del componente ToDoList hay dos maneras de recibir los props
//asi --> const Task = (props) => { <-- o como lo estoy recibiendo en este componente, se puede invesrigar las
//maneras de recibir props la diferencia es que si los recibimos como props al usarlos debe ser props.toDos.label
//y si los usamos como estas aca solo usamos el nombre ejemplo--> toDos.label
const Task = ({ toDos, deleteTAsk }) => {
	return (
		<ul className="">
			{/*
				aqui es donde recorremos el arreglo de objetos que me estan mandando por props que se llama tOdos
				y lo recorremos con un map el cual itera por cada objeto ,e imprime un li con la tarea correspondiente
				en el li no se nos puede olvidar ponerle el key que en este caso estamos usando el indice del arreglo
			*/}
			{toDos.map((task, index) => {
				return (
					<li key={index}>
						{task.label}
						{/*
						 	esta es la funcion del boton que al darle click llama a la funcion 
							deleteTAsk y le pasa como parametro el indice que se borrara que a su vez 
							en el componente ToDoList esta la funcion que borra la tarea 
						*/}
						<button onClick={() => deleteTAsk(index)}>X</button>
					</li>
				);
			})}
		</ul>
	);
};
export default Task;
//aqui se validan los props que se estan recibiendo que son dos toDos que es un arreglo y deleteTAsk que es una funcion
Task.propTypes = {
	toDos: PropTypes.array,
	deleteTAsk: PropTypes.func
};
