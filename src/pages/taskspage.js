import React, { useEffect } from "react";
import { connect  } from "react-redux";
import { initTasksPageStarted } from "../redux/actions";
import { Link } from "react-router-dom";
import { PAGES_KEYS } from "./pagekeys";

const TasksDisplayer = props => {
    return (
        <ul>
            {
                props.data.map((task, index) => <li key={index}><Link to={`task/${task.id}`}>{task.Title} - {task.createdOn}</Link></li>)
            }
        </ul>
    )
};

const Tasks = props => {
    let {key, loading, loaded, error, data, disposed, ...other} = props;
    
    useEffect(()=>{
        //componentDidMount
        if(props.initOnServer !== true)
        {
            console.log("REQUESTING ON CLIENT");
            props.dispatch(initTasksPageStarted());
        }

        return () => {
            console.log("END")
            props.dispatch(disposePage(PAGES_KEYS.TASKS));
        };
    }, []);

    console.log("TASKS render - ", other);

    return (
        <div>
            { loading && <h1>loading...</h1>}
            { !loading && error && <h2 style={{color:"red"}}>{error.message}</h2>}
            { data && <TasksDisplayer data={data} />}
        </div>
    );
};

const pageInit = (req, store) => {
    return store.dispatch(initTasksPageStarted());
};

const TasksPage = {component: connect(state => ({...state.pages.tasksPage}))(Tasks), pageInit};

export { TasksPage };