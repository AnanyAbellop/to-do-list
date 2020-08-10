import React from "react";
import PropTypes from "prop-types";

const Task = ({ toDos, deleteTAsk }) => {
	return (
		<ul className="">
			{toDos.map((task, index) => {
				return (
					<li key={index}>
						{task.label}
						<button onClick={() => deleteTAsk(index)}>X</button>
					</li>
				);
			})}
		</ul>
	);
};
export default Task;

Task.propTypes = {
	toDos: PropTypes.array,
	deleteTAsk: PropTypes.func
};
