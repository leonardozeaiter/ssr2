import React, { useEffect } from "react";
import { connect  } from "react-redux";
import { initTaskPageStarted } from "../redux/actions";
import { PAGES_KEYS } from "./pagekeys";

const TaskDisplayer = props => {
    return (
        <div>
            <h3>{props.data.title}</h3>
            <p>{props.data.createdOn}</p>
        </div>
    )
};

const Task = props => {
    let {key, loading, loaded, error, data, disposed, id, ...other} = props;
  
    console.log("TASK PAGE RENDER ", props);

    useEffect(()=>{
        //componentDidMount
        if(props.initOnServer !== true)
        {
            console.log("REQUESTING ON CLIENT");
            props.dispatch(initTaskPageStarted());
        }

        return () => {
            console.log("END")
            props.dispatch(disposePage(PAGES_KEYS.TASK));
        };
    }, []);

    return (
        <div>
            { loading && <h1>loading...</h1>}
            { !loading && error && <h2 style={{color:"red"}}>{error.message}</h2>}
            { data && <TaskDisplayer data={data} />}
        </div>
    );
};

const pageInit = (req, store) => {
    //req.path is /task/1

    return store.dispatch(initTaskPageStarted(req.url.split("/")[2]));
};

const TaskPage = {component: connect(state => ({...state.pages.taskPage}))(Task), pageInit};

export { TaskPage };